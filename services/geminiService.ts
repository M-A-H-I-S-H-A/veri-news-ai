
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, Verdict } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeNews = async (content: string): Promise<AnalysisResult> => {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    You are an expert news analyst and fact-checker. 
    Analyze the provided news text for authenticity. 
    Simulate a multi-layered NLP pipeline:
    1. Linguistic Pattern Analysis (TF-IDF simulation: identify key terms associated with misinformation).
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
              enum: ["REAL", "LIKELY REAL", "MIXED", "LIKELY FAKE", "FAKE"],
              description: "The overall credibility verdict."
            },
            confidence: { type: Type.NUMBER, description: "Confidence score from 0-100" },
            summary: { type: Type.STRING, description: "A concise 2-sentence summary of why this verdict was reached." },
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
              items: { type: Type.STRING },
              description: "List of logical fallacies identified (e.g., Straw Man, Appeal to Fear)."
            },
            linguisticPatterns: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Keywords or stylistic features (TF-IDF style) that triggered suspicion."
            }
          },
          required: ["verdict", "confidence", "summary", "metrics", "logicalFallacies", "linguisticPatterns"]
        }
      }
    });

    const data = JSON.parse(response.text || "{}");
    
    // Extract grounding URLs if available
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
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
    throw new Error("Failed to analyze the news. Please try again later.");
  }
};
