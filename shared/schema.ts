import { z } from "zod";

export const analysisResponseSchema = z.object({
  match_score: z.string(),
  matching_strengths: z.array(z.string()),
  missing_skills: z.array(z.string()),
  improvement_suggestions: z.array(z.string()),
  cold_email: z.string(),
});

export type AnalysisResponse = z.infer<typeof analysisResponseSchema>;

// Export chat models to satisfy integration requirements
export * from "./models/chat";

