import db from '@/db/db';
import { admins } from '@/db/schema';
import { cryptoService } from '@/services/crypto.service';
import { eq } from 'drizzle-orm';

export interface LoginCredentials {
  email: string;
  password: string;
}

export const AuthModel = {
  async findByEmail(email: string) {
    try {
      const [admin] = await db
        .select()
        .from(admins)
        .where(eq(admins.email, email));

      return admin || null;
    } catch (error) {
      console.error('Failed to find admin by email:', error);
      throw error;
    }
  },

  async authenticate({ email, password }: LoginCredentials) {
    try {
      const admin = await this.findByEmail(email);
      if (!admin) return null;

      const isValidPassword = await cryptoService.match(password, admin.passwordHash);
      if (!isValidPassword) return null;

      return admin;
    } catch (error) {
      console.error('Failed to authenticate admin:', error);
      throw error;
    }
  },

  async findById(id: number) {
    try {
      const [admin] = await db
        .select()
        .from(admins)
        .where(eq(admins.id, id));

      return admin || null;
    } catch (error) {
      console.error('Failed to find admin by ID:', error);
      throw error;
    }
  },
};
