import { campaigns } from '@/db/schema';
import { eq, desc, asc, and, or, like, count, AnyColumn, sql } from 'drizzle-orm';
import { CampaignStatus } from '@/constants/campaign';
import db from '@/db/db';
import { paginate } from '@/lib/paginate';

// --- INFERRED TYPES ---
export type CreateCampaignData = typeof campaigns.$inferInsert;
export type UpdateCampaignData = Partial<CreateCampaignData>;
export type CampaignColumns = typeof campaigns.$inferSelect;

export const CampaignSortOptions: Record<string, {column: AnyColumn, order: 'asc' | 'desc'}> = {
  'latest': {column: campaigns.createdAt, order: 'desc'},
  'oldest': {column: campaigns.createdAt, order: 'asc'},
  'title-asc': {column: campaigns.title, order: 'asc'},
  'title-desc': {column: campaigns.title, order: 'desc'},
}

export type CampaignFilters = {
  status?: string;
  search?: string;
  isPrivate?: string;
  page: number;
  limit: number;
  sort: keyof typeof CampaignSortOptions;
}

export const CampaignModel = {
  /**
   * Get all campaigns for a brand with summary information
   */
  async getAllCampaigns(brandId: number) {
    const results = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.brandId, brandId))
      .orderBy(desc(campaigns.createdAt));
    
    return results;
  },

  /**
   * Get paginated campaigns with filtering and sorting
   */
  async getPaginatedCampaigns(brandId: number, filters: CampaignFilters) {
    const {
      status = '',
      search = '',
      isPrivate = '',
      page = 1,
      limit = 10,
      sort = 'latest',
    } = filters;

    // Build where conditions
    const whereConditions = [eq(campaigns.brandId, brandId)];
    
    if (status) {
      whereConditions.push(eq(campaigns.status, status));
    }
    
    if (isPrivate && isPrivate !== 'all') {
      const isPrivateBool = isPrivate === 'private';
      whereConditions.push(eq(campaigns.isPrivate, isPrivateBool));
    }
    
    if (search) {
      whereConditions.push(
        or(
          like(campaigns.title, `%${search}%`),
          like(campaigns.code, `%${search}%`),
          sql`EXISTS (SELECT 1 FROM jsonb_array_elements_text(${campaigns.tags}) as elem WHERE elem.value LIKE ${`%${search}%`})`
        )!
      );
    }

    const whereClause = whereConditions.length > 0 
      ? and(...whereConditions)
      : undefined;

    // Get paginated results
    const sortColumn = CampaignSortOptions[sort].column;
    const sortOrder = CampaignSortOptions[sort].order;
    const orderBy = sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn);

    const campaignQuery = whereClause 
      ? db.select().from(campaigns).where(whereClause).orderBy(orderBy)
      : db.select().from(campaigns).orderBy(orderBy);

    const countQuery = whereClause
      ? db.select({count: count()}).from(campaigns).where(whereClause)
      : db.select({count: count()}).from(campaigns);

    const paginatedData = await paginate({
      query: campaignQuery.$dynamic(),
      countQuery: countQuery.$dynamic(),
      page,
      limit
    });
    
    return paginatedData;
  },

  /**
   * Get campaign by ID with full details
   */
  async getCampaignById(id: number) {
    const result = await db
      .select()
      .from(campaigns)
      .where(eq(campaigns.id, id));

    const campaign = result[0] || null;
    if (!campaign) return null;

    return campaign;
  },

  /**
   * Get campaign by ID and brand ID (for security)
   */
  async getCampaignByIdAndBrand(id: number, brandId: number) {
    const result = await db
      .select()
      .from(campaigns)
      .where(and(eq(campaigns.id, id), eq(campaigns.brandId, brandId)));

    const campaign = result[0] || null;
    if (!campaign) return null;

    return campaign;
  },

  /**
   * Create a new campaign
   */
  async createCampaign(data: CreateCampaignData) {
    const [campaign] = await db
      .insert(campaigns)
      .values({
        ...data,
        status: data.status || CampaignStatus.DRAFT,
        cookieDuration: data.cookieDuration || 30,
        isPrivate: data.isPrivate || false,
      })
      .returning();

      return campaign;
  },

  /**
   * Update campaign by ID
   */
  async updateCampaign(id: number, data: UpdateCampaignData) {
    const updateData = {
      ...data,
      updatedAt: new Date()
    };

    // Convert tags if provided
    if (data.tags !== undefined) {
      updateData.tags = data.tags as string[];
    }

    const [updatedCampaign] = await db
      .update(campaigns)
      .set(updateData)
      .where(eq(campaigns.id, id))
      .returning();

    if (!updatedCampaign) return null;

    return await this.getCampaignById(id);
  },
};
