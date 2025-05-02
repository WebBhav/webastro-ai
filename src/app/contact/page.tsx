
import { Header } from "@/components/layout/Header";
import { ContactForm } from "@/components/contact/ContactForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail } from "lucide-react";

export default function ContactPage() {
  return (
    // Adjusted gradient for dark theme
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-secondary/50 text-foreground">
      <Header />
      <main className="flex flex-grow items-center justify-center p-4 md:p-8">
        {/* Adjusted card styles for dark theme */}
        <Card className="w-full max-w-lg shadow-xl bg-card border border-border/50 fade-in slide-up">
          <CardHeader className="text-center">
             <div className="flex justify-center mb-4">
               <Mail className="h-12 w-12 text-accent" />
            </div>
            <CardTitle className="text-3xl font-bold text-primary">Contact Us</CardTitle>
            <CardDescription className="text-md text-muted-foreground">
              Have questions or feedback? We'd love to hear from you!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContactForm />
          </CardContent>
        </Card>
      </main>
       <footer className="w-full py-4 mt-auto border-t border-border/50 text-center text-muted-foreground text-sm">
         <p>&copy; {new Date().getFullYear()} WebAstro AI. Reach out anytime.</p>
      </footer>
    </div>
  );
}
