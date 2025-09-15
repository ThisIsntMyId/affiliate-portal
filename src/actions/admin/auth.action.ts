'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { config } from '@/config';
import { AuthModel } from '@/models/admin/auth.model';
import { createJWTToken } from '@/auth/admin';
import { getRoute } from '@/app/admin/routes';

// Validation schema for login
const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Login action
export async function login(data: unknown) {
  try {
    // Validate input
    const validated = loginSchema.parse(data);
    
    // Authenticate admin
    const admin = await AuthModel.authenticate(validated);
    if (!admin) {
      return {
        success: false,
        error: 'Invalid email or password',
      };
    }

    // Create JWT token
    const token = createJWTToken({
      id: admin.id,
      email: admin.email,
      name: admin.name || 'Admin',
      type: 'admin',
    });
    
    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set(config.session.cookieName, token, {
      httpOnly: true,
      secure: config.app.env === 'production',
      sameSite: 'lax',
      maxAge: config.session.cookieDuration,
    });

    // Redirect to admin dashboard
    return redirect(getRoute('admin.dashboard'));
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: z.flattenError(error).fieldErrors,
      };
    }
    
    console.error('Login error:', error);
    return {
      success: false,
      error: 'An error occurred during login',
    };
  }
}

// Logout action
export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(config.session.cookieName);
  redirect(getRoute('admin.login'));
}
