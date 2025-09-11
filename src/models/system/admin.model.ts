import db from '@/db/db';
import { admins } from '@/db/schema';
import { cryptoService } from '@/services/crypto.service';
import { eq } from 'drizzle-orm';

export interface CreateAdminData {
  name: string;
  email: string;
  password: string;
}

export interface Admin {
  id: number;
  name: string | null;
  email: string;
  passwordHash: string;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}

export const AdminModel = {
  async createUser({ name, email, password }: CreateAdminData): Promise<Admin> {
    try {
      const passwordHash = await cryptoService.hash(password);

      const [admin] = await db
        .insert(admins)
        .values({
          name,
          email,
          passwordHash,
        })
        .returning();

      return admin;
    } catch (error) {
      console.error('Failed to create admin user:', error);
      throw error;
    }
  },

  async findByEmail(email: string): Promise<Admin | null> {
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
};
