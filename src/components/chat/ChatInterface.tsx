"use client";

import type { FormEvent } from "react";
import { useState, useRef, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Loader2, Sparkles, Zap, BrainCircuit } from "lucide-react";
import { getAstrologicalInsights } from "@/ai/flows/astrological-insights";
import { getPromptSuggestions } from "@/ai/flows/prompt-suggestions";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';

// Define the localStorage key
const BIRTH_DETAILS_STORAGE_KEY = 'webastro_birth_details';

interface Message {
  id: string;
  text: string | React.ReactNode; // Allow React nodes for richer formatting
  sender: "user" | "ai";
}

interface BirthDetails {
  date: string;
  time: string;
  location: string;
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [promptSuggestions, setPromptSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false); // Hide suggestions initially until details loaded
  const [birthDetails, setBirthDetails] = useState<BirthDetails | null>(null);
  const [initialLoading, setInitialLoading] = useState(true); // Track initial loading/redirect check

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const router = useRouter();

  // Function to fetch prompt suggestions
  const fetchSuggestions = async () => {
    try {
      const response = await getPromptSuggestions({});
      if (response.suggestions && response.suggestions.length > 0) {
        setPromptSuggestions(response.suggestions);
        setShowSuggestions(true); // Show suggestions after fetching
      }
    } catch (error) {
      console.error("Error fetching prompt suggestions:", error);
      // Optionally show default suggestions or an error message
      setPromptSuggestions([
        "Tell me about my personality.",
        "What are the major themes in my life?",
        "What's happening for me astrologically right now?",
      ]);
      setShowSuggestions(true);
    }
  };

  // Load birth details from localStorage and fetch suggestions on mount
  useEffect(() => {
    const storedDetails = localStorage.getItem(BIRTH_DETAILS_STORAGE_KEY);
    if (storedDetails) {
      try {
        const parsedDetails: BirthDetails = JSON.parse(storedDetails);
        // Basic validation of loaded data
        if (parsedDetails.date && parsedDetails.time && parsedDetails.location) {
          setBirthDetails(parsedDetails);
          fetchSuggestions(); // Fetch suggestions only if details are loaded
          addMessage(
            `Welcome back! Using your saved birth details: ${parsedDetails.date}, ${parsedDetails.time}, ${parsedDetails.location}. Ask me anything!`,
            "ai"
          );
        } else {
          // Invalid data found, redirect
          toast({ title: "Birth details incomplete.", description: "Please re-enter your details.", variant: "destructive"});
          router.push('/get-started');
        }
      } catch (e) {
         console.error("Failed to parse birth details from storage:", e);
         toast({ title: "Error loading details.", description: "Please re-enter your details.", variant: "destructive"});
         router.push('/get-started');
      }
    } else {
      // No details found, redirect immediately
      toast({ title: "Birth details required.", description: "Please enter your details to start.", variant: "destructive"});
      router.push('/get-started');
    }
    setInitialLoading(false); // Mark initial check as complete
  }, [router, toast]); // Add router and toast to dependencies


  // Scroll to bottom when messages update
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // Function to add a new message to the state
  const addMessage = (text: string | React.ReactNode, sender: "user" | "ai") => {
    setMessages((prev) => [...prev, { id: Date.now().toString(), text, sender }]);
     if (sender === 'user') {
      setShowSuggestions(false); // Hide suggestions after user sends a message
    }
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
    // Directly send the message after clicking a prompt
    handleSubmit(undefined, prompt);
    setShowSuggestions(false);
  };

  const handleSubmit = async (event?: FormEvent<HTMLFormElement>, promptText?: string) => {
    event?.preventDefault();
    const userMessage = promptText || input.trim();

    if (!userMessage || isLoading || !birthDetails) {
        if(!birthDetails && !initialLoading) {
             toast({ title: "Missing Birth Details", description: "Cannot process request without birth details. Redirecting...", variant: "destructive" });
             router.push('/get-started');
        }
        return; // Don't proceed if loading, no message, or no birth details (after initial check)
    }


    addMessage(userMessage, "user");
    setInput(""); // Clear input after sending
    setIsLoading(true);

    try {
         const currentDate = format(new Date(), 'yyyy-MM-dd');
         const currentTime = format(new Date(), 'HH:mm');
         // For simplicity, using birth location as current location. A better app would get current location.
         const currentLocation = birthDetails.location;

        const response = await getAstrologicalInsights({
            birthDate: birthDetails.date,
            birthTime: birthDetails.time,
            birthLocation: birthDetails.location,
            currentDate: currentDate,
            currentTime: currentTime,
            currentLocation: currentLocation, // Use birth location as current for simplicity
        });

        // Format the AI response for better readability
         const formattedResponse = (
            <div className="space-y-4">
                {response.personalityInsights && (
                    <div>
                        <h3 className="font-semibold text-primary mb-1 flex items-center gap-1"><BrainCircuit size={16}/> Personality Insights:</h3>
                        <p className="text-sm">{response.personalityInsights}</p>
                    </div>
                )}
                {response.lifePathInsights && (
                     <div>
                        <h3 className="font-semibold text-primary mb-1 flex items-center gap-1"><Zap size={16}/> Life Path Insights:</h3>
                        <p className="text-sm">{response.lifePathInsights}</p>
                    </div>
                )}
                {response.currentTransitInsights && (
                     <div>
                        <h3 className="font-semibold text-primary mb-1 flex items-center gap-1"><Sparkles size={16}/> Current Transit Insights:</h3>
                        <p className="text-sm">{response.currentTransitInsights}</p>
                    </div>
                )}
            </div>
        );
        addMessage(formattedResponse, "ai");

    } catch (error) {
      console.error("Error calling AI:", error);
      addMessage("Sorry, I encountered an error processing your request. Please try again.", "ai");
      toast({
        title: "AI Error",
        description: "Failed to get astrological insights. Please check the details and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading indicator while checking for details/redirecting
  if (initialLoading) {
     return (
       <div className="flex flex-col flex-grow items-center justify-center min-h-screen bg-background">
         <Loader2 className="h-12 w-12 animate-spin text-primary" />
         <p className="mt-4 text-muted-foreground">Loading your cosmic connection...</p>
       </div>
     );
  }

  return (
    <div className="flex flex-col flex-grow overflow-hidden p-4">
      {/* Chat Messages Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-grow mb-4 pr-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-3 ${
                message.sender === "user" ? "justify-end" : "justify-start"
              } animate-in fade-in duration-300`} // Added fade-in animation
            >
              {message.sender === "ai" && (
                <Avatar className="h-8 w-8 border border-accent">
                  <AvatarImage src="/astro-ai-avatar.png" alt="AI Avatar" data-ai-hint="robot nebula avatar" />
                   <AvatarFallback className="bg-primary text-primary-foreground">
                    <Sparkles size={16} />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`rounded-lg p-3 max-w-xs md:max-w-md lg:max-w-lg shadow-md break-words ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                 {typeof message.text === 'string' ? (
                     <p className="text-sm">{message.text}</p>
                ) : (
                    message.text // Render React node directly
                )}
              </div>
              {message.sender === "user" && (
                <Avatar className="h-8 w-8">
                   <AvatarFallback className="bg-accent text-accent-foreground">U</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3 justify-start animate-pulse"> {/* Added pulse animation */}
              <Avatar className="h-8 w-8 border border-accent">
                <AvatarImage src="/astro-ai-avatar.png" alt="AI Avatar" />
                 <AvatarFallback className="bg-primary text-primary-foreground">
                   <Sparkles size={16} />
                 </AvatarFallback>
              </Avatar>
              <div className="rounded-lg p-3 bg-secondary text-secondary-foreground shadow-md">
                <Loader2 className="h-5 w-5 animate-spin text-accent" />
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

       {/* Prompt Suggestions */}
        {showSuggestions && messages.length > 1 && !isLoading && ( // Show only after initial message and not loading
            <div className="mb-4 fade-in">
                <p className="text-sm text-muted-foreground mb-2 text-center">Or try asking:</p>
                <div className="flex flex-wrap justify-center gap-2">
                {promptSuggestions.slice(0, 3).map((prompt, index) => ( // Limit suggestions shown
                    <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePromptClick(prompt)}
                    className="bg-background hover:bg-accent/10 border-accent text-accent hover:text-accent transition-colors duration-200"
                    >
                    {prompt}
                    </Button>
                ))}
                </div>
            </div>
        )}


      {/* Input Area */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t pt-4 border-border/50"
      >
        <Input
          type="text"
          placeholder="Ask about your stars..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow focus-visible:ring-accent"
          disabled={isLoading || initialLoading} // Also disable during initial check
          aria-label="Chat input"
        />
        <Button type="submit" size="icon" disabled={isLoading || initialLoading || !input.trim()} className="bg-accent text-accent-foreground hover:bg-accent/90">
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Send className="h-5 w-5" />
          )}
          <span className="sr-only">Send message</span>
        </Button>
      </form>
    </div>
  );
}
