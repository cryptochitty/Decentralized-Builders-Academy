

import { GoogleGenAI } from "@google/genai";

export const explainConcept = async (topic: string): Promise<string> => {
  const API_KEY = process.env.API_KEY;

  if (!API_KEY) {
    return Promise.reject(new Error("Gemini API key is not configured."));
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are a helpful assistant for blockchain beginners. Explain the concept of "${topic}" in a clear, concise, and easy-to-understand way. Use an analogy if possible. Format your response using markdown.`,
    });

    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get explanation from Gemini API.");
  }
};