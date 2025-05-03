
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, BrainCircuit, Users } from "lucide-react"; // Import relevant icons

export default function AboutPage() {
  return (
    // Adjusted gradient for dark theme
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-secondary/50 text-foreground">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-16">
        <div className="max-w-3xl mx-auto space-y-12">
          {/* Adjusted card styles for dark theme */}
          <Card className="shadow-lg bg-card border border-border/50 fade-in">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Sparkles className="h-16 w-16 text-accent animate-pulse" />
              </div>
              <CardTitle className="text-3xl md:text-4xl font-bold text-primary">About WebAstro AI</CardTitle>
              <CardDescription className="text-lg text-muted-foreground mt-2">
                Your Personal Cosmic Navigator
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-base text-foreground text-left md:text-lg leading-relaxed">
              <p>
                Welcome to WebAstro AI, where ancient wisdom meets modern technology. We believe that the cosmos holds profound insights into our personalities, life paths, and the energies that shape our daily lives. Our mission is to make these insights accessible, understandable, and deeply personal for everyone, regardless of their astrological knowledge.
              </p>
              <p>
                Navigating the complexities of astrology can often feel daunting. Traditional readings can be dense, filled with jargon, and sometimes hard to relate to everyday life. WebAstro AI was created to bridge this gap.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md bg-card border border-border/50 fade-in" style={{animationDelay: '0.2s'}}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl md:text-2xl text-primary">
                <BrainCircuit className="h-6 w-6 text-accent" />
                Our Technology
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-base text-muted-foreground leading-relaxed">
              <p>
                We leverage the power of advanced AI, trained on a vast corpus of astrological knowledge. By inputting your precise birth details (date, time, and location), our AI generates personalized interpretations of your unique natal chart.
              </p>
              <p>
                Unlike generic horoscopes, WebAstro AI provides nuanced insights tailored specifically to you. Our chat interface allows you to ask specific questions and receive clear, concise, and easy-to-understand answers about your personality, potential, relationships, career, and the current planetary influences affecting you.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md bg-card border border-border/50 fade-in" style={{animationDelay: '0.4s'}}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl md:text-2xl text-primary">
                <Users className="h-6 w-6 text-accent" />
                Our Vision
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-base text-muted-foreground leading-relaxed">
              <p>
                We envision a world where self-understanding is enhanced by the wisdom of the stars, made readily available through intuitive technology. WebAstro AI aims to be your trusted companion on your journey of self-discovery, providing guidance, clarity, and a touch of cosmic wonder.
              </p>
              <p>
                Your privacy is paramount. Your birth details are stored locally on your device, ensuring your personal information remains secure.
              </p>
              <p>
                Embark on your astrological adventure today with WebAstro AI!
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
      <footer className="w-full py-4 mt-auto border-t border-border/50 text-center text-muted-foreground text-sm">
        <p>&copy; {new Date().getFullYear()} WebAstro AI. Explore the cosmos within.</p>
      </footer>
    </div>
  );
}
