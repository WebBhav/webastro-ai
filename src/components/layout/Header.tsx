'use client'; // Needed for useState and interaction

import Link from "next/link";
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"; // Use Sheet for mobile menu
import { Sparkles, Menu, X, Home, Info, Mail, MessageCircle } from "lucide-react"; // Add relevant icons

// Updated Navigation Links
const NAV_LINKS = [
  { href: "/", label: "Home", icon: Home },
  { href: "/about", label: "About", icon: Info },
  { href: "/contact", label: "Contact Us", icon: Mail },
  { href: "/get-started", label: "Chat", icon: MessageCircle }, // Link Chat to the get-started page
];

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        {/* Logo and Brand */}
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-accent" />
          <span className="font-bold text-primary sm:inline-block">
            WebAstro AI
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden flex-1 items-center gap-6 text-sm md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground/80 text-foreground/60 flex items-center gap-1" // Added flex and gap
              onClick={() => setIsMobileMenuOpen(false)} // Close mobile menu if open
            >
               <link.icon className="h-4 w-4" /> {/* Display icon */}
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Navigation Trigger (Hamburger Menu) */}
        <div className="flex flex-1 items-center justify-end md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs bg-background p-6">
              {/* Mobile Menu Header */}
              <div className="mb-6 flex items-center justify-between">
                 <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                    <Sparkles className="h-6 w-6 text-accent" />
                    <span className="font-bold text-primary">WebAstro AI</span>
                 </Link>
                 <SheetClose asChild>
                     <Button variant="ghost" size="icon">
                       <X className="h-6 w-6" />
                       <span className="sr-only">Close menu</span>
                    </Button>
                 </SheetClose>
              </div>
              {/* Mobile Menu Links */}
              <nav className="flex flex-col gap-4">
                {NAV_LINKS.map((link) => (
                  <SheetClose key={link.href} asChild>
                    <Link
                      href={link.href}
                      className="flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-accent hover:text-accent-foreground" // Added flex and gap
                    >
                      <link.icon className="h-5 w-5" /> {/* Display icon */}
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
