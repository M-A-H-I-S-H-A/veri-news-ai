
export interface GroundingSource {
  title: string;
  uri: string;
}

export enum Verdict {
  REAL = "REAL",
  LIKELY_REAL = "LIKELY REAL",
  MIXED = "MIXED",
  LIKELY_FAKE = "LIKELY FAKE",
  FAKE = "FAKE"
}

export interface AnalysisMetric {
  name: string;
  score: number; // 0 to 100
  description: string;
}

export interface AnalysisResult {
  verdict: Verdict;
  confidence: number;
  summary: string;
  metrics: AnalysisMetric[];
  logicalFallacies: string[];
  linguisticPatterns: string[];
  sources: GroundingSource[];
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  title: string;
  verdict: Verdict;
}
