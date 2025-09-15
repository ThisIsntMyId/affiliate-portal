ALTER TABLE "campaigns" ALTER COLUMN "code" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "commission_rates" ALTER COLUMN "code" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "creatives" ALTER COLUMN "code" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "terms" text;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "image" varchar(500);--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "status" varchar(50) DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "link" varchar(500);--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "is_private" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "tags" jsonb;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "cookie_duration" integer DEFAULT 30 NOT NULL;--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "utm_source" varchar(255);--> statement-breakpoint
ALTER TABLE "campaigns" ADD COLUMN "utm_campaign" varchar(255);--> statement-breakpoint
ALTER TABLE "commission_rates" ADD COLUMN "is_active" boolean DEFAULT true NOT NULL;--> statement-breakpoint
ALTER TABLE "campaigns" DROP COLUMN "is_active";