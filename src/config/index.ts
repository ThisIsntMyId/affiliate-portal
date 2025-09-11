import z from "zod";

const envSchema = z.object({
  // Application
  PORT: z.number().default(3000),
  APP_NAME: z.string().default("Affiliate Portal"),
  APP_URL: z.string().default("http://localhost:3000"),
  APP_ENV: z.enum(["development", "production", "test"]).default("development"),
  APP_SECRET: z.string().min(32, "APP_SECRET must be at least 32 characters long"),
  
  // Database
  DATABASE_URL: z.string(),
  
  // Session
  SESSION_JWT_SECRET: z.string().min(32, "SESSION_JWT_SECRET must be at least 32 characters long"),
  SESSION_COOKIE_NAME: z.string().default("afp-token"),
  SESSION_COOKIE_DURATION: z.number().default(43200),
  
  // Email
  MAIL_DRIVER: z.enum(["smtp", "log"]).default("log"),
  MAIL_HOST: z.string().optional(),
  MAIL_PORT: z.number().optional(),
  MAIL_USER: z.string().optional(),
  MAIL_PASS: z.string().optional(),
  MAIL_FROM: z.string().optional(),
  MAIL_FROM_NAME: z.string().optional(),
  
  // SMS
  SMS_DRIVER: z.enum(["twilio", "log"]).default("log"),
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_PHONE_NUMBER: z.string().optional(),
  
  // Cache
  CACHE_DRIVER: z.enum(["redis", "memory"]).default("memory"),
  REDIS_URL: z.string().optional(),
  
  // Storage
  STORAGE_DRIVER: z.enum(["s3", "local"]).default("local"),
  LOCAL_PATH: z.string().optional(),
  LOCAL_PUBLIC_URL: z.string().optional(),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().optional(),
  AWS_S3_BUCKET: z.string().optional(),
});

const env = envSchema.parse(process.env);

export const config = {
  // Application
  port: env.PORT,
  app: {
    name: env.APP_NAME,
    url: env.APP_URL,
    env: env.APP_ENV,
    secret: env.APP_SECRET,
  },
  
  // Database
  db: {
    url: env.DATABASE_URL,
  },
  
  // Session
  session: {
    jwtSecret: env.SESSION_JWT_SECRET,
    cookieName: env.SESSION_COOKIE_NAME,
    cookieDuration: env.SESSION_COOKIE_DURATION,
  },
  
  // Mail
  mail: {
    driver: env.MAIL_DRIVER,
    smtp: {
      host: env.MAIL_HOST,
      port: env.MAIL_PORT,
      user: env.MAIL_USER,
      pass: env.MAIL_PASS,
      from: env.MAIL_FROM,
      fromName: env.MAIL_FROM_NAME,
    },
  },
  
  // SMS
  sms: {
    driver: env.SMS_DRIVER,
    twilio: {
      accountSid: env.TWILIO_ACCOUNT_SID,
      authToken: env.TWILIO_AUTH_TOKEN,
      phoneNumber: env.TWILIO_PHONE_NUMBER,
    },
  },
  
  // Cache
  cache: {
    driver: env.CACHE_DRIVER,
    redis: {
      url: env.REDIS_URL,
    },
  },
  
  // Storage
  storage: {
    driver: env.STORAGE_DRIVER,
    s3: {
      accessKeyId: env.AWS_ACCESS_KEY_ID,
      secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
      region: env.AWS_REGION,
      bucket: env.AWS_S3_BUCKET,
    },
    local: {
      path: env.LOCAL_PATH,
      publicUrl: env.LOCAL_PUBLIC_URL,
    },
  },
};