
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { CalendarIcon, Languages, Loader2 } from 'lucide-react'; // Added Languages icon

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"; // Import Select components
import { useToast } from '@/hooks/use-toast';

// Define the localStorage key
const BIRTH_DETAILS_STORAGE_KEY = 'webastro_birth_details';

// Updated Supported Languages
const LANGUAGES = [
  { value: 'English', label: 'English' },
  { value: 'Hindi', label: 'Hindi' },
  { value: 'Kannada', label: 'Kannada' },
  { value: 'Telugu', label: 'Telugu' },
  { value: 'Marathi', label: 'Marathi' },
  { value: 'Gujarati', label: 'Gujarati' },
  { value: 'Bengali', label: 'Bengali' },
];

// Validation schema including language
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
  language: z.string({
    required_error: 'Please select a language.',
  }).min(1, 'Please select a language.'), // Ensure a language is selected
});

export type BirthDetailsFormValues = z.infer<typeof formSchema>;

export function BirthDetailsForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedLanguageLabel, setSelectedLanguageLabel] = React.useState("Select Language"); // State for display label

  const form = useForm<BirthDetailsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      birthDate: undefined, // Explicitly set to undefined initially
      birthTime: '',
      birthLocation: '',
      language: '', // Default language value
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
        language: data.language, // Save selected language
      };

      // Store in localStorage *synchronously*
      localStorage.setItem(BIRTH_DETAILS_STORAGE_KEY, JSON.stringify(birthDetails));

      toast({
        title: "Details Saved!",
        description: "We've securely stored your birth details and language preference.", // Updated toast message
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

  // Update language label when value changes
  const handleLanguageChange = (value: string) => {
    const selectedLang = LANGUAGES.find(lang => lang.value === value);
    setSelectedLanguageLabel(selectedLang ? selectedLang.label : "Select Language");
    form.setValue('language', value); // Update form state
  };


  return (
    <Form {...form}>
      {/* Use the handleFormSubmit function in the onSubmit handler */}
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">
        {/* Birth Date */}
        <FormField
          control={form.control}
          name="birthDate"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel className="text-muted-foreground">Birth Date</FormLabel> {/* Adjusted label color */}
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    {/* Adjusted button style */}
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-full pl-3 text-left font-normal bg-secondary/50 border-border/60 text-foreground hover:bg-accent/10',
                        !field.value && 'text-muted-foreground'
                      )}
                      disabled={isLoading} // Disable during loading
                    >
                      {field.value ? (
                        format(field.value, 'PPP')
                      ) : (
                        <span>Pick a date</span>
                      )}
                      {/* Change icon color to foreground */}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-80 text-foreground" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                 {/* Calendar popover content will inherit dark theme */}
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
              <FormDescription className="text-muted-foreground/80">Your date of birth.</FormDescription> {/* Adjusted description color */}
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Birth Time */}
        <FormField
          control={form.control}
          name="birthTime"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">Birth Time (HH:MM)</FormLabel> {/* Adjusted label color */}
              <FormControl>
                {/* Adjusted input style */}
                <Input
                  placeholder="e.g., 14:30"
                  {...field}
                  type="time" // Use time input type for better UX on supported browsers
                  className="bg-secondary/50 border-border/60 text-foreground placeholder:text-muted-foreground [&::-webkit-calendar-picker-indicator]:bg-transparent [&::-webkit-datetime-edit-hour-field:focus]:bg-accent/20 [&::-webkit-datetime-edit-minute-field:focus]:bg-accent/20 [&::-webkit-datetime-edit-ampm-field:focus]:bg-accent/20" // Basic styling attempt for time input parts
                  disabled={isLoading} // Disable during loading
                />
              </FormControl>
              <FormDescription className="text-muted-foreground/80"> {/* Adjusted description color */}
                Enter the time in 24-hour format (e.g., 2:30 PM is 14:30).
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Birth Location */}
        <FormField
          control={form.control}
          name="birthLocation"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">Birth Location</FormLabel> {/* Adjusted label color */}
              <FormControl>
                {/* Adjusted input style */}
                <Input
                  placeholder="e.g., London, UK"
                  {...field}
                  disabled={isLoading} // Disable during loading
                  className="bg-secondary/50 border-border/60 text-foreground placeholder:text-muted-foreground"
                />
              </FormControl>
              <FormDescription className="text-muted-foreground/80"> {/* Adjusted description color */}
                The city and country/state where you were born.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Language Selection */}
         <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">Language</FormLabel> {/* Adjusted label color */}
               <Select
                  onValueChange={(value) => {
                    field.onChange(value); // Update react-hook-form state
                    handleLanguageChange(value); // Update display label
                  }}
                  defaultValue={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    {/* Adjusted trigger style */}
                    <SelectTrigger className="bg-secondary/50 border-border/60 text-foreground hover:bg-accent/10">
                       <Languages className="mr-2 h-4 w-4 text-muted-foreground" /> {/* Icon */}
                       <SelectValue placeholder="Select Language" >{selectedLanguageLabel}</SelectValue> {/* Use state for display */}
                    </SelectTrigger>
                  </FormControl>
                  {/* Select content will inherit dark theme */}
                  <SelectContent>
                    {LANGUAGES.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              <FormDescription className="text-muted-foreground/80"> {/* Adjusted description color */}
                Select the language for your astrological insights.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Adjusted button style */}
        <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90" disabled={isLoading}>
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
