import { defineConfig } from "drizzle-kit";
import * as dotenv from "dotenv";
import serverConfig from "@/infrastructure/server.config";

dotenv.config();

const connectionString = process.env.NODE_ENV === "production" ? serverConfig.PROD_DB_URL : serverConfig.DEV_DB_URL;

export default defineConfig({
  schema: "./src/db/schema",         // Path to your schema file
  out: "./drizzle",                 // Where migrations & metadata are stored
  dialect: "postgresql",            // Change if using MySQL/SQLite
  verbose: true,
  dbCredentials: {
    url: connectionString!, // Your connection string
  },
});