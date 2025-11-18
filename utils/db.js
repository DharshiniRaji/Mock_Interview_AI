// import { neon } from "@neondatabase/serverless";
// import { drizzle } from "drizzle-orm/neon-http";
// import * as schema from "./schema";

// const sql = neon(process.env.NEXT_PUBLIC_DRIZZLE_DB_URL);
// const db = drizzle({ client: sql });

// //export const db = drizzle(sql, { schema });

// const result = await db.execute("select 1");


// utils/db.js
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

import * as schema from "./schema";
const sql = neon(process.env.NEXT_PUBLIC_DRIZZLE_DB_URL);

export const db = drizzle(sql, { schema }); 

async function testDB() {
  try {
    const result = await db.execute("select 1");
    console.log("✅ DB connected successfully:", result);
  } catch (err) {
    console.error("❌ DB connection failed:", err);
  }
}

testDB(); 
