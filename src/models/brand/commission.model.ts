import { commissionRates } from '@/db/schema';
import { eq, desc, asc, and, or, like, count, AnyColumn } from 'drizzle-orm';
import db from '@/db/db';
import { paginate } from '@/lib/paginate';

// --- INFERRED TYPES ---
export type CreateCommissionRateData = typeof commissionRates.$inferInsert;
export type UpdateCommissionRateData = Partial<CreateCommissionRateData>;
export type CommissionRateColumns = typeof commissionRates.$inferSelect;

export const CommissionRateSortOptions: Record<string, {column: AnyColumn, order: 'asc' | 'desc'}> = {
  'latest': {column: commissionRates.createdAt, order: 'desc'},
  'oldest': {column: commissionRates.createdAt, order: 'asc'},
  'title-asc': {column: commissionRates.title, order: 'asc'},
  'title-desc': {column: commissionRates.title, order: 'desc'},
  'value-asc': {column: commissionRates.value, order: 'asc'},
  'value-desc': {column: commissionRates.value, order: 'desc'},
}

export type CommissionRateFilters = {
  type?: string;
  isActive?: string;
  search?: string;
  page: number;
  limit: number;
  sort: keyof typeof CommissionRateSortOptions;
}

export const CommissionRateModel = {
  /**
   * Get all commission rates for a campaign
   */
  async getCommissionRatesByCampaign(campaignId: number) {
    const results = await db
      .select()
      .from(commissionRates)
      .where(eq(commissionRates.campaignId, campaignId))
      .orderBy(desc(commissionRates.createdAt));
    
    return results;
  },

  /**
   * Get paginated commission rates with filtering and sorting
   */
  async getPaginatedCommissionRates(campaignId: number, filters: CommissionRateFilters) {
    const {
      type = '',
      isActive = '',
      search = '',
      page = 1,
      limit = 10,
      sort = 'latest',
    } = filters;

    // Build where conditions
    const whereConditions = [eq(commissionRates.campaignId, campaignId)];
    
    if (type) {
      whereConditions.push(eq(commissionRates.type, type as 'fixed' | 'percent'));
    }
    
    if (isActive && isActive !== 'all') {
      const isActiveBool = isActive === 'active';
      whereConditions.push(eq(commissionRates.isActive, isActiveBool));
    }
    
    if (search) {
      whereConditions.push(
        or(
          like(commissionRates.title, `%${search}%`),
          like(commissionRates.code, `%${search}%`)
        )!
      );
    }

    const whereClause = whereConditions.length > 0 
      ? and(...whereConditions)
      : undefined;

    // Get paginated results
    const sortColumn = CommissionRateSortOptions[sort].column;
    const sortOrder = CommissionRateSortOptions[sort].order;
    const orderBy = sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn);

    const commissionQuery = whereClause 
      ? db.select().from(commissionRates).where(whereClause).orderBy(orderBy)
      : db.select().from(commissionRates).orderBy(orderBy);

    const countQuery = whereClause
      ? db.select({count: count()}).from(commissionRates).where(whereClause)
      : db.select({count: count()}).from(commissionRates);

    const paginatedData = await paginate({
      query: commissionQuery.$dynamic(),
      countQuery: countQuery.$dynamic(),
      page,
      limit
    });
    
    return paginatedData;
  },

  /**
   * Get commission rate by ID
   */
  async getCommissionRateById(id: number) {
    const result = await db
      .select()
      .from(commissionRates)
      .where(eq(commissionRates.id, id));

    return result[0] || null;
  },

  /**
   * Get commission rate by ID and campaign ID (for security)
   */
  async getCommissionRateByIdAndCampaign(id: number, campaignId: number) {
    const result = await db
      .select()
      .from(commissionRates)
      .where(and(eq(commissionRates.id, id), eq(commissionRates.campaignId, campaignId)));

    return result[0] || null;
  },

  /**
   * Create a new commission rate
   */
  async createCommissionRate(data: CreateCommissionRateData) {
    const [commissionRate] = await db
      .insert(commissionRates)
      .values({
        ...data,
        isActive: data.isActive || true,
      })
      .returning();

    return commissionRate;
  },

  /**
   * Update commission rate by ID
   */
  async updateCommissionRate(id: number, data: UpdateCommissionRateData) {
    const updateData = {
      ...data,
      updatedAt: new Date()
    };

    const [updatedCommissionRate] = await db
      .update(commissionRates)
      .set(updateData)
      .where(eq(commissionRates.id, id))
      .returning();

    return updatedCommissionRate;
  },

  /**
   * Delete commission rate by ID
   */
  async deleteCommissionRate(id: number) {
    const [deletedCommissionRate] = await db
      .delete(commissionRates)
      .where(eq(commissionRates.id, id))
      .returning();

    return deletedCommissionRate || null;
  },
};
