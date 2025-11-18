// lib/db.ts
import { neon } from '@neondatabase/serverless';

// ✅ Load DB connection string from env
const sql = neon(process.env.DATABASE_URL!);

export default sql;
