import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const orderRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    if (ctx.session.user.role !== "ADMIN") {
      throw new Error("You are not authorized to perform this action");
    }
  }),
});
