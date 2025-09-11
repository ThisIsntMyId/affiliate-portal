# Scripts Guidelines

## Overview
Scripts are utility files for administrative tasks, data management, and development operations. They provide direct access to the application's configuration, database, and services.

## File Structure
```
scripts/
├── hello.ts
├── create-admin.ts
├── seed-database.ts
└── ...
```

## Naming Convention
- Use `.ts` extension for all script files
- Use kebab-case for file names
- Be descriptive: `create-admin.ts`, `reset-password.ts`
- Context is clear from `scripts/` directory

## Execution
```bash
# Direct execution with tsx
npx tsx scripts/hello.ts
npx tsx scripts/create-admin.ts --name mark --email mark@mail.com

# With environment file
npx tsx --env-file .env scripts/hello.ts

# Show help
npx tsx scripts/create-admin.ts --help
```

## Script Structure
```typescript
#!/usr/bin/env tsx
import { Command } from 'commander';
import { config } from '../src/config';
import { AdminModel } from '../src/models/system/admin.model';
import { BrandModel } from '../src/models/system/brand.model';
import { z } from 'zod';

// 1. Define the business logic function
const scriptFunction = async ({ param1, param2 }: { param1: string; param2: string }) => {
  try {
    // Validate with Zod
    const argsSchema = z.object({
      param1: z.string().min(1),
      param2: z.string().min(1),
    });
    
    const args = argsSchema.parse({ param1, param2 });
    
    console.log('🚀 Starting script...');
    
    // Use system models for database operations
    // const users = await AdminModel.getAllUsers();
    // const brands = await BrandModel.getAllBrands();
    
    console.log('✅ Script completed successfully');
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
};

// 2. Define the CLI interface
const program = new Command();
program
  .name('script-name')
  .description('Script description')
  .version('1.0.0')
  .option('-p1, --param1 <value>', 'Parameter 1 description')
  .option('-p2, --param2 <value>', 'Parameter 2 description')
  .action(scriptFunction);

// 3. Parse and execute
program.parse();
```

## Best Practices

### Configuration Access
- Import config from `../src/config` - automatically loads env vars
- Use typed configuration values
- Validate required environment variables

### Database Access
- **Use System Models**: Import from `../src/models/system/` for full system access
- **No Direct DB Calls**: Scripts should use models, not direct database access
- **System Context**: System models have full access with no restrictions
- Always handle database errors gracefully

### Validation
- Use Zod for input validation [[memory:8052761]]
- Define validation schemas in script files [[memory:8052759]]
- Validate command line arguments

### Error Handling
- Use try-catch blocks
- Provide meaningful error messages
- Exit with appropriate codes (0 for success, 1 for failure)

### Logging
- Use console.log for progress updates
- Use console.error for errors
- Include emojis for better readability (🚀, ✅, ❌)

### Services
- Import services from `../src/services` when needed
- Use existing service layer for business logic [[memory:8052762]]

### CLI Library
- Use Commander.js for command line argument parsing
- Define business logic as separate functions
- Use Zod for input validation within functions
- Keep CLI interface separate from business logic

## Common Script Types

### Admin Scripts
- User management (create, update, delete)
- Permission management
- System maintenance

### Data Scripts
- Database seeding
- Data migration
- Cleanup operations

### Utility Scripts
- Health checks
- Connection tests
- Development helpers

## Dependencies

### Commander.js
Scripts use Commander.js for command line argument parsing. Install it as a dev dependency:

```bash
npm install --save-dev commander
npm install --save-dev @types/commander
```

### TypeScript Execution
Scripts are executed using `tsx` (already installed):

```bash
npx tsx scripts/script-name.ts
```

## Environment Variables
Scripts automatically have access to environment variables through the config import. No additional setup required.

## Examples

### Simple Hello Script
```typescript
#!/usr/bin/env tsx
import { Command } from 'commander';
import { config } from '../src/config';

const hello = async ({ name }: { name?: string }) => {
  console.log(`Hello ${name ? name : 'World'} from ${config.app.name}!`);
  console.log(`Environment: ${config.app.env}`);
  console.log(`Database URL: ${config.db.url}`);
};

const program = new Command();
program
  .name('hello')
  .description('Say hello and show config')
  .version('1.0.0')
  .option('-n, --name <name>', 'Name to greet')
  .action(hello);

program.parse();
```

### Admin User Creation
```typescript
#!/usr/bin/env tsx
import { Command } from 'commander';
import { config } from '../src/config';
import { AdminModel } from '../src/models/system/admin.model';
import { z } from 'zod';

const createAdmin = async ({ name, email, role }: { name: string; email: string; role: string }) => {
  try {
    // Validate with Zod
    const argsSchema = z.object({
      name: z.string().min(1),
      email: z.string().email(),
      role: z.enum(['admin', 'user']).default('user'),
    });
    
    const args = argsSchema.parse({ name, email, role });
    
    console.log('🚀 Creating admin user...');
    console.log('Args:', args);
    
    // const newUser = await AdminModel.createUser({
    //   email: args.email,
    //   name: args.name,
    //   role: args.role,
    // });
    
    console.log('✅ Admin user created');
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
};

const program = new Command();
program
  .name('create-admin')
  .description('Create a new admin user')
  .version('1.0.0')
  .option('-n, --name <name>', 'User name')
  .option('-e, --email <email>', 'User email')
  .option('-r, --role <role>', 'User role', 'user')
  .action(createAdmin);

program.parse();
```

## Security Notes
- Scripts run with full application access
- Be careful with production data
- Use dry-run modes for destructive operations
- Validate all inputs thoroughly
