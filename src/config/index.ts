import z from "zod";

const envSchema = z.object({
  PORT: z.number().default(3000),
  DATABASE_URL: z.string(),
});

const env = envSchema.parse(process.env);

export const config = {
    port: env.PORT,
    db: {
        url: env.DATABASE_URL,
    }
};