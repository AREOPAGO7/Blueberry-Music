import type { Config } from "drizzle-kit";

export default {
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "mysql",

 
  dbCredentials: {
    url: "mysql://anass@localhost:3306/next",
  },
} satisfies Config;
