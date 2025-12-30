import { useMutation } from "@tanstack/react-query";
import { api, type AnalysisResponse } from "@shared/routes";

export type AnalyzeInput = {
  resume: File;
  job_description: string;
};

export function useAnalyzeResume() {
  return useMutation({
    mutationFn: async (data: AnalyzeInput) => {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("resume", data.resume);
      formData.append("job_description", data.job_description);

      const res = await fetch(api.resume.analyze.path, {
        method: api.resume.analyze.method,
        body: formData,
        // Don't set Content-Type header manually for FormData, 
        // browser sets it with boundary automatically
      });

      if (!res.ok) {
        if (res.status === 400) {
          const error = api.resume.analyze.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        if (res.status === 500) {
           const error = api.resume.analyze.responses[500].parse(await res.json());
           throw new Error(error.message);
        }
        throw new Error("Failed to analyze resume");
      }

      return api.resume.analyze.responses[200].parse(await res.json());
    },
  });
}
