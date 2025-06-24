// env.ts
import { config } from 'dotenv';
import { z } from 'zod';

await config({
    path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'test', 'production']).default('production'),
    PORT: z.coerce.number().default(3333),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
    console.error('❌ Invalid environment variables:', parsedEnv.error.format());
    throw new Error('Invalid environment variables.');
}

export const env = parsedEnv.data;
export type Env = typeof env;