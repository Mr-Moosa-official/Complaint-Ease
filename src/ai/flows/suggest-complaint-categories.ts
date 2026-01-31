'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting complaint categories and keywords based on a user-provided description.
 *
 * - suggestComplaintCategories -  A function that accepts a complaint description and returns suggested categories and keywords.
 * - SuggestComplaintCategoriesInput - The input type for the suggestComplaintCategories function.
 * - SuggestComplaintCategoriesOutput - The output type for the suggestComplaintCategories function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestComplaintCategoriesInputSchema = z.object({
  description: z
    .string()
    .describe('A detailed description of the complaint issue.'),
});
export type SuggestComplaintCategoriesInput = z.infer<
  typeof SuggestComplaintCategoriesInputSchema
>;

const SuggestComplaintCategoriesOutputSchema = z.object({
  categories: z
    .array(z.string())
    .describe('An array of suggested complaint categories.'),
  keywords: z.array(z.string()).describe('An array of relevant keywords.'),
});
export type SuggestComplaintCategoriesOutput = z.infer<
  typeof SuggestComplaintCategoriesOutputSchema
>;

export async function suggestComplaintCategories(
  input: SuggestComplaintCategoriesInput
): Promise<SuggestComplaintCategoriesOutput> {
  return suggestComplaintCategoriesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestComplaintCategoriesPrompt',
  input: {schema: SuggestComplaintCategoriesInputSchema},
  output: {schema: SuggestComplaintCategoriesOutputSchema},
  prompt: `You are an AI assistant designed to suggest relevant complaint categories and keywords based on a user's description of their issue. Analyze the following complaint description and provide an array of categories and an array of keywords that would be most appropriate for categorizing the complaint.

Description: {{{description}}}

Categories:
Keywords: `,
});

const suggestComplaintCategoriesFlow = ai.defineFlow(
  {
    name: 'suggestComplaintCategoriesFlow',
    inputSchema: SuggestComplaintCategoriesInputSchema,
    outputSchema: SuggestComplaintCategoriesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
