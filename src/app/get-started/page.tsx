import { Header } from "@/components/layout/Header";
import { BirthDetailsForm } from "@/components/onboarding/BirthDetailsForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function GetStartedPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-secondary/50">
      <Header />
      <main className="flex flex-grow items-center justify-center p-4 md:p-8">
        <Card className="w-full max-w-lg shadow-xl bg-card fade-in slide-up">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
               <Sparkles className="h-12 w-12 text-accent" />
            </div>
            <CardTitle className="text-3xl font-bold text-primary">Welcome to WebAstro AI</CardTitle>
            <CardDescription className="text-md text-muted-foreground">
              Please enter your birth details below to receive personalized astrological insights.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <BirthDetailsForm />
          </CardContent>
        </Card>
      </main>
       <footer className="w-full py-4 mt-auto border-t border-border/50 text-center text-muted-foreground text-sm">
         <p>&copy; {new Date().getFullYear()} WebAstro AI. Your privacy is important to us.</p>
      </footer>
    </div>
  );
}
