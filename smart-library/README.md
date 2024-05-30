# Smart Library App

## How do I use this?

If you are not familiar with the different technologies used in this project, please refer to the respective docs.

- [Next.js](https://nextjs.org)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Very basic structure

### Routing

The [pages folder](./src/pages) is where all the routes are located.

- A file named `my-page.tsx` will be rendered on the route `/my-page`.
- A file named `my-other-page/index.tsx` (a file `index.tsx` in a folder named `my-other-page`) will be rendered on the route `/my-other-page` (or `/my-other-page/`).
- A file named `my-other-page/something-else.tsx` will be rendered on the route `/my-other-page/something-else`.
- A file named `my-other-page/blog-posts/[blogPostId].tsx` will be rendered on the route `/my-other-page/blog-posts/1`, `/my-other-page/blog-posts/a-blog-post`, etc. Aka. whenever you put any part of the filename in square brackets (`[` and `]`), it will be treated as a dynamic route segment and can be replaced with any value in the URL (see [dynamic routes](https://nextjs.org/docs/routing/dynamic-routes) for more information).

### Talking with the backend

Talking with the router is abstracted away using tRPC.
tRPC has a concept of "routers" that can be used to route requests to the backend.

The [routers folder](./src/server/api/routers/) is where all the backend logic is located.

If you are not familiar with tRPC, please refer to the [tRPC docs](https://trpc.io/docs).

## Useful commands

These are some commands that you will probably use often while developing:

- `npm run dev` - Run the dev server with hot reloading. Will be your most common command
- `npm run build` - Build the project for production. To start it, run `npm run start`
- `npm run drizzle-studio` - Start drizzle studio, a nice web UI for your database
- `npm run migrate` - Run database migrations
- `npm run create-migration` - Create a new database migration from the [drizzle schema](./src/server/api/db/schema.ts)
