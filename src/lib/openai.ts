import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  console.warn('OPENAI_API_KEY is not set in environment variables');
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy', // Prevent crash on build if key is missing
  baseURL: process.env.OPENAI_BASE_URL || undefined,
  defaultHeaders: process.env.OPENAI_BASE_URL?.includes('openrouter.ai')
    ? {
        'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'https://festalab.app',
        'X-Title': 'FestaLab',
      }
    : undefined,
});


