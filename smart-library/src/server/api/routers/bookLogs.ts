import { createTRPCRouter, publicProcedure } from "../trpc";
import { db } from "../db";
import { bookLog, books } from "../db/schema";

export const bookLogsRouter = createTRPCRouter({
  getAll: publicProcedure.query(() => {
    return db.query.bookLog.findMany({
      with: {
        book: true,
      },
    });
  }),
});
