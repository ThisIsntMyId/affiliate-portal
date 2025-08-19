CREATE TYPE "public"."commission_rate_type" AS ENUM('fixed', 'percent');--> statement-breakpoint
CREATE TYPE "public"."link_type" AS ENUM('affiliate', 'referral');--> statement-breakpoint
CREATE TYPE "public"."payout_status" AS ENUM('pending', 'processing', 'paid', 'declined');--> statement-breakpoint
CREATE TABLE "admins" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"timezone" varchar(100) DEFAULT 'UTC' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "admins_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "affiliates" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(50) NOT NULL,
	"brand_id" integer NOT NULL,
	"name" varchar(255),
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"payment_details" jsonb,
	"timezone" varchar(100) DEFAULT 'UTC' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "affiliates_code_unique" UNIQUE("code"),
	CONSTRAINT "affiliates_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "brands" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	"email" varchar(255) NOT NULL,
	"password_hash" varchar(255) NOT NULL,
	"website" varchar(255),
	"tracking_domain" varchar(255),
	"settings" jsonb,
	"timezone" varchar(100) DEFAULT 'UTC' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "brands_code_unique" UNIQUE("code"),
	CONSTRAINT "brands_email_unique" UNIQUE("email"),
	CONSTRAINT "brands_tracking_domain_unique" UNIQUE("tracking_domain")
);
--> statement-breakpoint
CREATE TABLE "campaigns" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(50) NOT NULL,
	"brand_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"settings" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "campaigns_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "clicks" (
	"id" serial PRIMARY KEY NOT NULL,
	"link_id" integer NOT NULL,
	"ip_address" "inet",
	"user_agent" text,
	"sub_ids" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "commission_rates" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(50) NOT NULL,
	"campaign_id" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"type" "commission_rate_type" NOT NULL,
	"value" numeric(10, 2) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "commission_rates_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "conversions" (
	"id" serial PRIMARY KEY NOT NULL,
	"click_id" integer NOT NULL,
	"brand_id" integer NOT NULL,
	"sale_amount" numeric(10, 2),
	"commission_amount" numeric(10, 2) DEFAULT '0.00' NOT NULL,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "conversions_click_id_unique" UNIQUE("click_id")
);
--> statement-breakpoint
CREATE TABLE "creatives" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(50) NOT NULL,
	"campaign_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" varchar(50) NOT NULL,
	"content" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "creatives_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "links" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(100) NOT NULL,
	"brand_id" integer NOT NULL,
	"affiliate_id" integer,
	"referrer_id" integer,
	"campaign_id" integer,
	"type" "link_type" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "links_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "payouts" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(50) NOT NULL,
	"brand_id" integer NOT NULL,
	"affiliate_id" integer NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"status" "payout_status" DEFAULT 'pending' NOT NULL,
	"notes" text,
	"transaction_id" varchar(500),
	"decline_reason" varchar(500),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "payouts_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "referrers" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" varchar(50) NOT NULL,
	"brand_id" integer NOT NULL,
	"name" varchar(255),
	"email" varchar(255),
	"password_hash" varchar(255),
	"external_id" varchar(255) NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"timezone" varchar(100) DEFAULT 'UTC' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "referrers_code_unique" UNIQUE("code")
);
--> statement-breakpoint
ALTER TABLE "affiliates" ADD CONSTRAINT "affiliates_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clicks" ADD CONSTRAINT "clicks_link_id_links_id_fk" FOREIGN KEY ("link_id") REFERENCES "public"."links"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "commission_rates" ADD CONSTRAINT "commission_rates_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversions" ADD CONSTRAINT "conversions_click_id_clicks_id_fk" FOREIGN KEY ("click_id") REFERENCES "public"."clicks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversions" ADD CONSTRAINT "conversions_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "creatives" ADD CONSTRAINT "creatives_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "links" ADD CONSTRAINT "links_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "links" ADD CONSTRAINT "links_affiliate_id_affiliates_id_fk" FOREIGN KEY ("affiliate_id") REFERENCES "public"."affiliates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "links" ADD CONSTRAINT "links_referrer_id_referrers_id_fk" FOREIGN KEY ("referrer_id") REFERENCES "public"."referrers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "links" ADD CONSTRAINT "links_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payouts" ADD CONSTRAINT "payouts_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payouts" ADD CONSTRAINT "payouts_affiliate_id_affiliates_id_fk" FOREIGN KEY ("affiliate_id") REFERENCES "public"."affiliates"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrers" ADD CONSTRAINT "referrers_brand_id_brands_id_fk" FOREIGN KEY ("brand_id") REFERENCES "public"."brands"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "affiliates_brand_email_idx" ON "affiliates" USING btree ("brand_id","email");--> statement-breakpoint
CREATE UNIQUE INDEX "brands_email_idx" ON "brands" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "campaigns_brand_code_idx" ON "campaigns" USING btree ("brand_id","code");--> statement-breakpoint
CREATE INDEX "clicks_link_id_idx" ON "clicks" USING btree ("link_id");--> statement-breakpoint
CREATE INDEX "commission_rates_campaign_id_idx" ON "commission_rates" USING btree ("campaign_id");--> statement-breakpoint
CREATE INDEX "conversions_click_id_idx" ON "conversions" USING btree ("click_id");--> statement-breakpoint
CREATE INDEX "conversions_brand_id_idx" ON "conversions" USING btree ("brand_id");--> statement-breakpoint
CREATE INDEX "creatives_campaign_id_idx" ON "creatives" USING btree ("campaign_id");--> statement-breakpoint
CREATE INDEX "links_brand_id_idx" ON "links" USING btree ("brand_id");--> statement-breakpoint
CREATE INDEX "links_affiliate_id_idx" ON "links" USING btree ("affiliate_id");--> statement-breakpoint
CREATE INDEX "links_referrer_id_idx" ON "links" USING btree ("referrer_id");--> statement-breakpoint
CREATE INDEX "links_campaign_id_idx" ON "links" USING btree ("campaign_id");--> statement-breakpoint
CREATE INDEX "payouts_brand_id_idx" ON "payouts" USING btree ("brand_id");--> statement-breakpoint
CREATE INDEX "payouts_affiliate_id_idx" ON "payouts" USING btree ("affiliate_id");--> statement-breakpoint
CREATE UNIQUE INDEX "referrers_brand_email_idx" ON "referrers" USING btree ("brand_id","email");