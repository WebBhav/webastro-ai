
'use client'; // Needed for useState, usePathname and interaction

import Link from "next/link";
import { useState } from 'react';
import { usePathname } from 'next/navigation'; // Import usePathname
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetTitle } from "@/components/ui/sheet"; // Use Sheet for mobile menu, import SheetTitle
import { Sparkles, Menu, MessageSquare } from "lucide-react"; // Remove unused icons (X), Add MessageSquare
import { cn } from "@/lib/utils"; // Import cn for conditional classes

// Updated Navigation Links - Removed icons
const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact Us" },
  // Chat link is handled separately as a button now
];

// Separate Chat link details
// Updated href to point to /get-started as per user request
const CHAT_LINK = { href: "/get-started", label: "Chat" };

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname(); // Get the current pathname

  return (
    // Adjusted header style for dark theme
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      {/* Added pl-4 for left padding and pr-4 for right padding */}
      <div className="container pl-4 pr-4 flex h-14 max-w-screen-2xl items-center justify-between"> {/* Changed to justify-between */}
        {/* Logo and Brand */}
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Sparkles className="h-6 w-6 text-accent" />
          <span className="font-bold text-primary sm:inline-block"> {/* Text color uses primary (light white in dark) */}
            WebAstro AI
          </span>
        </Link>

        {/* Desktop Navigation & Chat Button */}
        <div className="flex flex-1 items-center justify-end"> {/* Wrap nav and button */}
            <nav className="hidden items-center gap-6 text-sm md:flex mr-6"> {/* Added margin-right */}
            {NAV_LINKS.map((link) => {
                 const isActive = pathname === link.href;
                 return (
                    <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                        "transition-colors hover:text-primary/80", // Hover uses lighter primary
                        isActive ? "text-primary font-semibold" : "text-primary/60" // Active uses primary, inactive uses faded primary
                    )}
                    onClick={() => setIsMobileMenuOpen(false)} // Close mobile menu if open
                    >
                    {link.label}
                    </Link>
                );
            })}
            </nav>

            {/* Desktop Chat Button */}
            <div className="hidden md:flex">
                {/* Check if the chat-related routes are active */}
                 <Link href={CHAT_LINK.href} passHref>
                   <Button
                     variant={pathname.startsWith('/get-started') || pathname.startsWith('/chat') ? "default" : "default"} // Keep default variant, could add active style if needed
                     size="sm"
                     className="bg-accent text-accent-foreground hover:bg-accent/90" // Accent button style should work well on dark
                    >
                     <MessageSquare className="mr-2 h-4 w-4" /> {/* Added Icon */}
                     {CHAT_LINK.label}
                   </Button>
                 </Link>
            </div>


            {/* Mobile Navigation Trigger (Hamburger Menu) */}
            <div className="flex items-center md:hidden">
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                    <SheetTrigger asChild>
                     {/* Adjusted button color for dark theme */}
                    <Button variant="ghost" size="icon" className="text-primary hover:bg-accent/10">
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Open menu</span>
                    </Button>
                    </SheetTrigger>
                     {/* Adjusted sheet content background */}
                    <SheetContent side="left" className="w-full max-w-xs bg-background border-border/50 p-6">
                      {/* Added SheetTitle for accessibility, hidden visually */}
                       <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                      {/* Mobile Menu Header */}
                      <div className="mb-6 flex items-center justify-between">
                          <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                              <Sparkles className="h-6 w-6 text-accent" />
                              {/* Adjusted text color */}
                              <span className="font-bold text-primary">WebAstro AI</span>
                          </Link>
                          {/* The default close button is handled by SheetContent, rendered top right */}
                           <SheetClose asChild>
                             <Button variant="ghost" size="icon" className="text-primary hover:bg-accent/10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                               <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x h-4 w-4"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                               <span className="sr-only">Close</span>
                             </Button>
                           </SheetClose>
                      </div>
                      {/* Mobile Menu Links */}
                      <nav className="flex flex-col gap-4">
                          {NAV_LINKS.map((link) => { // Separate regular links from chat button
                               const isActive = pathname === link.href;
                               return (
                                  <SheetClose key={link.href} asChild>
                                      <Link
                                          href={link.href}
                                          className={cn(
                                              `flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium hover:bg-accent/10 hover:text-primary`, // Use subtle hover for regular links
                                              isActive ? "text-primary font-semibold bg-accent/10" : "text-primary/60" // Apply active/inactive style
                                          )}
                                      >
                                      {link.label}
                                      </Link>
                                  </SheetClose>
                              );
                          })}
                           {/* Mobile Chat Button */}
                          <SheetClose asChild>
                             <Link href={CHAT_LINK.href} passHref>
                               <Button
                                 variant={"default"} // Use default variant (usually solid background)
                                 className="w-full justify-start bg-accent text-accent-foreground hover:bg-accent/90" // Style as button
                                >
                                 <MessageSquare className="mr-2 h-4 w-4" />
                                 {CHAT_LINK.label}
                               </Button>
                             </Link>
                          </SheetClose>
                      </nav>
                    </SheetContent>
                </Sheet>
            </div>
         </div>
      </div>
    </header>
  );
}
