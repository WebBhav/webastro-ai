
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
// Removed Alert import as it's no longer used
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

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
  // Removed isSubmitted state as it's no longer needed for the new flow
  // const [isSubmitted, setIsSubmitted] = React.useState(false);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  // Function to generate mailto link using current form values
  const generateMailtoLink = (data: ContactFormValues) => {
    const subject = encodeURIComponent(`Contact Form Submission from ${data.name}`);
    const body = encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`);
    return `mailto:vaibhavsinghal2808@gmail.com?subject=${subject}&body=${body}`;
  };


  // Function to handle form submission - Updated to directly open mail client
  const handleFormSubmit = (data: ContactFormValues) => {
    setIsLoading(true);
    console.log('Contact Form Submitted (Logged Locally):', data);

    const mailtoLink = generateMailtoLink(data);

    // Attempt to open the mail client
    window.location.href = mailtoLink;

    // Give feedback to the user
    toast({
        title: "Opening Email Client",
        description: "Please check your email application to send the message.",
    });

    // Reset the form fields
    form.reset();

    // Set loading state back to false after a short delay to allow mail client opening
    setTimeout(() => {
      setIsLoading(false);
    }, 500); // Small delay
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
                  disabled={isLoading} // Only disable while loading
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
                  disabled={isLoading} // Only disable while loading
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
                  disabled={isLoading} // Only disable while loading
                />
              </FormControl>
               <FormDescription className="text-muted-foreground/80"> {/* Adjusted description color */}
                Max 500 characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button - Updated label and removed isSubmitted logic */}
        <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Opening Email...
            </>
          ) : (
             <>
               <Send className="mr-2 h-4 w-4" /> Send via Email
             </>
          )}
        </Button>

        {/* Removed the Alert component block */}

      </form>
    </Form>
  );
}
