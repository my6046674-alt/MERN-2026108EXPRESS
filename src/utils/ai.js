import { GoogleGenAI } from '@google/genai';
import config from '../config/config.js';

const apiKey = config.geminiApiKey;

if (!apiKey) {
  console.warn('GEMINI_API_KEY is missing. AI features will fail until it is set.');
}

const ai = new GoogleGenAI({ apiKey });

const promptAI = async (promptMessage) => {
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is missing. Add a valid Google AI API key in your environment.');
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',
    contents: promptMessage,
  });

  return response.text;
};

export default promptAI