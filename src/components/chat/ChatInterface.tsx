
"use client";

import type { FormEvent } from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Send, Loader2, Sparkles, Zap, BrainCircuit, MessageSquareQuote } from "lucide-react"; // Replaced MessageSquareQuestion with MessageSquareQuote
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
  language: string; // Added language
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
      // Prevent adding duplicate initial welcome messages during strict mode re-renders
      const welcomeMessageIdentifier = 'Welcome! Using your saved birth details';
      if (sender === 'ai' && text && typeof text === 'string' && text.startsWith(welcomeMessageIdentifier)) {
        const existingWelcome = prev.find(msg => typeof msg.text === 'string' && msg.text?.startsWith(welcomeMessageIdentifier));
        if (existingWelcome) return prev; // Don't add another welcome message
      }
      return [...prev, { id, text, sender }];
    });
    if (sender === 'user') {
      setShowSuggestions(false); // Hide suggestions after user sends a message
    }
  }, []);


  // Function to fetch prompt suggestions
  const fetchSuggestions = async () => {
    try {
      // Add a topic to get more relevant suggestions
      const response = await getPromptSuggestions({ topic: "initial insights" });
      if (response.suggestions && response.suggestions.length > 0) {
        // Filter suggestions slightly if needed, or use directly
        const filteredSuggestions = response.suggestions.filter(s => s.length < 60).slice(0, 3); // Keep suggestions concise
        setPromptSuggestions(filteredSuggestions.length > 0 ? filteredSuggestions : [
            "What are my core personality traits?", // Simplified prompt suggestions
            "Tell me about my life path.",
            "What's the energy like for me now?",
        ]); // Fallback suggestions
      } else {
          setPromptSuggestions([
             "What are my core personality traits?",
            "Tell me about my life path.",
            "What's the energy like for me now?",
        ]); // Fallback suggestions
      }
      setShowSuggestions(true); // Show suggestions after fetching
    } catch (error) {
      console.error("Error fetching prompt suggestions:", error);
      // Use default suggestions on error
      setPromptSuggestions([
          "What are my core personality traits?",
          "Tell me about my life path.",
          "What's the energy like for me now?",
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
          // Basic validation of loaded data (including language)
          if (parsedDetails.date && parsedDetails.time && parsedDetails.location && parsedDetails.language) {
            setBirthDetails(parsedDetails);
            detailsLoaded = true;
            // Updated welcome message
            addMessage(
              `Welcome! Using your saved birth details (${parsedDetails.date} ${parsedDetails.time}, ${parsedDetails.location}). Ask me anything about your chart!`,
              "ai",
              `initial-message-${Date.now()}` // Unique ID for initial message
            );
            fetchSuggestions(); // Fetch suggestions only if details are loaded
          } else {
            console.warn("Stored birth details are incomplete or invalid:", parsedDetails);
             // Clear potentially corrupted data
             localStorage.removeItem(BIRTH_DETAILS_STORAGE_KEY);
          }
      }
    } catch (e) {
       console.error("Failed to parse birth details from storage:", e);
       // Clear potentially corrupted data
       localStorage.removeItem(BIRTH_DETAILS_STORAGE_KEY);
       // Don't toast immediately, let the redirect handle it
    }

    if (!detailsLoaded) {
      // No details found or invalid, redirect immediately
      toast({ title: "Birth details required.", description: "Please enter your details to start.", variant: "destructive"});
      router.push('/get-started');
    } else {
       setInitialLoading(false); // Mark initial check as complete only if details loaded successfully
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, toast]); // Removed addMessage, fetchSuggestions to run only once on mount


  // Scroll to bottom when messages update
  useEffect(() => {
    if (scrollAreaRef.current) {
      // Use setTimeout to ensure scroll happens after DOM updates
      setTimeout(() => {
           const scrollElement = scrollAreaRef.current?.children[0]; // Target the viewport
            if (scrollElement) {
                 scrollElement.scrollTo({
                    top: scrollElement.scrollHeight,
                    behavior: "smooth",
                });
            }
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
    const currentDetailsString = localStorage.getItem(BIRTH_DETAILS_STORAGE_KEY);
    let currentDetails: BirthDetails | null = null;
     try {
        if (currentDetailsString) {
            currentDetails = JSON.parse(currentDetailsString);
            // Validate again
            if (!currentDetails?.date || !currentDetails?.time || !currentDetails?.location || !currentDetails?.language) {
                console.warn("Invalid details found during submit:", currentDetails);
                currentDetails = null; // Invalidate if incomplete
                localStorage.removeItem(BIRTH_DETAILS_STORAGE_KEY);
            }
        }
     } catch (e) {
        console.error("Error parsing birth details during submit:", e);
        localStorage.removeItem(BIRTH_DETAILS_STORAGE_KEY); // Clear potentially corrupted data
     }


    if (!userMessage || isLoading || !currentDetails) {
        if(!currentDetails && !initialLoading) {
             toast({ title: "Missing Birth Details", description: "Cannot process request without birth details. Redirecting...", variant: "destructive" });
             router.push('/get-started');
        } else if (!userMessage) {
            toast({ title: "Empty Message", description: "Please enter your question.", variant: "destructive" });
        }
        return; // Don't proceed if loading, no message, or no birth details
    }

    // Ensure birthDetails state is updated if it wasn't initially (e.g., due to fast navigation)
    if (!birthDetails) {
        setBirthDetails(currentDetails);
    }


    const userMessageId = `user-${Date.now()}-${Math.random().toString(36).substring(7)}`;
    addMessage(userMessage, "user", userMessageId);
    setInput(""); // Clear input after sending
    setIsLoading(true);
    setShowSuggestions(false); // Hide suggestions while loading AI response

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
            userQuery: userMessage, // Pass the user's message
            language: currentDetails.language, // Pass the language
        });

        // Format the AI response for better readability
         const formattedResponse = (
            <div className="space-y-3 text-sm"> {/* Consistent spacing and font size */}
                {response.directAnswer && ( // Show direct answer first if available
                    <div>
                        <h3 className="font-semibold text-primary mb-1 flex items-center gap-1"><MessageSquareQuote size={16}/> Answer:</h3> {/* Use MessageSquareQuote */}
                        <p>{response.directAnswer}</p>
                    </div>
                )}
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
        const aiMessageId = `ai-${Date.now()}-${Math.random().toString(36).substring(7)}`;
        addMessage(formattedResponse, "ai", aiMessageId);

    } catch (error: unknown) {
      // Log the full error object for better debugging
      console.error("Detailed Error calling AI:", error);

      let errorMessage = "Sorry, I encountered an unexpected issue while consulting the stars. Please try rephrasing or ask again later.";
      if (error instanceof Error) {
        // Provide a simpler error message to the user
        errorMessage = `Sorry, I had trouble understanding that. Could you try asking in a different way?`;
      }
        const errorId = `ai-error-${Date.now()}-${Math.random().toString(36).substring(7)}`;
      addMessage(errorMessage, "ai", errorId);
      toast({
        title: "AI Error",
        description: "Couldn't get insights right now. Please try again shortly.", // Simplified toast
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      // Optionally fetch new suggestions after response, or keep them hidden
      // fetchSuggestions(); // Uncomment to show new suggestions after AI response
    }
  };

  // Show loading indicator while checking for details/redirecting
  if (initialLoading) {
     return (
        // Use the global Loading component styling
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-gradient-to-br from-background via-secondary/80 to-background backdrop-blur-sm">
            <div className="flex flex-col items-center space-y-6 text-center p-8 bg-card/80 rounded-lg shadow-2xl max-w-sm">
                <div className="relative">
                <Loader2 className="h-20 w-20 animate-spin text-primary opacity-50" />
                <Sparkles className="absolute inset-0 m-auto h-12 w-12 text-accent animate-pulse" />
                </div>
                <p className="text-2xl font-semibold text-primary animate-pulse">
                Checking Your Details...
                </p>
                <p className="text-md text-muted-foreground">
                Please wait while we load your astrological connection.
                </p>
            </div>
        </div>
     );
  }

  return (
    <div className="flex flex-col flex-grow overflow-hidden p-4">
      {/* Chat Messages Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-grow mb-4 pr-4 [&>div>div]:!block"> {/* Ensure viewport div is block */}
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id} // Use the unique ID generated in addMessage
              className={`flex items-start gap-3 ${
                message.sender === "user" ? "justify-end" : "justify-start"
              } animate-in fade-in duration-300`}
            >
              {message.sender === "ai" && (
                <Avatar className="h-8 w-8 border border-accent shrink-0"> {/* Added shrink-0 */}
                  {/* Placeholder image path, replace if you have one */}
                  <AvatarImage src="/placeholder-avatar.png" alt="AI Avatar" data-ai-hint="robot nebula avatar" />
                   <AvatarFallback className="bg-primary text-primary-foreground">
                    <Sparkles size={16} />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`rounded-lg p-3 max-w-xs md:max-w-md lg:max-w-lg shadow-md break-words ${
                  message.sender === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-card text-card-foreground border" // Use card style for AI
                }`}
              >
                 {/* Render string or React node */}
                 {message.text}
              </div>
              {message.sender === "user" && (
                <Avatar className="h-8 w-8 shrink-0"> {/* Added shrink-0 */}
                   <AvatarFallback className="bg-accent text-accent-foreground">U</AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
             <div key={`loading-indicator`} className="flex items-start gap-3 justify-start animate-pulse">
              <Avatar className="h-8 w-8 border border-accent shrink-0">
                 <AvatarImage src="/placeholder-avatar.png" alt="AI Avatar" />
                 <AvatarFallback className="bg-primary text-primary-foreground">
                   <Sparkles size={16} />
                 </AvatarFallback>
              </Avatar>
              <div className="rounded-lg p-3 bg-secondary text-secondary-foreground shadow-md flex items-center space-x-2">
                <Loader2 className="h-5 w-5 animate-spin text-accent" />
                {/* Optional typing indicator text */}
                {/* <span className="text-sm">Consulting the stars...</span> */}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

       {/* Prompt Suggestions */}
        {showSuggestions && messages.length > 0 && !isLoading && ( // Conditionally show suggestions
            <div className="mb-4 fade-in">
                <p className="text-sm text-muted-foreground mb-2 text-center">Need ideas? Try asking:</p>
                <div className="flex flex-wrap justify-center gap-2">
                {promptSuggestions.map((prompt, index) => (
                    <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handlePromptClick(prompt)}
                    className="bg-background hover:bg-accent/10 border-accent/50 text-accent hover:text-accent transition-colors duration-200 shadow-sm hover:shadow-md text-xs px-2 py-1 h-auto" // Smaller suggestions
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
          placeholder="Ask the cosmos..." // Changed placeholder
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow focus-visible:ring-accent"
          disabled={isLoading || initialLoading} // Also disable during initial check
          aria-label="Chat input"
        />
        <Button type="submit" size="icon" disabled={isLoading || initialLoading || !input.trim()} className="bg-accent text-accent-foreground hover:bg-accent/90 shrink-0"> {/* Added shrink-0 */}
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
