'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { config } from '@/config';
import { AuthModel } from '@/models/brand/auth.model';
import { createJWTToken } from '@/auth/brand';
import { getRoute } from '@/app/brand/routes';

// Validation schema for login
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Login action
export async function login(data: unknown) {
  try {
    // Validate input
    const validated = loginSchema.parse(data);
    
    // Authenticate brand
    const brand = await AuthModel.authenticate(validated);
    if (!brand) {
      return {
        success: false,
        error: 'Invalid email or password',
      };
    }

    // Check if brand is active
    if (brand.status !== 'active') {
      return {
        success: false,
        error: 'Your account is inactive. Please contact support.',
      };
    }

    // Create JWT token
    const token = createJWTToken({
      id: brand.id,
      email: brand.email,
      name: brand.name || 'Brand',
      logo: brand.logo || undefined,
      type: 'brand',
    });
    
    // Set cookie
    const cookieStore = await cookies();
    cookieStore.set(config.session.cookieName, token, {
      httpOnly: true,
      secure: config.app.env === 'production',
      sameSite: 'lax',
      maxAge: config.session.cookieDuration,
    });

    console.log(getRoute('brand.dashboard'))
    
    // Redirect to brand dashboard
    return redirect(getRoute('brand.dashboard'));
    
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
  return redirect(getRoute('brand.login'));
}

// Clear session action (without redirect)
export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(config.session.cookieName);
  return { success: true };
}
