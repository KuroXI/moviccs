import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const userRouter = createTRPCRouter({
  setMaxWeight: protectedProcedure.input(z.object({ weight: z.number() })).mutation(async ({ ctx, input }) => {
    return await ctx.db.user.update({
      data: {
        maxWeight: input.weight,
      },
      where: {
        id: ctx.session.user.id,
      },
    });
  }),
});
