import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from 'next/image';
import { MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center flex-grow p-4 md:p-8 bg-gradient-to-b from-background to-secondary/50">
      <div className="container mx-auto flex flex-col lg:flex-row items-center gap-8 text-center lg:text-left fade-in">
        {/* Left Content: Text & Button */}
        <div className="flex-1 flex flex-col items-center lg:items-start space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-primary slide-up" style={{ animationDelay: '0.1s' }}>
            Unlock Your Cosmic Potential with <span className="text-accent">WebAstro AI</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-xl slide-up" style={{ animationDelay: '0.2s' }}>
            Discover personalized astrological insights powered by cutting-edge AI. Explore your birth chart, understand planetary influences, and navigate your life path with clarity.
          </p>
          <Link href="/chat" passHref className="slide-up" style={{ animationDelay: '0.3s' }}>
            <Button size="lg" className="mt-4 shadow-lg transform transition hover:scale-105 hover:shadow-xl duration-300 ease-in-out">
              <MessageCircle className="mr-2 h-5 w-5" /> Chat Now
            </Button>
          </Link>
        </div>

        {/* Right Content: Hero Image */}
        <div className="flex-1 flex justify-center lg:justify-end mt-8 lg:mt-0 slide-up" style={{ animationDelay: '0.4s' }}>
          <Image
            src="https://picsum.photos/600/400"
            alt="Astrology illustration with stars and planets"
            data-ai-hint="astrology stars planets cosmos"
            width={600}
            height={400}
            className="rounded-lg shadow-2xl object-cover"
            priority
          />
        </div>
      </div>

      {/* SEO Section */}
      <section className="container mx-auto mt-16 md:mt-24 text-left space-y-8 fade-in" style={{ animationDelay: '0.5s' }}>
        <h2 className="text-3xl md:text-4xl font-semibold text-primary text-center">Why WebAstro AI?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-card shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-brain-circuit"><path d="M12 5a3 3 0 1 0-5.997.142"/><path d="M18 5a3 3 0 1 0-5.997.142"/><path d="M12 13a3 3 0 1 0 5.997-.142"/><path d="M6 13a3 3 0 1 0 5.997-.142"/><path d="M12 21a3 3 0 1 0 .142-5.997"/><path d="M6 5h.01"/><path d="M18 5h.01"/><path d="M12 13h.01"/><path d="M6 13h.01"/><path d="M18 13h.01"/><path d="M12 21v-6"/><path d="M12 5v6"/><path d="M6 5v6.01"/><path d="M18 5v6.01"/><path d="M6 13v2"/><path d="M18 13v2"/><path d="m14.6 10.5-.7-.7"/><path d="m10.1 10.5-.7-.7"/><path d="m14.6 18.5-.7-.7"/><path d="m10.1 18.5-.7-.7"/></svg>
                AI-Powered Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Leverage the power of Gemini 2.0 Flash for deep, personalized astrological readings and interpretations. Understand complex astrological concepts easily.</p>
            </CardContent>
          </Card>
           <Card className="bg-card shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
                Personalized Guidance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Go beyond generic horoscopes. Get insights tailored to your unique birth chart, helping you understand your strengths, challenges, and life purpose.</p>
            </CardContent>
          </Card>
           <Card className="bg-card shadow-md hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lock"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                Secure & Private
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Your conversations are private. We prioritize your data security and ensure your interactions remain confidential through authorized API access.</p>
            </CardContent>
          </Card>
        </div>
        <div className="text-center text-muted-foreground mt-12">
            <p>Explore the stars, understand yourself, and navigate your future. Start your astrological journey today with WebAstro AI, the premier AI astrology chat application.</p>
            <p>Keywords: AI Astrology, Personalized Horoscope, Birth Chart Analysis, Gemini API Astrology, Astrological Insights Chat, Online Astrology Reading, Celestial Guidance AI.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full mt-16 md:mt-24 py-6 border-t border-border/50 fade-in" style={{ animationDelay: '0.6s' }}>
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} WebAstro AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
