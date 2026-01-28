import { AnalysisResult } from "../types";

export const analyzeNews = async (content: string): Promise<AnalysisResult> => {
  // Simulate network delay (realistic AI behavior)
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const lower = content.toLowerCase();

  let verdict: AnalysisResult["verdict"] = "MIXED";
  let confidence = 60;
  let summary = "The content shows mixed signals and requires cautious interpretation.";

  // Very simple rule-based mock logic
  if (
    lower.includes("scientists confirm") ||
    lower.includes("miracle") ||
    lower.includes("guaranteed") ||
    lower.includes("100%") ||
    lower.includes("instantly")
  ) {
    verdict = "FAKE";
    confidence = 85;
    summary =
      "The content uses exaggerated claims and lacks verifiable sources, which are common indicators of misinformation.";
  } else if (
    lower.includes("government") ||
    lower.includes("official") ||
    lower.includes("reported by") ||
    lower.includes("according to")
  ) {
    verdict = "LIKELY REAL";
    confidence = 75;
    summary =
      "The content references official entities or neutral phrasing, which generally increases credibility.";
  }

  return {
    verdict,
    confidence,
    summary,
    metrics: [
      {
        name: "Linguistic Bias",
        score: verdict === "FAKE" ? 80 : 40,
        description: "Measures sensational or emotionally charged language."
      },
      {
        name: "Factual Consistency",
        score: verdict === "FAKE" ? 30 : 70,
        description: "Checks logical coherence and plausibility."
      },
      {
        name: "Source Reliability",
        score: verdict === "FAKE" ? 25 : 65,
        description: "Estimates trustworthiness of implied sources."
      }
    ],
    logicalFallacies:
      verdict === "FAKE"
        ? ["Appeal to Authority", "Hasty Generalization"]
        : ["None detected"],
    linguisticPatterns:
      verdict === "FAKE"
        ? ["sensational wording", "absolute claims"]
        : ["neutral tone"],
    sources: []
  };
};
