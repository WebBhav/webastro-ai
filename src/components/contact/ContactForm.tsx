
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useRouter } from 'next/navigation'; // Though not used for navigation here, good practice to keep
import { Loader2, Send, Mail } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'; // Import Alert

// Validation schema
const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  message: z.string().min(10, {
    message: 'Message must be at least 10 characters.',
  }).max(500, {
     message: 'Message cannot exceed 500 characters.',
  }),
});

export type ContactFormValues = z.infer<typeof formSchema>;

export function ContactForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false); // Track submission status

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  // Function to handle form submission
  const handleFormSubmit = (data: ContactFormValues) => {
    setIsLoading(true);
    console.log('Contact Form Submitted:', data);

    // --- Placeholder for actual submission ---
    // In a real application, you would send this data to your backend API
    // which would then handle sending the email.
    // Example:
    // try {
    //   const response = await fetch('/api/contact', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(data),
    //   });
    //   if (!response.ok) throw new Error('Network response was not ok');
    //   // Handle success
    //   setIsSubmitted(true);
    //   toast({ title: "Message Sent!", description: "Thanks for reaching out. We'll get back to you soon." });
    //   form.reset(); // Reset form on success
    // } catch (error) {
    //   console.error('Error submitting contact form:', error);
    //   toast({ title: 'Error', description: 'Could not send your message. Please try again or email us directly.', variant: 'destructive' });
    // } finally {
    //   setIsLoading(false);
    // }
    // --- End Placeholder ---

    // Simulate submission delay and success for demo purposes
    setTimeout(() => {
        setIsSubmitted(true);
        toast({
            title: "Message Logged (Demo)",
            description: "Your message details have been logged to the console. See below for direct email.",
        });
        setIsLoading(false);
         form.reset(); // Reset form on successful simulation
    }, 1500); // Simulate network delay
  };

  // Generate mailto link
  const generateMailtoLink = (data: ContactFormValues) => {
    const subject = encodeURIComponent(`Contact Form Submission from ${data.name}`);
    const body = encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`);
    return `mailto:vaibhavsinghal2808@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">Your Name</FormLabel> {/* Adjusted label color */}
              <FormControl>
                {/* Adjusted input style for dark theme */}
                <Input
                  placeholder="e.g., Ada Lovelace"
                  {...field}
                  disabled={isLoading || isSubmitted}
                   className="bg-secondary/50 border-border/60 text-foreground placeholder:text-muted-foreground"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">Your Email</FormLabel> {/* Adjusted label color */}
              <FormControl>
                {/* Adjusted input style for dark theme */}
                <Input
                  placeholder="e.g., ada@example.com"
                  {...field}
                  type="email"
                  disabled={isLoading || isSubmitted}
                   className="bg-secondary/50 border-border/60 text-foreground placeholder:text-muted-foreground"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Message */}
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">Your Message</FormLabel> {/* Adjusted label color */}
              <FormControl>
                {/* Adjusted textarea style for dark theme */}
                <Textarea
                  placeholder="Tell us how we can help..."
                  className="resize-none bg-secondary/50 border-border/60 text-foreground placeholder:text-muted-foreground"
                  rows={5}
                  {...field}
                  disabled={isLoading || isSubmitted}
                />
              </FormControl>
               <FormDescription className="text-muted-foreground/80"> {/* Adjusted description color */}
                Max 500 characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Adjusted button style */}
        <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading || isSubmitted}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : isSubmitted ? (
            'Message Sent!'
          ) : (
             <>
               <Send className="mr-2 h-4 w-4" /> Send Message
             </>
          )}
        </Button>

        {/* Display after submission (for demo) */}
        {isSubmitted && (
            // Adjusted alert style for dark theme
            <Alert variant="default" className="mt-6 bg-secondary/50 border-accent/50 text-accent">
              <Mail className="h-4 w-4 text-accent" />
              <AlertTitle className="text-accent font-semibold">Thank You!</AlertTitle>
              <AlertDescription className="text-accent/90">
                Your message has been logged (see browser console). For a real email, please click the link below to open your email client:
                <br />
                 <a
                    href={generateMailtoLink(form.getValues())}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline font-medium mt-2 inline-block hover:text-accent/80" // Adjusted hover color
                >
                    Click here to email us directly
                </a>
                 <p className="mt-2 text-xs">Alternatively, email: vaibhavsinghal2808@gmail.com</p>
              </AlertDescription>
            </Alert>
        )}
      </form>
    </Form>
  );
}
