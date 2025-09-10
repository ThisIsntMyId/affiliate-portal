import {
    pgTable,
    serial,
    integer,
    varchar,
    text,
    timestamp,
    boolean,
    jsonb,
    decimal,
    inet,
    pgEnum,
    uniqueIndex,
    index
} from 'drizzle-orm/pg-core';

// ===============================================
// == Enums for Data Integrity                 ==
// ===============================================

export const payoutStatusEnum = pgEnum('payout_status', ['pending', 'processing', 'paid', 'declined']);
export const commissionRateTypeEnum = pgEnum('commission_rate_type', ['fixed', 'percent']);
export const linkTypeEnum = pgEnum('link_type', ['affiliate', 'referral']);


// ===============================================
// == User & Brand Tables                     ==
// ===============================================

export const admins = pgTable('admins', {
    id: serial('id').primaryKey(),

    name: varchar('name', { length: 255 }),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    
    timezone: varchar('timezone', { length: 100 }).notNull().default('UTC'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export const brands = pgTable('brands', {
    id: serial('id').primaryKey(),
    code: varchar('code', { length: 50 }).notNull().unique(),
    
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),

    website: varchar('website', { length: 255 }),
    trackingDomain: varchar('tracking_domain', { length: 255 }).unique(),
    settings: jsonb('settings'),

    timezone: varchar('timezone', { length: 100 }).notNull().default('UTC'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
    uniqueIndex('brands_email_idx').on(table.email),
]);

export const affiliates = pgTable('affiliates', {
    id: serial('id').primaryKey(),
    code: varchar('code', { length: 50 }).notNull().unique(),
    
    brandId: integer('brand_id').notNull().references(() => brands.id),

    name: varchar('name', { length: 255 }),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    
    paymentDetails: jsonb('payment_details'),
    
    timezone: varchar('timezone', { length: 100 }).notNull().default('UTC'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
    uniqueIndex('affiliates_brand_email_idx').on(table.brandId, table.email),
]);

export const referrers = pgTable('referrers', {
    id: serial('id').primaryKey(),
    code: varchar('code', { length: 50 }).notNull().unique(),

    brandId: integer('brand_id').notNull().references(() => brands.id),
    
    name: varchar('name', { length: 255 }),
    email: varchar('email', { length: 255 }),
    passwordHash: varchar('password_hash', { length: 255 }),
    
    externalId: varchar('external_id', { length: 255 }).notNull(),
    
    isActive: boolean('is_active').notNull().default(true),
    
    timezone: varchar('timezone', { length: 100 }).notNull().default('UTC'),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
    uniqueIndex('referrers_brand_email_idx').on(table.brandId, table.email),
]);


// ===============================================
// == Campaign & Creatives Tables            ==
// ===============================================

export const campaigns = pgTable('campaigns', {
    id: serial('id').primaryKey(),
    code: varchar('code', { length: 50 }).notNull().unique(),
    
    brandId: integer('brand_id').notNull().references(() => brands.id),
    
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description'),
    
    isActive: boolean('is_active').notNull().default(true),
    settings: jsonb('settings'),
    
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
    uniqueIndex('campaigns_brand_code_idx').on(table.brandId, table.code),
]);

export const commissionRates = pgTable('commission_rates', {
    id: serial('id').primaryKey(),
    code: varchar('code', { length: 50 }).notNull().unique(),

    campaignId: integer('campaign_id').notNull().references(() => campaigns.id),
    
    title: varchar('title', { length: 255 }).notNull(),
    
    type: commissionRateTypeEnum('type').notNull(),
    value: decimal('value', { precision: 10, scale: 2 }).notNull(),
    
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
    index('commission_rates_campaign_id_idx').on(table.campaignId),
]);

export const creatives = pgTable('creatives', {
    id: serial('id').primaryKey(),
    code: varchar('code', { length: 50 }).notNull().unique(),
    
    campaignId: integer('campaign_id').notNull().references(() => campaigns.id),
    
    name: varchar('name', { length: 255 }).notNull(),
    type: varchar('type', { length: 50 }).notNull(),
    path: varchar('path').notNull(),
    
    isActive: boolean('is_active').notNull().default(true),
    
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
    index('creatives_campaign_id_idx').on(table.campaignId),
]);


// ===============================================
// == Tracking & Core Logic Tables            ==
// ===============================================

export const links = pgTable('links', {
    id: serial('id').primaryKey(),
    code: varchar('code', { length: 100 }).notNull().unique(),


    brandId: integer('brand_id').notNull().references(() => brands.id),
    affiliateId: integer('affiliate_id').references(() => affiliates.id),
    referrerId: integer('referrer_id').references(() => referrers.id),
    campaignId: integer('campaign_id').references(() => campaigns.id),
    
    type: linkTypeEnum('type').notNull(),
    
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
    index('links_brand_id_idx').on(table.brandId),
    index('links_affiliate_id_idx').on(table.affiliateId),
    index('links_referrer_id_idx').on(table.referrerId),
    index('links_campaign_id_idx').on(table.campaignId),
]);

export const clicks = pgTable('clicks', {
    id: serial('id').primaryKey(),
    
    linkId: integer('link_id').notNull().references(() => links.id),
    
    ipAddress: inet('ip_address'),
    userAgent: text('user_agent'),
    subIds: jsonb('sub_ids'),
    
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
    index('clicks_link_id_idx').on(table.linkId),
]);

export const conversions = pgTable('conversions', {
    id: serial('id').primaryKey(),

    clickId: integer('click_id').notNull().unique().references(() => clicks.id),
    brandId: integer('brand_id').notNull().references(() => brands.id),
    
    saleAmount: decimal('sale_amount', { precision: 10, scale: 2 }),
    commissionAmount: decimal('commission_amount', { precision: 10, scale: 2 }).notNull().default('0.00'),
    
    status: varchar('status', { length: 50 }).notNull().default('pending'),
    metadata: jsonb('metadata'),
    
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
    index('conversions_click_id_idx').on(table.clickId),
    index('conversions_brand_id_idx').on(table.brandId),
]);

export const payouts = pgTable('payouts', {
    id: serial('id').primaryKey(),
    code: varchar('code', { length: 50 }).notNull().unique(),
    
    brandId: integer('brand_id').notNull().references(() => brands.id),
    affiliateId: integer('affiliate_id').notNull().references(() => affiliates.id),
    
    amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
    status: payoutStatusEnum('status').notNull().default('pending'),
    notes: text('notes'),
    transactionId: varchar('transaction_id', { length: 500 }),
    declineReason: varchar('decline_reason', { length: 500 }),
    
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
    index('payouts_brand_id_idx').on(table.brandId),
    index('payouts_affiliate_id_idx').on(table.affiliateId),
]);