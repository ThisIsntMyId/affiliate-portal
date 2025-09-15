"use server"

// For SQLite, use: import { SqliteSelect } from 'drizzle-orm/sqlite-core';
import { PgSelect } from 'drizzle-orm/pg-core';

export type Pagination = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * The shape of the final pagination object.
 */
export interface PaginationResult<T> {
  data: T[];
  pagination: Pagination;
}

// A generic type for the query builder, replace PgSelect with your driver's Select type
type SelectQueryBuilder = PgSelect;

/**
 * A type-safe pagination utility for Drizzle ORM that accepts separate data and count queries.
 *
 * @param query - The Drizzle query builder for fetching the data set (e.g., db.select()...).
 * @param countQuery - The Drizzle query builder for fetching the total count (e.g., db.select({ count: count() })...).
 * @param page - The current page number (1-indexed). Defaults to 1.
 * @param limit - The number of items per page. Defaults to 10.
 * @returns A promise that resolves to a fully typed PaginationResult object.
 */
export async function paginate<T extends SelectQueryBuilder>({
  query,
  countQuery,
  page = 1,
  limit = 10,
}: {
  query: T;
  countQuery: SelectQueryBuilder;
  page?: number;
  limit?: number;
}): Promise<PaginationResult<T['_']['result'][0]>> {
  // Sanitize page and limit values
  const safePage = Math.max(1, Math.floor(page));
  const safeLimit = Math.max(1, Math.min(100, Math.floor(limit)));
  const offset = (safePage - 1) * safeLimit;

  // Execute both queries in parallel for efficiency
  const [data, totalResult] = await Promise.all([
    query.limit(safeLimit).offset(offset),
    countQuery,
  ]);

  // Safely extract the total count
  const total = Number(totalResult[0]?.count ?? 0);
  const totalPages = Math.ceil(total / safeLimit);

  return {
    /**
     * The paginated data, fully typed based on the provided `query`.
     */
    data,
    /**
     * Pagination metadata.
     */
    pagination: {
      total,
      page: safePage,
      limit: safeLimit,
      totalPages,
      hasNext: safePage < totalPages,
      hasPrev: safePage > 1,
    },
  };
}