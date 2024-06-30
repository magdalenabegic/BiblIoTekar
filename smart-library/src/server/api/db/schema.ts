import { relations, sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { BookStatus } from "~/utils/constants/book";

const timestamp = (columnName: string) =>
  int(columnName, {
    mode: "timestamp_ms",
  })
    .notNull()
    .default(sql`(unixepoch() * 1000)`);

const withTimestamps = (
  opts: {
    withUpdated?: boolean;
    withDeleted?: boolean;
  } = {},
) => ({
  createdAt: timestamp("created_at"),
  ...(opts.withUpdated
    ? {
        updatedAt: timestamp("updated_at"),
      }
    : {}),
  ...(opts.withDeleted
    ? {
        deletedAt: timestamp("deleted_at"),
      }
    : {}),
});

export const locations = sqliteTable("locations", {
  id: int("id").notNull().primaryKey(),
  name: text("name").notNull(),

  ...withTimestamps(),
});
export type Location = typeof locations.$inferSelect;

export const books = sqliteTable("books", {
  id: int("id").notNull().primaryKey(),
  author: text("author").notNull(),
  title: text("title").notNull(),
  year: int("year"),
  udk: text("udk"),
  rfidId: int("rfid_id"),
  locationId: int("location_id").references(() => locations.id, {
    onUpdate: "cascade",
    onDelete: "set null",
  }),
  bookStatus: text("book_status")
    .notNull()
    .default(BookStatus.Available)
    .$type<BookStatus>(),

  ...withTimestamps(),
});
export type Book = typeof books.$inferSelect;

export const booksRelations = relations(books, ({ one }) => ({
  location: one(locations, {
    fields: [books.locationId],
    references: [locations.id],
  }),
}));

export const bookLog = sqliteTable("book_log", {
  id: int("id").notNull().primaryKey(),
  bookId: int("book_id")
    .notNull()
    .references(() => books.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  bookStatus: text("book_status")
    .notNull()
    .default(BookStatus.Available)
    .$type<BookStatus>(),
  comment: text("comment"),

  ...withTimestamps(),
});
export type BookLog = typeof bookLog.$inferSelect;

export const bookLogRelations = relations(bookLog, ({ one }) => ({
  book: one(books, {
    fields: [bookLog.bookId],
    references: [books.id],
  }),
}));