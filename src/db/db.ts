import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { config } from '../config';

const db = drizzle(config.db.url);

export default db;
