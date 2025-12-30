import { z } from 'zod';
import { analysisResponseSchema } from './schema';

export const errorSchemas = {
  validation: z.object({ message: z.string() }),
  server: z.object({ message: z.string() }),
};

export const api = {
  resume: {
    analyze: {
      method: 'POST' as const,
      path: '/api/analyze',
      // Input is FormData, which we don't strictly type here for Zod, 
      // but the backend will expect 'resume' (file) and 'job_description' (string)
      responses: {
        200: analysisResponseSchema,
        400: errorSchemas.validation,
        500: errorSchemas.server,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
