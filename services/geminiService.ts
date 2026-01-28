import { AnalysisResult } from "../types";

const GEMINI_ENDPOINT =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent";

export const analyzeNews = async (content: string): Promise<AnalysisResult> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Gemini API key missing");
  }

  const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: content }]
        }
      ]
    })
  });

  if (!response.ok) {
    throw new Error("Gemini API request failed");
  }

  const data = await response.json();
  const text =
    data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

  return {
    verdict: "MIXED",
    confidence: 50,
    summary: text,
    metrics: [],
    logicalFallacies: [],
    linguisticPatterns: [],
    sources: []
  };
};
