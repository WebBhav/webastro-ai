import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react"; // Using Sparkles as a celestial icon

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-accent" />
          <span className="font-bold sm:inline-block text-primary">
            WebAstro AI
          </span>
        </Link>
        {/* Add Navigation Links here if needed later */}
        {/* <nav className="flex items-center gap-6 text-sm">
          <Link href="/features" className="transition-colors hover:text-foreground/80 text-foreground/60">
            Features
          </Link>
        </nav> */}
        <div className="flex flex-1 items-center justify-end space-x-4">
           <Link href="/chat" passHref>
             <Button variant="ghost">Chat</Button>
           </Link>
           {/* Add other header actions like login/signup if needed */}
        </div>
      </div>
    </header>
  );
}
