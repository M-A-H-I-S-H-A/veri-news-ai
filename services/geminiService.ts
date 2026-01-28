import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

export const analyzeNews = async (content: string): Promise<AnalysisResult> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Gemini API key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  const model = "gemini-3-flash-preview";

  const systemInstruction = `
    You are an expert news analyst and fact-checker.
    Analyze the provided news text for authenticity.
    Simulate a multi-layered NLP pipeline:
    1. Linguistic Pattern Analysis (TF-IDF simulation).
    2. Sentiment & Bias detection.
    3. Factual verification using Google Search.
    4. Logical fallacy detection.

    Return your analysis in a strict JSON format.
  `;

  const prompt = `
    Please analyze the following news content:
    ---
    ${content}
    ---

    Assess the content based on linguistic patterns, sensationalism, and factual consistency.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            verdict: {
              type: Type.STRING,
              enum: ["REAL", "LIKELY REAL", "MIXED", "LIKELY FAKE", "FAKE"]
            },
            confidence: { type: Type.NUMBER },
            summary: { type: Type.STRING },
            metrics: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  score: { type: Type.NUMBER },
                  description: { type: Type.STRING }
                },
                required: ["name", "score", "description"]
              }
            },
            logicalFallacies: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            linguisticPatterns: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: [
            "verdict",
            "confidence",
            "summary",
            "metrics",
            "logicalFallacies",
            "linguisticPatterns"
          ]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");

    const groundingChunks =
      response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    const sources = groundingChunks
      .filter((chunk: any) => chunk.web)
      .map((chunk: any) => ({
        title: chunk.web.title || "External Source",
        uri: chunk.web.uri
      }));

    return {
      ...data,
      sources
    } as AnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze the news.");
  }
};
