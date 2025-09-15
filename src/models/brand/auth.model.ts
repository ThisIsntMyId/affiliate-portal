import { brands } from '@/db/schema';
import { eq } from 'drizzle-orm';
import db from '@/db/db';
import { cryptoService } from '@/services/crypto.service';

export interface LoginCredentials {
  email: string;
  password: string;
}

export const AuthModel = {
  async findByEmail(email: string) {
    try {
      const [brand] = await db
        .select()
        .from(brands)
        .where(eq(brands.email, email));

      return brand || null;
    } catch (error) {
      console.error('Failed to find brand by email:', error);
      throw error;
    }
  },

  async authenticate({ email, password }: LoginCredentials) {
    try {
      const brand = await this.findByEmail(email);
      if (!brand) return null;

      const isValidPassword = await cryptoService.match(password, brand.passwordHash);
      if (!isValidPassword) return null;

      return brand;
    } catch (error) {
      console.error('Failed to authenticate brand:', error);
      throw error;
    }
  },

  async findById(id: number) {
    try {
      const [brand] = await db
        .select()
        .from(brands)
        .where(eq(brands.id, id));

      return brand || null;
    } catch (error) {
      console.error('Failed to find brand by ID:', error);
      throw error;
    }
  },
};
