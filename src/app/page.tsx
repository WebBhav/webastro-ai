
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from 'next/image';
// Import necessary icons including those for new sections
import { Rocket, Lock, BrainCircuit, Sparkles, HelpCircle, ListOrdered, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/Header"; // Import Header
// Import Accordion components for FAQs
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground"> {/* Ensure parent div takes full height and sets base text color */}
      <Header /> {/* Add the Header component */}
      {/* Removed gradient background from main, added overflow-hidden */}
      <main className="flex flex-col items-center justify-center flex-grow p-4 md:p-8 relative overflow-hidden">

        {/* Star Background Layers - Placed directly inside main */}
        <div className="stars"></div>
        <div className="twinkling"></div>

        {/* Ensure content has z-index higher than stars */}
        <div className="container mx-auto flex flex-col lg:flex-row items-center gap-8 text-center lg:text-left fade-in relative z-10">
         {/* Left Content: Text & Button */}
         <div className="flex-1 flex flex-col items-center lg:items-start space-y-6">
          <div className="relative"> {/* Wrapper for title */}
               <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-primary slide-up relative z-10" style={{ animationDelay: '0.1s' }}>
               Unlock Your Cosmic Potential with <span className="text-accent">WebAstro AI</span>
               </h1>
           </div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl slide-up" style={{ animationDelay: '0.2s' }}>
              Discover personalized astrological insights powered by cutting-edge AI. Explore your birth chart, understand planetary influences, and navigate your life path with clarity.
            </p>
            <Link href="/get-started" passHref className="slide-up" style={{ animationDelay: '0.3s' }}>
             <Button size="lg" className="mt-4 shadow-lg transform transition hover:scale-105 hover:shadow-xl duration-300 ease-in-out bg-primary text-primary-foreground hover:bg-primary/90">
                <Rocket className="mr-2 h-5 w-5" /> Try it now
              </Button>
            </Link>
          </div>

          {/* Right Content: Hero Image */}
          <div className="flex-1 flex justify-center lg:justify-end mt-8 lg:mt-0 slide-up relative z-10" style={{ animationDelay: '0.4s' }}>
            <Image
              src="https://picsum.photos/600/400"
              alt="Astrology illustration with stars and planets"
              data-ai-hint="astrology stars planets cosmos"
              width={600}
              height={400}
              className="rounded-lg shadow-2xl object-cover border-2 border-accent/50" // Added subtle border
              priority
            />
          </div>
        </div>

         {/* Introductory Paragraph */}
         <p className="container mx-auto mt-16 md:mt-24 text-center text-lg text-muted-foreground max-w-3xl relative z-10 fade-in" style={{ animationDelay: '0.45s' }}>
            Dive into the fascinating world of astrology with a modern twist. WebAstro AI combines ancient wisdom with intelligent technology to provide you with meaningful, personalized guidance.
         </p>


        {/* Why WebAstro AI Section */}
        <section className="container mx-auto mt-8 md:mt-12 text-left space-y-8 fade-in relative z-10" style={{ animationDelay: '0.5s' }}>
          <h2 className="text-3xl md:text-4xl font-semibold text-primary text-center">Why WebAstro AI?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Adjusted card styles for dark theme */}
            <Card className="bg-card text-card-foreground border border-border/50 shadow-md hover:shadow-lg hover:border-accent/60 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <BrainCircuit className="h-6 w-6 text-accent" /> {/* Use imported icon */}
                  AI-Powered Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Leverage the power of advanced AI for deep, personalized astrological readings and interpretations. Understand complex astrological concepts easily.</p>
              </CardContent>
            </Card>
             <Card className="bg-card text-card-foreground border border-border/50 shadow-md hover:shadow-lg hover:border-accent/60 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Sparkles className="h-6 w-6 text-accent" /> {/* Use imported icon */}
                  Personalized Guidance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Go beyond generic horoscopes. Get insights tailored to your unique birth chart, helping you understand your strengths, challenges, and life purpose.</p>
              </CardContent>
            </Card>
             <Card className="bg-card text-card-foreground border border-border/50 shadow-md hover:shadow-lg hover:border-accent/60 transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                   <Lock className="h-6 w-6 text-accent" /> {/* Use imported icon */}
                  Secure & Private
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Your birth details are stored locally in your browser. Your conversations are private. We prioritize your data security. We'll delete the data once the session is over.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Transitional Paragraph */}
         <p className="container mx-auto mt-16 md:mt-24 text-center text-lg text-muted-foreground max-w-3xl relative z-10 fade-in" style={{ animationDelay: '0.55s' }}>
            Ready to begin your cosmic exploration? Getting started is simple and secure.
         </p>


         {/* How to Get Started Section */}
        <section className="container mx-auto mt-8 md:mt-12 text-left space-y-8 fade-in relative z-10" style={{ animationDelay: '0.6s' }}>
          <h2 className="text-3xl md:text-4xl font-semibold text-primary text-center">How to Get Started</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 Card */}
            <Card className="bg-card text-card-foreground border border-border/50 shadow-md hover:shadow-lg hover:border-accent/60 transition-all duration-300 p-6 flex flex-col items-center text-center">
                <ListOrdered className="h-12 w-12 text-accent mb-4" />
                <h3 className="text-xl font-semibold text-primary mb-2">Step 1: Provide Details</h3>
                <p className="text-muted-foreground">Click "Try it now" or "Chat". You'll be asked for your birth date, exact time, location, and preferred language.</p>
            </Card>
             {/* Step 2 Card */}
            <Card className="bg-card text-card-foreground border border-border/50 shadow-md hover:shadow-lg hover:border-accent/60 transition-all duration-300 p-6 flex flex-col items-center text-center">
                 <Rocket className="h-12 w-12 text-accent mb-4" />
                 <h3 className="text-xl font-semibold text-primary mb-2">Step 2: Start Chatting</h3>
                 <p className="text-muted-foreground">Once details are saved locally on your device, you'll enter the chatroom. Ask anything about your chart!</p>
            </Card>
             {/* Step 3 Card */}
            <Card className="bg-card text-card-foreground border border-border/50 shadow-md hover:shadow-lg hover:border-accent/60 transition-all duration-300 p-6 flex flex-col items-center text-center">
                 <MessageSquare className="h-12 w-12 text-accent mb-4" />
                 <h3 className="text-xl font-semibold text-primary mb-2">Step 3: Explore Insights</h3>
                 <p className="text-muted-foreground">Receive simple, personalized insights. Ask follow-up questions to dive deeper into your cosmic blueprint.</p>
            </Card>
          </div>
        </section>

         {/* Transitional Paragraph */}
         <p className="container mx-auto mt-16 md:mt-24 text-center text-lg text-muted-foreground max-w-3xl relative z-10 fade-in" style={{ animationDelay: '0.65s' }}>
            Have more questions? We've answered some common ones below.
         </p>

        {/* FAQs Section */}
        <section className="container mx-auto mt-8 md:mt-12 text-left space-y-8 fade-in relative z-10 max-w-3xl" style={{ animationDelay: '0.7s' }}>
           <h2 className="text-3xl md:text-4xl font-semibold text-primary text-center">Frequently Asked Questions</h2>
           <Accordion type="single" collapsible className="w-full bg-card border border-border/50 rounded-lg p-4 shadow-md">
            <AccordionItem value="item-1">
                <AccordionTrigger className="text-lg hover:no-underline text-primary">
                  <HelpCircle className="inline-block h-5 w-5 mr-2 text-accent" /> Is my data secure?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pl-8">
                Yes, absolutely. Your birth details (date, time, location, language) are stored only in your browser's local storage. They are not sent to any server except for the AI processing during your active chat session. The data is automatically cleared when your session ends or if you manually clear your browser data.
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
                <AccordionTrigger className="text-lg hover:no-underline text-primary">
                 <HelpCircle className="inline-block h-5 w-5 mr-2 text-accent" /> What kind of questions can I ask?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pl-8">
                You can ask about various aspects of your life based on your birth chart. Examples include: "What are my core personality traits?", "Tell me about my potential career paths.", "What energies are influencing my relationships right now?", "Explain my life path in simple terms." Feel free to ask specific questions too!
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
                 <AccordionTrigger className="text-lg hover:no-underline text-primary">
                 <HelpCircle className="inline-block h-5 w-5 mr-2 text-accent" /> How accurate is this?
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pl-8">
                WebAstro AI uses established astrological principles combined with AI interpretation. It aims to provide insightful guidance based on your birth chart. Think of it as a tool for self-reflection and exploration. Astrological insights are subjective and best used for personal growth, not as definitive predictions.
                </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-4" className="border-b-0"> {/* Remove border from last item */}
                 <AccordionTrigger className="text-lg hover:no-underline text-primary">
                  <HelpCircle className="inline-block h-5 w-5 mr-2 text-accent" /> Do I need to know astrology?
                 </AccordionTrigger>
                 <AccordionContent className="text-muted-foreground pl-8">
                 Not at all! WebAstro AI is designed to be beginner-friendly. It avoids complex jargon and explains insights in simple, easy-to-understand language. Just bring your curiosity!
                 </AccordionContent>
             </AccordionItem>
           </Accordion>
        </section>

        {/* Final CTA/Message */}
        <section className="container mx-auto mt-16 md:mt-24 text-center relative z-10 fade-in" style={{ animationDelay: '0.8s' }}>
             <p className="text-lg text-muted-foreground max-w-2xl mx-auto"> {/* Made text slightly larger */}
             Explore the stars, understand yourself, and navigate your future. Start your astrological journey today with WebAstro AI.
             </p>
              <Link href="/get-started" passHref className="slide-up inline-block mt-6" style={{ animationDelay: '0.85s' }}> {/* Added another CTA button */}
               <Button size="lg" className="shadow-lg transform transition hover:scale-105 hover:shadow-xl duration-300 ease-in-out bg-primary text-primary-foreground hover:bg-primary/90">
                  <Rocket className="mr-2 h-5 w-5" /> Begin Your Journey
                </Button>
             </Link>
        </section>

      </main> {/* End of main content */}

      {/* Footer */}
     <footer className="w-full mt-16 md:mt-24 py-6 border-t border-border/50 fade-in relative z-10" style={{ animationDelay: '0.9s' }}> {/* Ensure footer is above stars */}
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} WebAstro AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
