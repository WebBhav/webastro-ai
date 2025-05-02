"use client";

import type { FormEvent } from "react";
import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Loader2, Sparkles, Zap, BrainCircuit } from "lucide-react";
import { getAstrologicalInsights } from "@/ai/flows/astrological-insights";
import { getPromptSuggestions } from "@/ai/flows/prompt-suggestions";
import { useToast } from "@/hooks/use-toast";
import { format } from 'date-fns';

interface Message {
  id: string;
  text: string | React.ReactNode; // Allow React nodes for richer formatting
  sender: "user" | "ai";
}

// Sample prompt suggestions (can be fetched dynamically later)
const initialPrompts = [
  "Tell me about my personality based on my birth chart.",
  "What does my life path look like?",
  "How are the current planets affecting me?",
];

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [promptSuggestions, setPromptSuggestions] = useState<string[]>(initialPrompts);
  const [showSuggestions, setShowSuggestions] = useState(true); // Show suggestions initially
  const [birthDetails, setBirthDetails] = useState<{ date: string, time: string, location: string } | null>(null); // Store user birth details

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

   // Function to fetch prompt suggestions (can be called on specific events)
   const fetchSuggestions = async () => {
    // Example: Fetch general suggestions initially
    try {
      const response = await getPromptSuggestions({});
      if (response.suggestions && response.suggestions.length > 0) {
        setPromptSuggestions(response.suggestions);
      }
    } catch (error) {
      console.error("Error fetching prompt suggestions:", error);
      // Keep default suggestions or show error
    }
  };

  // Fetch suggestions on component mount
   useEffect(() => {
    // fetchSuggestions(); // Uncomment if you want dynamic suggestions on load
   }, []);


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
    // Optionally, directly send the message after clicking a prompt
    handleSubmit(undefined, prompt);
     setShowSuggestions(false);
  };

   // Simplified request for birth details
   const requestBirthDetails = () => {
    addMessage(
        <div className="space-y-2">
          <p>To provide personalized insights, I need your birth details:</p>
          <ul className="list-disc list-inside text-sm">
            <li>Birth Date (YYYY-MM-DD)</li>
            <li>Birth Time (HH:MM, 24-hour format)</li>
            <li>Birth Location (City, Country)</li>
          </ul>
          <p className="text-xs text-muted-foreground">Example: 1990-05-15 14:30 London, UK</p>
          <p className="text-xs text-muted-foreground font-semibold">Please provide them in your next message.</p>
        </div>,
      "ai"
    );
   };

   // Basic check if a message looks like it contains birth details
   const parseBirthDetails = (text: string): { date: string, time: string, location: string } | null => {
    const detailsRegex = /(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2})\s+([\w\s,]+)/i;
    const match = text.match(detailsRegex);
    if (match && match.length === 4) {
        const date = match[1];
        const time = match[2];
        const location = match[3].trim();
         // Basic validation (can be improved)
        if (!isNaN(new Date(date).getTime()) && /^\d{2}:\d{2}$/.test(time) && location.length > 3) {
             return { date, time, location };
        }
    }
    return null;
   }


  const handleSubmit = async (event?: FormEvent<HTMLFormElement>, promptText?: string) => {
    event?.preventDefault();
    const userMessage = promptText || input.trim();

    if (!userMessage || isLoading) return;

    addMessage(userMessage, "user");
    setInput(""); // Clear input after sending
    setIsLoading(true);

    try {
        // Check if we need birth details and don't have them
        if (!birthDetails && userMessage.toLowerCase().includes("birth chart")) {
            requestBirthDetails();
            setIsLoading(false);
            return;
        }

        // Check if the user provided birth details
        const parsedDetails = parseBirthDetails(userMessage);
        if (parsedDetails) {
            setBirthDetails(parsedDetails);
            addMessage("Thank you! I've saved your birth details. Feel free to ask your questions now.", "ai");
            setIsLoading(false);
            return;
        }

        // If we have birth details, proceed with the AI call
        if (birthDetails) {
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

        } else {
             // Handle general queries if no birth details needed or provided yet
             // For now, just ask for birth details if not provided
             requestBirthDetails();
        }

    } catch (error) {
      console.error("Error calling AI:", error);
      addMessage("Sorry, I encountered an error. Please try again.", "ai");
      toast({
        title: "Error",
        description: "Failed to get astrological insights. Please check your connection and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
              }`}
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
            <div className="flex items-start gap-3 justify-start">
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
        {showSuggestions && messages.length === 0 && (
            <div className="mb-4 fade-in">
                <p className="text-sm text-muted-foreground mb-2 text-center">Need inspiration? Try asking:</p>
                <div className="flex flex-wrap justify-center gap-2">
                {promptSuggestions.map((prompt, index) => (
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
          disabled={isLoading}
          aria-label="Chat input"
        />
        <Button type="submit" size="icon" disabled={isLoading || !input.trim()} className="bg-accent text-accent-foreground hover:bg-accent/90">
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
