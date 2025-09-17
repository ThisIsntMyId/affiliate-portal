import { creatives } from '@/db/schema';
import { eq, desc, asc, and, or, like, count, AnyColumn } from 'drizzle-orm';
import db from '@/db/db';
import { paginate } from '@/lib/paginate';

// --- INFERRED TYPES ---
export type CreateCreativeData = typeof creatives.$inferInsert;
export type UpdateCreativeData = Partial<CreateCreativeData>;
export type CreativeColumns = typeof creatives.$inferSelect;

export const CreativeSortOptions: Record<string, {column: AnyColumn, order: 'asc' | 'desc'}> = {
  'latest': {column: creatives.createdAt, order: 'desc'},
  'oldest': {column: creatives.createdAt, order: 'asc'},
  'name-asc': {column: creatives.name, order: 'asc'},
  'name-desc': {column: creatives.name, order: 'desc'},
  'type-asc': {column: creatives.type, order: 'asc'},
  'type-desc': {column: creatives.type, order: 'desc'},
}

export type CreativeFilters = {
  type?: string;
  isActive?: string;
  search?: string;
  page: number;
  limit: number;
  sort: keyof typeof CreativeSortOptions;
}

export const CreativeModel = {
  /**
   * Get all creatives for a campaign
   */
  async getCreativesByCampaign(campaignId: number) {
    const results = await db
      .select()
      .from(creatives)
      .where(eq(creatives.campaignId, campaignId))
      .orderBy(desc(creatives.createdAt));
    
    return results;
  },

  /**
   * Get paginated creatives with filtering and sorting
   */
  async getPaginatedCreatives(campaignId: number, filters: CreativeFilters) {
    const {
      type = '',
      isActive = '',
      search = '',
      page = 1,
      limit = 10,
      sort = 'latest',
    } = filters;

    // Build where conditions
    const whereConditions = [eq(creatives.campaignId, campaignId)];
    
    if (type) {
      whereConditions.push(eq(creatives.type, type));
    }
    
    if (isActive && isActive !== 'all') {
      const isActiveBool = isActive === 'active';
      whereConditions.push(eq(creatives.isActive, isActiveBool));
    }
    
    if (search) {
      whereConditions.push(
        or(
          like(creatives.name, `%${search}%`),
          like(creatives.code, `%${search}%`),
          like(creatives.type, `%${search}%`)
        )!
      );
    }

    const whereClause = whereConditions.length > 0 
      ? and(...whereConditions)
      : undefined;

    // Get paginated results
    const sortColumn = CreativeSortOptions[sort].column;
    const sortOrder = CreativeSortOptions[sort].order;
    const orderBy = sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn);

    const creativeQuery = whereClause 
      ? db.select().from(creatives).where(whereClause).orderBy(orderBy)
      : db.select().from(creatives).orderBy(orderBy);

    const countQuery = whereClause
      ? db.select({count: count()}).from(creatives).where(whereClause)
      : db.select({count: count()}).from(creatives);

    const paginatedData = await paginate({
      query: creativeQuery.$dynamic(),
      countQuery: countQuery.$dynamic(),
      page,
      limit
    });
    
    return paginatedData;
  },

  /**
   * Get creative by ID
   */
  async getCreativeById(id: number) {
    const result = await db
      .select()
      .from(creatives)
      .where(eq(creatives.id, id));

    return result[0] || null;
  },

  /**
   * Get creative by ID and campaign ID (for security)
   */
  async getCreativeByIdAndCampaign(id: number, campaignId: number) {
    const result = await db
      .select()
      .from(creatives)
      .where(and(eq(creatives.id, id), eq(creatives.campaignId, campaignId)));

    return result[0] || null;
  },

  /**
   * Create a new creative
   */
  async createCreative(data: CreateCreativeData) {
    const [creative] = await db
      .insert(creatives)
      .values({
        ...data,
        isActive: data.isActive || true,
      })
      .returning();

    return creative;
  },

  /**
   * Update creative by ID
   */
  async updateCreative(id: number, data: UpdateCreativeData) {
    const updateData = {
      ...data,
      updatedAt: new Date()
    };

    const [updatedCreative] = await db
      .update(creatives)
      .set(updateData)
      .where(eq(creatives.id, id))
      .returning();

    return updatedCreative;
  },

  /**
   * Delete creative by ID
   */
  async deleteCreative(id: number) {
    const [deletedCreative] = await db
      .delete(creatives)
      .where(eq(creatives.id, id))
      .returning();

    return deletedCreative || null;
  },
};
