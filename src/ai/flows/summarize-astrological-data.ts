'use server';

/**
 * @fileOverview Summarizes complex astrological data into easy-to-understand language.
 *
 * - summarizeAstrologicalData - A function that handles the summarization process.
 * - SummarizeAstrologicalDataInput - The input type for the summarizeAstrologicalData function.
 * - SummarizeAstrologicalDataOutput - The return type for the summarizeAstrologicalData function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const SummarizeAstrologicalDataInputSchema = z.object({
  astrologicalData: z
    .string()
    .describe('The astrological data to summarize, can be a report or other complex data.'),
});
export type SummarizeAstrologicalDataInput = z.infer<
  typeof SummarizeAstrologicalDataInputSchema
>;

const SummarizeAstrologicalDataOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the astrological data.'),
});
export type SummarizeAstrologicalDataOutput = z.infer<
  typeof SummarizeAstrologicalDataOutputSchema
>;

export async function summarizeAstrologicalData(
  input: SummarizeAstrologicalDataInput
): Promise<SummarizeAstrologicalDataOutput> {
  return summarizeAstrologicalDataFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeAstrologicalDataPrompt',
  input: {
    schema: z.object({
      astrologicalData: z
        .string()
        .describe(
          'The astrological data to summarize, can be a report or other complex data.'
        ),
    }),
  },
  output: {
    schema: z.object({
      summary: z.string().describe('A concise summary of the astrological data.'),
    }),
  },
  prompt: `You are an expert astrologer. Please summarize the following astrological data into a concise and easy-to-understand summary. 

Astrological Data: {{{astrologicalData}}}`,
});

const summarizeAstrologicalDataFlow = ai.defineFlow<
  typeof SummarizeAstrologicalDataInputSchema,
  typeof SummarizeAstrologicalDataOutputSchema
>(
  {
    name: 'summarizeAstrologicalDataFlow',
    inputSchema: SummarizeAstrologicalDataInputSchema,
    outputSchema: SummarizeAstrologicalDataOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
