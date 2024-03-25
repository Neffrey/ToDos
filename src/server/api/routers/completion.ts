import "server-only";

// Make sure you can't import this on client// LIBS
import { TRPCError } from "@trpc/server";
import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

// UTILS
import { createTRPCRouter, userProcedure } from "~/server/api/trpc";
import { taskCompletions } from "~/server/db/schema";

export const completionRouter = createTRPCRouter({
  create: userProcedure
    .input(
      z.object({
        taskId: z.string().min(1),
        timeframeCompletion: z.boolean().default(false).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.insert(taskCompletions).values({
        taskId: input.taskId,
        userId: ctx.session.user.id,
        timeframeCompletion: input.timeframeCompletion,
      });
    }),
  createWithReturn: userProcedure
    .input(
      z.object({
        taskId: z.string().min(1),
        timeframeCompletion: z.boolean().default(false).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(taskCompletions).values({
        taskId: input.taskId,
        userId: ctx.session.user.id,
        timeframeCompletion: input.timeframeCompletion,
      });
      return await ctx.db.query.taskCompletions.findMany({
        where: eq(taskCompletions.taskId, input.taskId),
      });
    }),
  delete: userProcedure
    .input(
      z.object({
        taskId: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const getLatestCompletion = await ctx.db
        .select({ id: taskCompletions.id })
        .from(taskCompletions)
        .where(eq(taskCompletions.taskId, input.taskId))
        .orderBy(desc(taskCompletions.createdAt))
        .limit(1);

      const latestCompletion = getLatestCompletion.pop();

      if (!latestCompletion)
        throw new TRPCError({
          message: "No completion found",
          code: "NOT_FOUND",
        });
      return await ctx.db
        .delete(taskCompletions)
        .where(
          and(
            eq(taskCompletions.id, latestCompletion.id),
            eq(taskCompletions.userId, ctx.session.user.id),
          ),
        );
    }),
});
