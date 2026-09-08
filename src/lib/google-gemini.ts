import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GOOGLE_API_KEY;

const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

export function getGeminiClient() {
  if (!apiKey) {
    throw new Error('GOOGLE_API_KEY is not configured.');
  }
  return new GoogleGenAI({ apiKey });
}

export async function generateStructuredJson<T>({
  systemInstruction,
  userPrompt,
  jsonSchema,
  temperature = 0.2,
  model,
}: {
  systemInstruction: string;
  userPrompt: string;
  jsonSchema: object;
  temperature?: number;
  model?: string;
}): Promise<T> {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: model || DEFAULT_MODEL,
    contents: userPrompt,
    config: {
      temperature,
      systemInstruction,
      responseMimeType: 'application/json',
      responseSchema: jsonSchema,
    },
  });

  const text = response.text?.trim();
  if (!text) {
    throw new Error('Gemini returned no structured output.');
  }
  return JSON.parse(text) as T;
}

export async function generateText({
  systemInstruction,
  userPrompt,
  temperature = 0.2,
  model,
}: {
  systemInstruction: string;
  userPrompt: string;
  temperature?: number;
  model?: string;
}): Promise<string> {
  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: model || DEFAULT_MODEL,
    contents: userPrompt,
    config: {
      temperature,
      systemInstruction,
    },
  });

  const text = response.text?.trim();
  if (!text) {
    throw new Error('Gemini returned no text output.');
  }
  return text;
}