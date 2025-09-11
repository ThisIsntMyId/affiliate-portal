#!/usr/bin/env tsx
import { Command } from 'commander';
import { config } from '../src/config';
import { AdminModel } from '../src/models/system/admin.model';
import { z } from 'zod';

// 1. Define the business logic function
const createAdmin = async ({ name, email, password }: { name: string; email: string; password: string }) => {
  try {
    // Validate with Zod
    const argsSchema = z.object({
      name: z.string().min(1, 'Name is required'),
      email: z.string().email('Invalid email address'),
      password: z.string().min(8, 'Password must be at least 8 characters long'),
    });
    
    const args = argsSchema.parse({ name, email, password });
    
    console.log('🚀 Creating admin user...');
    console.log(`App: ${config.app.name}`);
    console.log(`Environment: ${config.app.env}`);
    console.log(`Name: ${args.name}`);
    console.log(`Email: ${args.email}`);
    
    // Check if admin already exists
    const existingAdmin = await AdminModel.findByEmail(args.email);
    if (existingAdmin) {
      console.error('❌ Admin user with this email already exists');
      process.exit(1);
    }
    
    // Create the admin user
    const newAdmin = await AdminModel.createUser({
      name: args.name,
      email: args.email,
      password: args.password,
    });
    
    console.log('✅ Admin user created successfully!');
    console.log(`ID: ${newAdmin.id}`);
    console.log(`Name: ${newAdmin.name}`);
    console.log(`Email: ${newAdmin.email}`);
    console.log(`Created: ${newAdmin.createdAt.toISOString()}`);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
};

// 2. Define the CLI interface
const program = new Command();
program
  .name('create-admin')
  .description('Create a new admin user for the Affiliate Portal')
  .version('1.0.0')
  .option('-n, --name <name>', 'Admin user name')
  .option('-e, --email <email>', 'Admin user email address')
  .option('-p, --password <password>', 'Admin user password (minimum 8 characters)')
  .action(createAdmin);

// 3. Parse and execute
program.parse();
