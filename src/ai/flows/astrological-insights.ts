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
  userQuery: z.string().optional().describe('The specific question the user asked.'), // Added optional user query
});
export type GetAstrologicalInsightsInput = z.infer<typeof GetAstrologicalInsightsInputSchema>;

const GetAstrologicalInsightsOutputSchema = z.object({
  personalityInsights: z.string().describe('Short, simple analysis of the user personality (1-2 sentences).'),
  lifePathInsights: z.string().describe('Simple guidance about the user life path (1-2 sentences).'),
  currentTransitInsights: z.string().describe('Simple insights based on current planetary positions (1-2 sentences).'),
  directAnswer: z.string().optional().describe('A direct, concise answer to the specific user query, if provided (1-2 sentences).'), // Added optional direct answer
});
export type GetAstrologicalInsightsOutput = z.infer<typeof GetAstrologicalInsightsOutputSchema>;

export async function getAstrologicalInsights(input: GetAstrologicalInsightsInput): Promise<GetAstrologicalInsightsOutput> {
  return astrologicalInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'astrologicalInsightsPrompt',
  input: {
    schema: GetAstrologicalInsightsInputSchema, // Use the updated input schema
  },
  output: {
    schema: GetAstrologicalInsightsOutputSchema, // Use the updated output schema
  },
  prompt: `You are an AI Astrologer explaining insights to someone new to astrology. Use SIMPLE, CLEAR language. Avoid jargon. Keep each section CONCISE (1-2 sentences).

DO NOT ask for birth details; use the ones provided below.

User's Birth Details:
Birth Date: {{{birthDate}}}
Birth Time: {{{birthTime}}}
Birth Location: {{{birthLocation}}}

Current Context:
Current Date: {{{currentDate}}}
Current Time: {{{currentTime}}}
Current Location: {{{currentLocation}}}

User's Question (if any): {{{userQuery}}}

Based ONLY on the provided birth details and current context, generate the following insights:

1.  **Personality:** Briefly analyze the user's core personality.
2.  **Life Path:** Offer simple guidance on their life path, challenges, or opportunities.
3.  **Current Influences:** Give simple insights based on current planetary transits affecting them now.
{{#if userQuery}}
4.  **Direct Answer:** Directly answer the user's specific question: "{{{userQuery}}}" using astrological principles, keeping it simple and concise.
{{/if}}

Ensure the output matches the required JSON schema format (personalityInsights, lifePathInsights, currentTransitInsights, directAnswer?). Keep each insight to 1-2 simple sentences.`,
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
    // The prompt now explicitly asks for the desired format, so direct return should be fine.
    return output!;
  }
);
