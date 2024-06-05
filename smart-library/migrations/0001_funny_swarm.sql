CREATE TABLE `book_log_new` (
  `id` INTEGER PRIMARY KEY NOT NULL,
  `book_id` INTEGER NOT NULL,
  `book_status` text DEFAULT 'available' NOT NULL,
  `comment` text,
  `created_at` INTEGER DEFAULT (unixepoch () * 1000) NOT NULL,
  FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON UPDATE cascade ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO
  book_log_new
SELECT
  `id`,
  `book_id`,
  `book_status`,
  `comment`,
  (unixepoch () * 1000) AS created_at
FROM
  book_log;
--> statement-breakpoint
DROP TABLE book_log;
--> statement-breakpoint
ALTER TABLE book_log_new
RENAME TO book_log;




--> statement-breakpoint
CREATE TABLE `locations_new` (
  `id` INTEGER PRIMARY KEY NOT NULL,
  `name` text NOT NULL,
  `created_at` INTEGER DEFAULT (unixepoch () * 1000) NOT NULL
);
--> statement-breakpoint
INSERT INTO
  locations_new
SELECT
  `id`,
  `name`,
  (unixepoch () * 1000) AS created_at
FROM
  locations;
--> statement-breakpoint
CREATE TABLE `temp_locations__books` (book_id INTEGER, location_id INTEGER);
--> statement-breakpoint
INSERT INTO
  `temp_locations__books`
SELECT
  id,
  location_id
FROM
  books;
--> statement-breakpoint
UPDATE books
SET
  location_id = NULL;
--> statement-breakpoint
DROP TABLE locations;
--> statement-breakpoint
ALTER TABLE locations_new
RENAME TO locations;
--> statement-breakpoint
UPDATE books
SET
  location_id = (
    SELECT
      location_id
    FROM
      `temp_locations__books`
    WHERE
      book_id = books.id
  );
--> statement-breakpoint
DROP TABLE `temp_locations__books`;




--> statement-breakpoint
CREATE TABLE `books_new` (
  `id` INTEGER PRIMARY KEY NOT NULL,
  `author` text NOT NULL,
  `title` text NOT NULL,
  `year` INTEGER,
  `udk` text,
  `rfid_id` INTEGER,
  `location_id` INTEGER,
  `book_status` text DEFAULT 'available' NOT NULL,
  `created_at` INTEGER DEFAULT (unixepoch () * 1000) NOT NULL,
  FOREIGN KEY (`location_id`) REFERENCES `locations` (`id`) ON UPDATE cascade ON DELETE SET NULL
);
--> statement-breakpoint
INSERT INTO
  books_new
SELECT
  `id`,
  `author`,
  `title`,
  `year`,
  `udk`,
  `rfid_id`,
  `location_id`,
  `book_status`,
  (unixepoch () * 1000) AS created_at
FROM
  books;
--> statement-breakpoint
CREATE TABLE temp_book_log (
  `id` INTEGER PRIMARY KEY NOT NULL,
  `book_id` INTEGER NOT NULL,
  `book_status` text DEFAULT 'available' NOT NULL,
  `comment` text,
  `created_at` INTEGER DEFAULT (unixepoch () * 1000) NOT NULL
);
--> statement-breakpoint
INSERT INTO
  temp_book_log
SELECT
  *
FROM
  book_log;
--> statement-breakpoint
DELETE FROM book_log;
--> statement-breakpoint
DROP TABLE books;
--> statement-breakpoint
ALTER TABLE books_new
RENAME TO books;
--> statement-breakpoint
INSERT INTO
  book_log
SELECT
  *
FROM
  temp_book_log;
--> statement-breakpoint
DROP TABLE temp_book_log;
