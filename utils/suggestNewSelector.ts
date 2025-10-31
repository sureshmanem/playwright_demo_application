import { openai } from './openaiClient';

export async function suggestNewSelector(
  failingCode: string,
  error: string,
  domSnapshot: string
): Promise<string> {
  const systemPrompt = `You are an expert Playwright test engineer. Given a failing selector, the error, and a DOM snapshot, suggest a robust new selector string. Only return the selector.`;
  const userPrompt = `
Failing Code:
${failingCode}

Error:
${error}

DOM Snapshot:
${domSnapshot}
`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.1,
    max_tokens: 100
  });

  // Return the selector string (first line of response)
  return response.choices[0].message.content?.trim().split('\n')[0] || '';
}
