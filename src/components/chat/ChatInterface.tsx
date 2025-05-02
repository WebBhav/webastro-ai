
"use client";

import type { FormEvent } from "react";
import { useState, useRef, useEffect, useCallback } from "react";
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

  // Function to add a new message to the state
   const addMessage = useCallback((text: string | React.ReactNode, sender: "user" | "ai", explicitId?: string) => {
    const id = explicitId || `${sender}-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    setMessages((prev) => {
      // Avoid adding duplicate initial messages if component re-renders
      if (sender === 'ai' && prev.some(msg => msg.id.startsWith('initial-message-'))) {
        const existingInitial = prev.find(msg => msg.id.startsWith('initial-message-'));
        if (existingInitial && existingInitial.text === text) return prev;
      }
      return [...prev, { id, text, sender }];
    });
    if (sender === 'user') {
      setShowSuggestions(false); // Hide suggestions after user sends a message
    }
  }, []); // Empty dependency array as it doesn't depend on component state directly


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
        "What's my life path?",
        "What's happening now?",
      ]);
      setShowSuggestions(true);
    }
  };

  // Load birth details from localStorage and fetch suggestions on mount
  useEffect(() => {
    let detailsLoaded = false;
    try {
      const storedDetails = localStorage.getItem(BIRTH_DETAILS_STORAGE_KEY);
      if (storedDetails) {
          const parsedDetails: BirthDetails = JSON.parse(storedDetails);
          // Basic validation of loaded data
          if (parsedDetails.date && parsedDetails.time && parsedDetails.location) {
            setBirthDetails(parsedDetails);
            detailsLoaded = true;
            fetchSuggestions(); // Fetch suggestions only if details are loaded
            addMessage(
              `Welcome back! Using your saved birth details: ${parsedDetails.date}, ${parsedDetails.time}, ${parsedDetails.location}. How can I help you today?`,
              "ai",
              `initial-message-${Date.now()}`
            );
          }
      }
    } catch (e) {
       console.error("Failed to parse birth details from storage:", e);
       // Don't toast immediately, let the redirect handle it
    }

    if (!detailsLoaded) {
      // No details found or invalid, redirect immediately
      toast({ title: "Birth details required.", description: "Please enter your details to start.", variant: "destructive"});
      router.push('/get-started');
    } else {
       setInitialLoading(false); // Mark initial check as complete only if details loaded successfully
    }
  }, [router, toast, addMessage]); // Add addMessage here


  // Scroll to bottom when messages update
  useEffect(() => {
    if (scrollAreaRef.current) {
      // Use setTimeout to ensure scroll happens after DOM updates
      setTimeout(() => {
           scrollAreaRef.current?.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: "smooth",
            });
      }, 100); // Increased delay slightly
    }
  }, [messages]);


  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
    // Directly send the message after clicking a prompt
    handleSubmit(undefined, prompt);
    setShowSuggestions(false);
  };

  const handleSubmit = async (event?: FormEvent<HTMLFormElement>, promptText?: string) => {
    event?.preventDefault();
    const userMessage = promptText || input.trim();

     // Re-check birth details *before* making the call
    const currentDetails = birthDetails ?? JSON.parse(localStorage.getItem(BIRTH_DETAILS_STORAGE_KEY) || 'null');


    if (!userMessage || isLoading || !currentDetails) {
        if(!currentDetails && !initialLoading) {
             toast({ title: "Missing Birth Details", description: "Cannot process request without birth details. Redirecting...", variant: "destructive" });
             router.push('/get-started');
        } else if (!userMessage) {
            toast({ title: "Empty Message", description: "Please enter your question.", variant: "destructive" });
        }
        return; // Don't proceed if loading, no message, or no birth details
    }

    // Ensure birthDetails state is updated if it wasn't initially
    if (!birthDetails && currentDetails) {
        setBirthDetails(currentDetails);
    }


    addMessage(userMessage, "user");
    setInput(""); // Clear input after sending
    setIsLoading(true);

    try {
         const currentDate = format(new Date(), 'yyyy-MM-dd');
         const currentTime = format(new Date(), 'HH:mm');
         // For simplicity, using birth location as current location. A better app would get current location.
         const currentLocation = currentDetails.location;

        const response = await getAstrologicalInsights({
            birthDate: currentDetails.date,
            birthTime: currentDetails.time,
            birthLocation: currentDetails.location,
            currentDate: currentDate,
            currentTime: currentTime,
            currentLocation: currentLocation, // Use birth location as current for simplicity
        });

        // Format the AI response for better readability (simplified)
         const formattedResponse = (
            <div className="space-y-3 text-sm"> {/* Reduced spacing and font size */}
                {response.personalityInsights && (
                    <div>
                        <h3 className="font-semibold text-primary mb-1 flex items-center gap-1"><BrainCircuit size={16}/> Personality:</h3>
                        <p>{response.personalityInsights}</p>
                    </div>
                )}
                {response.lifePathInsights && (
                     <div>
                        <h3 className="font-semibold text-primary mb-1 flex items-center gap-1"><Zap size={16}/> Life Path:</h3>
                        <p>{response.lifePathInsights}</p>
                    </div>
                )}
                {response.currentTransitInsights && (
                     <div>
                        <h3 className="font-semibold text-primary mb-1 flex items-center gap-1"><Sparkles size={16}/> Current Influences:</h3>
                        <p>{response.currentTransitInsights}</p>
                    </div>
                )}
            </div>
        );
        addMessage(formattedResponse, "ai");

    } catch (error) {
      console.error("Error calling AI:", error);
      addMessage("Sorry, I had trouble understanding that. Could you try asking in a different way?", "ai");
      toast({
        title: "AI Error",
        description: "Failed to get astrological insights. Please try again.",
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
              key={message.id} // Use the unique ID generated in addMessage
              className={`flex items-start gap-3 ${
                message.sender === "user" ? "justify-end" : "justify-start"
              } animate-in fade-in duration-300`}
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
                 {/* Render string or React node */}
                 {message.text}
              </div>
              {message.sender === "user" && (
                <Avatar className="h-8 w-8">
                   <AvatarFallback className="bg-accent text-accent-foreground">U</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div key={`loading-${Date.now()}`} className="flex items-start gap-3 justify-start animate-pulse">
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
        {showSuggestions && messages.length > 0 && !isLoading && ( // Conditionally show suggestions
            <div className="mb-4 fade-in">
                <p className="text-sm text-muted-foreground mb-2 text-center">Try asking:</p>
                <div className="flex flex-wrap justify-center gap-2">
                {promptSuggestions.slice(0, 3).map((prompt, index) => (
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
