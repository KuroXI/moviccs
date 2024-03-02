import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const deliveryRouter = createTRPCRouter({
  create: protectedProcedure.input(z.object({ orderIds: z.string().array() })).mutation(async ({ ctx, input }) => {
    await ctx.db.order.updateMany({
      data: {
        status: "CONFIRMED",
      },
      where: {
        id: {
          in: input.orderIds,
        },
      },
    });

    await ctx.db.deliver.createMany({
      data: input.orderIds.map((orderId) => ({
        orderId,
        deliveryById: ctx.session.user.id,
      })),
    });
  }),

  get: protectedProcedure.query(async ({ ctx }) => {
    const orderIds = await ctx.db.deliver.findMany({
      where: {
        deliveryById: ctx.session.user.id,
      },
    });

    return await ctx.db.order.findMany({
      select: {
        id: true,
        address: true,
        status: true,
        distance: true,
        coordinates: true,
        items: true,
      },
      where: {
        id: {
          in: orderIds.map((order) => order.orderId),
        },
      },
    });
  }),
});
