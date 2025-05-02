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
  personalityInsights: z.string().describe('In-depth analysis of the user personality.'),
  lifePathInsights: z.string().describe('Guidance and understanding of the user life path.'),
  currentTransitInsights: z.string().describe('Insights based on the current planetary positions.'),
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
      personalityInsights: z.string().describe('In-depth analysis of the user personality.'),
      lifePathInsights: z.string().describe('Guidance and understanding of the user life path.'),
      currentTransitInsights: z.string().describe('Insights based on the current planetary positions.'),
    }),
  },
  prompt: `You are an expert astrologer providing personalized astrological insights. Analyze the user's birth chart details and current planetary positions to offer a comprehensive understanding of their personality, life path, and current influences.\n\nBirth Date: {{{birthDate}}}\nBirth Time: {{{birthTime}}}\nBirth Location: {{{birthLocation}}}\nCurrent Date: {{{currentDate}}}\nCurrent Time: {{{currentTime}}}\nCurrent Location: {{{currentLocation}}}\n\nProvide the astrological insights in the following format:\n\n### Personality Insights:\n[In-depth analysis of the user personality based on their birth chart.]\n\n### Life Path Insights:\n[Guidance and understanding of the user life path, including potential challenges and opportunities.]\n\n### Current Transit Insights:\n[Insights based on the current planetary positions and their influence on the user.]`,
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
    return output!;
  }
);
