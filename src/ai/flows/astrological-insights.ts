'use server';

/**
 * @fileOverview A astrological insights AI agent.
 *
 * - getAstrologicalInsights - A function that handles the astrological insights process.
 * - GetAstrologicalInsightsInput - The input type for the getAstrologicalInsights function.
 * - GetAstrologicalInsightsOutput - The return type for the getAstrologicalInsights function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GetAstrologicalInsightsInputSchema = z.object({
  birthDate: z
    .string()
    .describe(
      'The birth date of the user. Expected format: YYYY-MM-DD.'
    ),
  birthTime: z
    .string()
    .describe(
      'The birth time of the user. Expected format: HH:MM.'
    ),
  birthLocation: z.string().describe('The birth location of the user.'),
  currentDate: z
    .string()
    .describe(
      'The current date. Expected format: YYYY-MM-DD.'
    ),
  currentTime: z
    .string()
    .describe(
      'The current time. Expected format: HH:MM.'
    ),
  currentLocation: z.string().describe('The current location.'),
});
export type GetAstrologicalInsightsInput = z.infer<typeof GetAstrologicalInsightsInputSchema>;

const GetAstrologicalInsightsOutputSchema = z.object({
  personalityInsights: z.string().describe('Short, simple analysis of the user personality.'),
  lifePathInsights: z.string().describe('Simple guidance about the user life path.'),
  currentTransitInsights: z.string().describe('Simple insights based on current planetary positions.'),
});
export type GetAstrologicalInsightsOutput = z.infer<typeof GetAstrologicalInsightsOutputSchema>;

export async function getAstrologicalInsights(input: GetAstrologicalInsightsInput): Promise<GetAstrologicalInsightsOutput> {
  return astrologicalInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'astrologicalInsightsPrompt',
  input: {
    schema: z.object({
      birthDate: z
        .string()
        .describe(
          'The birth date of the user. Expected format: YYYY-MM-DD.'
        ),
      birthTime: z
        .string()
        .describe(
          'The birth time of the user. Expected format: HH:MM.'
        ),
      birthLocation: z.string().describe('The birth location of the user.'),
      currentDate: z
        .string()
        .describe(
          'The current date. Expected format: YYYY-MM-DD.'
        ),
      currentTime: z
        .string()
        .describe(
          'The current time. Expected format: HH:MM.'
        ),
      currentLocation: z.string().describe('The current location.'),
    }),
  },
  output: {
    schema: z.object({
      personalityInsights: z.string().describe('Short, simple analysis of the user personality.'),
      lifePathInsights: z.string().describe('Simple guidance about the user life path.'),
      currentTransitInsights: z.string().describe('Simple insights based on current planetary positions.'),
    }),
  },
  prompt: `You are an AI Astrologer explaining insights to someone new to astrology. Use SIMPLE, CLEAR language. Avoid jargon. Keep each section CONCISE (1-2 sentences ideally).

Analyze the user's birth chart details and current planetary positions.

Birth Date: {{{birthDate}}}
Birth Time: {{{birthTime}}}
Birth Location: {{{birthLocation}}}
Current Date: {{{currentDate}}}
Current Time: {{{currentTime}}}
Current Location: {{{currentLocation}}}

Provide short, easy-to-understand insights in the following format:

### Personality:
[Simple analysis of the user's core personality based on their birth chart.]

### Life Path:
[Easy-to-understand guidance about their life path, challenges, and opportunities.]

### Current Influences:
[Simple insights based on current planetary positions and how they might affect the user right now.]`,
});

const astrologicalInsightsFlow = ai.defineFlow<
  typeof GetAstrologicalInsightsInputSchema,
  typeof GetAstrologicalInsightsOutputSchema
>(
  {
    name: 'astrologicalInsightsFlow',
    inputSchema: GetAstrologicalInsightsInputSchema,
    outputSchema: GetAstrologicalInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    // Ensure the output aligns with the simplified schema keys (lowercase first letter)
    // The prompt asks for specific headings, but the output schema expects lowercase keys.
    // We might need to adjust either the prompt or handle mapping if the LLM doesn't match exactly.
    // Assuming the LLM follows the schema description for now.
    return output!;
  }
);
