import "server-only"; // Make sure you can't import this on client

// LIBS
import { and, eq } from "drizzle-orm";
import { z } from "zod";

// UTILS
import {
  createTRPCRouter,
  protectedUserProcedure,
  userProcedure,
} from "~/server/api/trpc";
import { TASK_TIMEFRAMES, tasks } from "~/server/db/schema";

export const taskRouter = createTRPCRouter({
  getAll: userProcedure.query(async ({ ctx }) => {
    // return await ctx.db.query.tasks.findMany({
    //   where: eq(tasks.userId, ctx.session.user.id),
    //   with: { comments: { with: { user: true } }, taskCompletions: true },
    // });
    const allTasks = await ctx.db.query.tasks.findMany({
      where: eq(tasks.userId, ctx.session.user.id),
      with: { comments: { with: { user: true } }, taskCompletions: true },
    });
    return allTasks;
  }),
  create: protectedUserProcedure
    .input(
      z.object({
        title: z.string().min(1),
        timesToComplete: z.number().int().min(1),
        timeframe: z.enum(TASK_TIMEFRAMES),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(tasks).values({
        title: input.title,
        userId: ctx.session.user.id,
        timesToComplete: input.timesToComplete,
        timeframe: input.timeframe,
      });
    }),
  edit: userProcedure
    .input(
      z.object({
        id: z.number().int().min(1),
        title: z.string().min(1).optional(),
        timesToComplete: z.number().int().min(1).optional(),
        timeframe: z.enum(TASK_TIMEFRAMES).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db
        .update(tasks)
        .set({
          title: input.title,
          userId: ctx.session.user.id,
          timesToComplete: input.timesToComplete,
          timeframe: input.timeframe,
        })
        .where(
          and(eq(tasks.id, input.id), eq(tasks.userId, ctx.session.user.id)),
        );
    }),
});
