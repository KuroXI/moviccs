import { z } from "zod";
import { generateCoordinates } from "@/functions/generateCoordinates";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import type { Coordinate } from "@/types";
import { getGeoLocation } from "@/functions/getGeoLocation";

export const orderRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ count: z.number(), location: z.custom<Coordinate>() }))
    .mutation(async ({ ctx, input }) => {
      // if (ctx.session.user.role !== "ADMIN") {
      //   throw new Error("You are not authorized to perform this action");
      // }

      const coordinates = await generateCoordinates({ count: input.count, location: input.location });
      const orders = await getGeoLocation({ coordinates, location: input.location });

      await Promise.all(
        orders.map(async (order) => {
          const createOrder = await ctx.db.order.create({
            data: {
              address: order.address,
              distance: order.distance,
              coordinates: order.coordinates,
            },
          });

          const itemData = order.item.map((item) => ({
            item: item.item,
            price: item.price,
            weight: item.weight,
            amount: item.amount,
            orderById: createOrder.id,
          }));

          await ctx.db.item.createMany({ data: itemData });
        }),
      );
    }),

  get: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.order.findMany({
      where: {
        status: "order_placed",
      },
    });
  }),
});
