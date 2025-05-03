
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from 'next/image';
import { Rocket, Lock, BrainCircuit, Sparkles } from 'lucide-react'; // Import necessary icons
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/layout/Header"; // Import Header

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

        {/* SEO Section */}
        <section className="container mx-auto mt-16 md:mt-24 text-left space-y-8 fade-in relative z-10" style={{ animationDelay: '0.5s' }}>
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
          <div className="text-center text-muted-foreground mt-12">
              <p>Explore the stars, understand yourself, and navigate your future. Start your astrological journey today with WebAstro AI.</p> {/* Removed keyword stuffing */}
          </div>
        </section>
      </main> {/* End of main content */}

      {/* Footer */}
     <footer className="w-full mt-16 md:mt-24 py-6 border-t border-border/50 fade-in relative z-10" style={{ animationDelay: '0.6s' }}> {/* Ensure footer is above stars */}
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} WebAstro AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
