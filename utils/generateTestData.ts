import { openai } from './openaiClient';
import { PolicyTestData } from './types';

export async function generateTestData(prompt: string, schema: any): Promise<PolicyTestData> {
  const systemPrompt = `You are a test data generator. Given a schema and a prompt, return a single JSON object that matches the schema. Only return the JSON.`;
  const userPrompt = `${prompt}\n\nSchema:\n${JSON.stringify(schema, null, 2)}`;

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.2,
    max_tokens: 512
  });

  // Extract JSON from the response
  const match = response.choices[0].message.content?.match(/\{[\s\S]*\}/);
  if (!match) throw new Error('No JSON object found in OpenAI response');
  return JSON.parse(match[0]) as PolicyTestData;
}
