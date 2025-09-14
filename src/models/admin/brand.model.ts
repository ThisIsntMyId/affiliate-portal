import { brands } from '@/db/schema';
import { eq, sql, desc, asc, and, or, like, count, AnyColumn } from 'drizzle-orm';
import { BrandStatus } from '@/constants/brand';
import db from '@/db/db';
import { paginate } from '@/lib/paginate';

// --- INFERRED TYPES ---
export type CreateBrandData = typeof brands.$inferInsert;
export type UpdateBrandData = Partial<CreateBrandData>;
export type BrandColumns = typeof brands.$inferSelect;

export const BrandSortOptions: Record<string, {column: AnyColumn, order: 'asc' | 'desc'}> = {
  'latest': {column: brands.createdAt, order: 'desc'},
  'oldest': {column: brands.createdAt, order: 'asc'},
  'name-asc': {column: brands.name, order: 'asc'},
  'name-desc': {column: brands.name, order: 'desc'},
}

export type BrandFilters = {
  status?: string;
  search?: string;
  page: number;
  limit: number;
  sort: keyof typeof BrandSortOptions;
}

export const BrandModel = {
  /**
   * Get all brands with summary information and statistics
   */
  async getAllBrands() {
    return await db
      .select()
      .from(brands)
      .orderBy(desc(brands.createdAt));
  },

  /**
   * Get paginated brands with filtering and sorting
   */
  async getPaginatedBrands(filters: BrandFilters) {
    const {
      status = '',
      search = '',
      page = 1,
      limit = 10,
      sort = 'latest',
    } = filters;

    // Build where conditions
    const whereConditions = [];
    
    if (status) {
      whereConditions.push(eq(brands.status, status));
    }
    
    if (search) {
      whereConditions.push(
        or(
          like(brands.name, `%${search}%`),
          like(brands.email, `%${search}%`),
          like(brands.website, `%${search}%`)
        )
      );
    }

    const whereClause = whereConditions.length > 0 
      ? and(...whereConditions)
      : undefined;

    // Get paginated results
    const sortColumn = BrandSortOptions[sort].column;
    const sortOrder = BrandSortOptions[sort].order;
    const orderBy = sortOrder === 'asc' ? asc(sortColumn) : desc(sortColumn);

    const brandQuery = db
      .select()
      .from(brands)
      .where(whereClause)
      .orderBy(orderBy);

    const countQuery = db
      .select({count: count()})
      .from(brands)
      .where(whereClause);

    const paginatedData = await paginate({
      query: brandQuery.$dynamic(),
      countQuery: countQuery.$dynamic(),
      page,
      limit
    });
    
    return paginatedData;
  },

  /**
   * Get brand by ID with full details
   */
  async getBrandById(id: number) {
    const result = await db
      .select()
      .from(brands)
      .where(eq(brands.id, id)); // .groupBy() was removed

    return result[0] || null;
  },

  /**
   * Get brand by ID with full details
   */
  async brandExistsByEmail(email: string) {
    const result = await db
      .select()
      .from(brands)
      .where(eq(brands.email, email)); // .groupBy() was removed

    return result[0] || null;
  },

  /**
   * Create a new brand
   */
  async createBrand(data: CreateBrandData) {
    const [brand] = await db
      .insert(brands)
      .values({
        ...data,
        status: data.status || BrandStatus.ACTIVE,
        timezone: data.timezone || 'UTC'
      })
      .returning();

    return brand;
  },

  /**
   * Update brand by ID
   */
  async updateBrand(id: number, data: UpdateBrandData) {
    const [updatedBrand] = await db
      .update(brands)
      .set({
        ...data,
        updatedAt: new Date()
      })
      .where(eq(brands.id, id))
      .returning();

    if (!updatedBrand) return null;

    return await this.getBrandById(id);
  },
};