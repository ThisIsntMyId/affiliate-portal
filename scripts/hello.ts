#!/usr/bin/env tsx
import { Command } from 'commander';
import { config } from '../src/config';

const hello = async ({ name }: { name?: string }) => {
  try {
    console.log(`🚀 Hello ${name ? name : 'World'} from ${config.app.name}!`);
    console.log(`📱 Environment: ${config.app.env}`);
    console.log(`🌐 App URL: ${config.app.url}`);
    console.log(`✅ Script completed successfully`);
  } catch (error) {
    console.error('❌ Script failed:', error);
    process.exit(1);
  }
};

const program = new Command();
program
  .name('hello')
  .description('Say hello and show app configuration')
  .version('1.0.0')
  .option('-n, --name <name>', 'Name to greet')
  .action(hello);

program.parse();
