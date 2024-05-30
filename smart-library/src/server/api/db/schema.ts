import { relations, sql } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { BookStatus } from "~/utils/constants/book";

export const locations = sqliteTable("locations", {
  id: int("id").notNull().primaryKey(),
  name: text("name").notNull(),
  createdAt: int("created_at", {
    mode: "timestamp_ms",
  })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
export type Location = typeof locations.$inferSelect;

export const books = sqliteTable("books", {
  id: int("id").notNull().primaryKey(),
  author: text("author").notNull(),
  title: text("title").notNull(),
  year: int("year"),
  udk: text("udk"),
  rfidId: int("rfid_id"),
  locationId: int("location_id").references(() => locations.id),
  bookStatus: text("book_status")
    .notNull()
    .default(BookStatus.Available)
    .$type<BookStatus>(),
  createdAt: int("added_at", {
    mode: "timestamp_ms",
  })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
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
    .references(() => books.id),
  bookStatus: text("book_status")
    .notNull()
    .default(BookStatus.Available)
    .$type<BookStatus>(),
  comment: text("comment"),
  createdAt: int("created_at", {
    mode: "timestamp_ms",
  })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
export type BookLog = typeof bookLog.$inferSelect;
