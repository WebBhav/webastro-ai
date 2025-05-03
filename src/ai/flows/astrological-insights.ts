
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
  userQuery: z.string().optional().describe('The specific question the user asked.'),
  language: z.string().optional().default('English').describe('The language for the response (e.g., "English", "Hindi", "Kannada"). Defaults to English.'),
});
export type GetAstrologicalInsightsInput = z.infer<typeof GetAstrologicalInsightsInputSchema>;

// Output schema remains the same, the component will decide what to display
const GetAstrologicalInsightsOutputSchema = z.object({
  personalityInsights: z.string().describe('Short, simple, easy-to-understand analysis of the user personality (1-2 sentences, beginner-friendly).'),
  lifePathInsights: z.string().describe('Simple, clear guidance about the user life path (1-2 sentences, beginner-friendly).'),
  currentTransitInsights: z.string().describe('Simple, easy-to-grasp insights based on current planetary positions (1-2 sentences, beginner-friendly).'),
  directAnswer: z.string().optional().describe('A direct, concise, simple answer to the specific user query, if provided (1-2 sentences, beginner-friendly).'),
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
  // Updated prompt instructions for simplicity, clarity, beginner-friendliness, language, and "you" perspective.
  prompt: `You are an AI Astrologer explaining insights to someone COMPLETELY NEW to astrology.
Your goal is to be extremely SIMPLE, CLEAR, and ENCOURAGING.
ABSOLUTELY NO complex astrological jargon (like aspects, houses, specific planet names unless essential and simply explained).
Keep each insight VERY SHORT and EASY TO UNDERSTAND (1-2 simple sentences).
Generate the response in the following language: {{{language}}}.

IMPORTANT: When answering the user's specific question ({{{userQuery}}}), remember that "you", "your", "I", "me" refer to the PERSON whose birth details are provided below, NOT to you, the AI assistant. Frame your answer from the perspective of analyzing THEIR chart.

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

Based ONLY on the provided birth details and current context, generate the following insights in a beginner-friendly way in {{{language}}}:

1.  **Personality:** Briefly describe a key part of the user's personality in simple terms. (e.g., "You likely have a very creative side." or "You might be someone who enjoys helping others.")
2.  **Life Path:** Offer simple guidance about their general direction or potential. (e.g., "Learning new things could be really rewarding for you." or "Building strong friendships might be important on your journey.")
3.  **Current Influences:** Give a very simple hint about the current energy affecting them. (e.g., "It might be a good time to focus on your goals." or "You might feel a bit more thoughtful lately.")
{{#if userQuery}}
4.  **Direct Answer:** Directly answer the user's specific question: "{{{userQuery}}}" using extremely simple terms. Remember to answer about the USER, not yourself. Avoid complex astrology. Keep it concise and clear.
{{/if}}

Ensure the output matches the required JSON schema format (personalityInsights, lifePathInsights, currentTransitInsights, directAnswer?). Remember: SIMPLE, CLEAR, NO JARGON, 1-2 sentences per section, in {{{language}}}. Address the USER based on their details.`,
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
    // The prompt now explicitly asks for the desired format and language.
    return output!;
  }
);
