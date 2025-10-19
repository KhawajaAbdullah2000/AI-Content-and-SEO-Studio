
export interface SEOAnalysis {
  suggestedTitles: string[];
  metaDescription: string;
  primaryKeywords: string[];
  secondaryKeywords: string[];
  readabilityAnalysis: {
    score: string;
    feedback: string;
  };
}
