'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { CalendarIcon, Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useToast } from '@/hooks/use-toast';

// Define the localStorage key
const BIRTH_DETAILS_STORAGE_KEY = 'webastro_birth_details';

// Validation schema
const formSchema = z.object({
  birthDate: z.date({
    required_error: 'A birth date is required.',
  }),
  birthTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Please enter a valid time in HH:MM (24-hour) format.',
  }),
  birthLocation: z.string().min(3, {
    message: 'Birth location must be at least 3 characters.',
  }),
});

export type BirthDetailsFormValues = z.infer<typeof formSchema>;

export function BirthDetailsForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm<BirthDetailsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      birthDate: undefined, // Explicitly set to undefined initially
      birthTime: '',
      birthLocation: '',
    },
  });

  // Separate function to handle actual submission logic
  const handleFormSubmit = (data: BirthDetailsFormValues) => {
     setIsLoading(true);
    try {
      const birthDetails = {
        date: format(data.birthDate, 'yyyy-MM-dd'),
        time: data.birthTime,
        location: data.birthLocation,
      };

      // Store in localStorage *synchronously*
      localStorage.setItem(BIRTH_DETAILS_STORAGE_KEY, JSON.stringify(birthDetails));

      toast({
        title: "Details Saved!",
        description: "We've securely stored your birth details.",
      });

       // Use requestAnimationFrame to ensure localStorage write completes before navigation
       requestAnimationFrame(() => {
           router.push('/chat');
           // No need to setIsLoading(false) here as navigation happens
       });


    } catch (error) {
      console.error('Error saving birth details:', error);
      toast({
        title: 'Error',
        description: 'Could not save your birth details. Please try again.',
        variant: 'destructive',
      });
      setIsLoading(false); // Ensure loading state is reset on error
    }
  };

  return (
    <Form {...form}>
      {/* Use the handleFormSubmit function in the onSubmit handler */}
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Birth Date</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full pl-3 text-left font-normal',
                        !field.value && 'text-muted-foreground'
                      )}
                      disabled={isLoading} // Disable during loading
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date('1900-01-01')
                    }
                    initialFocus
                    captionLayout="dropdown-buttons"
                    fromYear={1900}
                    toYear={new Date().getFullYear()}
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>Your date of birth.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birthTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birth Time (HH:MM)</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., 14:30"
                  {...field}
                  type="time" // Use time input type for better UX on supported browsers
                  className="[&::-webkit-calendar-picker-indicator]:bg-transparent [&::-webkit-datetime-edit-hour-field:focus]:bg-accent/20 [&::-webkit-datetime-edit-minute-field:focus]:bg-accent/20 [&::-webkit-datetime-edit-ampm-field:focus]:bg-accent/20" // Basic styling attempt for time input parts
                  disabled={isLoading} // Disable during loading
                />
              </FormControl>
              <FormDescription>
                Enter the time in 24-hour format (e.g., 2:30 PM is 14:30).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="birthLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Birth Location</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., London, UK"
                  {...field}
                  disabled={isLoading} // Disable during loading
                />
              </FormControl>
              <FormDescription>
                The city and country/state where you were born.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Continue to Chat'
          )}
        </Button>
      </form>
    </Form>
  );
}
