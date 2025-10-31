import { openai } from './openaiClient';

export interface PlaywrightStep {
  action: string;
  selector?: string;
  value?: string | number;
  comment?: string;
}

export async function generatePlaywrightSteps(prompt: string): Promise<PlaywrightStep[]> {
  const systemPrompt = `You are an expert Playwright test generator. Given a prompt, return a JSON array of Playwright test steps. Each step should have an 'action' (e.g., 'click', 'fill', 'goto'), a 'selector' if needed, and a 'value' for input actions. Only return the JSON array.`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ],
    temperature: 0.2,
    max_tokens: 512
  });

  // Extract JSON array from the response
  const match = response.choices[0].message.content?.match(/\[[\s\S]*\]/);
  if (!match) throw new Error('No JSON array found in OpenAI response');
  return JSON.parse(match[0]) as PlaywrightStep[];
}
