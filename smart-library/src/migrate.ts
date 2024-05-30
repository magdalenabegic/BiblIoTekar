import "dotenv/config";
import { migrate } from "drizzle-orm/libsql/migrator";
import { db, client } from "./server/api/db";

import migrateConfig from "../drizzle.config";

// This will run migrations on the database, skipping the ones already applied
await migrate(db, {
  migrationsFolder: migrateConfig.out ?? "./migrations",
});

// Don't forget to close the connection, otherwise the script will hang
client.close();
