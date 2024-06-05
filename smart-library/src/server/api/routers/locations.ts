// src/server/api/routers/locations.ts

import { createTRPCRouter, publicProcedure } from "../trpc";
import { db } from "../db";

export const locationsRouter = createTRPCRouter({
    getAll: publicProcedure.query(() => {
      return db.query.locations.findMany({
        with: {
            id: true,
            name: true,
        }
      });
    }),
});