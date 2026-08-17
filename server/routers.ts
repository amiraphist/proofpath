import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getPlayerProgress, savePlayerProgress } from "./db";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  progress: router({
    list: protectedProcedure.query(({ ctx }) => getPlayerProgress(ctx.user.id)),
    save: protectedProcedure.input(z.object({
      stageId: z.number().int().min(1).max(10),
      mode: z.enum(["build", "fix"]),
      completed: z.boolean(),
      score: z.number().int().min(0).max(100),
      attempts: z.number().int().min(0),
    })).mutation(({ ctx, input }) => savePlayerProgress({ userId: ctx.user.id, ...input })),
  }),
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
