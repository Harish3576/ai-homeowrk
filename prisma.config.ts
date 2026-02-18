import "dotenv/config";
import { defineConfig, env } from "prisma/config";

// Prisma configuration file for Prisma ORM v7.
// This file defines the schema location and sets the datasource URL using the
// DATABASE_URL environment variable. The `url` property has been removed
// from `schema.prisma` as per Prisma 7 requirements.

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: env("DATABASE_URL"),
  },
});