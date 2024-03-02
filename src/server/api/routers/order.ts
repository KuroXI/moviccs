import { z } from "zod";
import { generateCoordinates } from "@/functions/generateCoordinates";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/server/api/trpc";
import { type Coordinate } from "@/types";
import { generateItems } from "@/functions/generateItems";
import { getDistance } from "@/functions/getDistance";
import { getLocation } from "@/functions/getLocation";

export const orderRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ count: z.number(), location: z.custom<Coordinate>() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.session.user.role !== "ADMIN") {
        throw new Error("You are not authorized to perform this action");
      }

      const coordinates = await generateCoordinates({ count: input.count, location: input.location });
      for (const { latitude, longitude } of coordinates) {
        const { address } = await getLocation(latitude, longitude);
        const { distance } = await getDistance(input.location, { latitude, longitude });

        const createOrder = await ctx.db.order.create({
          data: {
            address,
            distance,
            coordinates: [latitude, longitude],
          },
        });

        const itemData = generateItems({ count: 5, orderById: createOrder.id });
        await ctx.db.item.createMany({ data: itemData });
      }
    }),

  get: publicProcedure.query(async ({ ctx }) => {
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
        status: "PLACED",
      }
    });
  }),
});
