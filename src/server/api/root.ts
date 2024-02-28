// UTILS
import { createTRPCRouter } from "~/server/api/trpc";
import { taskRouter } from "~/server/api/routers/task";
import { userRouter } from "~/server/api/routers/user";
import { completionRouter } from "~/server/api/routers/completion";
import { profilePicturesRouter } from "./routers/profile-picture";
import { commentRouter } from "./routers/comment";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  completion: completionRouter,
  task: taskRouter,
  user: userRouter,
  profilePictures: profilePicturesRouter,
  comment: commentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
