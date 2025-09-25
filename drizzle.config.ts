import 'dotenv/config';
import type { Config } from "drizzle-kit";

export default {
    schema: "./src/app/db/schema.ts",
    out: "./drizzle",
    dialect: "mysql", 
    dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;