import { createEnv } from '@t3-oss/env-nextjs';
import { z } from 'zod';

export const env = createEnv({
  server: {
    PORT: z.string().min(1),
    NODE_ENV: z.enum(['development', 'production']),
    ANALYZE: z.enum(['true', 'false']).optional().transform((value) => value === 'true'),
    BUILD_STANDALONE: z.enum(['true', 'false']).optional().transform((value) => value === 'true'),
    NEXT_PUBLIC_API_URL: z.string().min(1),
    INTERNAL_PROXY_URL: z.string().min(1),
  },
  client: {
    NEXT_PUBLIC_API_URL: z.string().min(1),
  },
  runtimeEnv: {
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV,
    ANALYZE: process.env.ANALYZE,
    BUILD_STANDALONE: process.env.BUILD_STANDALONE,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    INTERNAL_PROXY_URL: process.env.INTERNAL_PROXY_URL ?? process.env.NEXT_PUBLIC_API_URL,
  },
  // Skip validation at build time as secrets will not be available
  skipValidation: !!process.env.CI,
});
