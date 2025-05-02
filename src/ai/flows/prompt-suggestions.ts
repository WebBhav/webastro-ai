'use server';

/**
 * @fileOverview A flow for generating prompt suggestions for astrological queries.
 *
 * - getPromptSuggestions - A function that returns a list of suggested prompts.
 * - PromptSuggestionsInput - The input type for the getPromptSuggestions function.
 * - PromptSuggestionsOutput - The return type for the getPromptSuggestions function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const PromptSuggestionsInputSchema = z.object({
  topic: z
    .string()
    .optional()
    .describe('The astrological topic to generate suggestions for.'),
});
export type PromptSuggestionsInput = z.infer<typeof PromptSuggestionsInputSchema>;

const PromptSuggestionsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('An array of suggested prompts.'),
});
export type PromptSuggestionsOutput = z.infer<typeof PromptSuggestionsOutputSchema>;

export async function getPromptSuggestions(input: PromptSuggestionsInput): Promise<PromptSuggestionsOutput> {
  return promptSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'promptSuggestionsPrompt',
  input: {
    schema: z.object({
      topic: z
        .string()
        .optional()
        .describe('The astrological topic to generate suggestions for.'),
    }),
  },
  output: {
    schema: z.object({
      suggestions: z.array(z.string()).describe('An array of suggested prompts.'),
    }),
  },
  prompt: `You are an astrological prompt suggestion generator.

  Generate a list of prompts that a user could use to start a conversation about astrology.

  Topic: {{topic}}

  Suggestions:
  `,
});

const promptSuggestionsFlow = ai.defineFlow<
  typeof PromptSuggestionsInputSchema,
  typeof PromptSuggestionsOutputSchema
>(
  {
    name: 'promptSuggestionsFlow',
    inputSchema: PromptSuggestionsInputSchema,
    outputSchema: PromptSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
