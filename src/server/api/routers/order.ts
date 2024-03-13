import { z } from "zod";
import { generateCoordinates } from "@/functions/generateCoordinates";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "@/server/api/trpc";
import { type Coordinate } from "@/types";
import { generateItems } from "@/functions/generateItems";
import { getDistance } from "@/functions/getDistance";
import { getLocation } from "@/functions/getLocation";
import { type DeliveryStatus } from "@prisma/client";

export const orderRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ count: z.number(), location: z.custom<Coordinate>() }))
    .mutation(async ({ ctx, input }) => {
      const coordinates = generateCoordinates({ count: input.count, location: input.location });

      Promise.all(coordinates)
        .then(async (coordinates) => {
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

            await ctx.db.item.createMany({
              data: await generateItems({
                count: Math.floor(Math.random() * 2) + 1,
                orderById: createOrder.id,
              }),
            });
          }
        })
        .catch((error) => console.log(error));
    }),

  getAvailableOrder: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.order.findMany({
      include: {
        handler: true,
        items: true,
        pendingDelivery: true,
      },
      where: {
        status: "PLACED",
        handlerId: null,
      },
    });
  }),

  getDeliveryOrder: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.order.findMany({
      include: {
        handler: true,
        items: true,
        pendingDelivery: true,
      },
      where: {
        status: "PLACED",
        handlerId: ctx.session.user.id,
      },
    });
  }),

  setDeliveryOrder: protectedProcedure
    .input(z.object({ orderIds: z.string().array() }))
    .mutation(async ({ ctx, input }) => {
      const { ordersId } = await ctx.db.pendingDelivery.create({
        data: {
          handlerId: ctx.session.user.id,
        },
      });

      await ctx.db.order.updateMany({
        data: {
          status: "CONFIRMED",
          handlerId: ctx.session.user.id,
          orderGroupId: ordersId,
        },
        where: {
          id: {
            in: input.orderIds,
          },
        },
      });
    }),

  getPendingDeliveries: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.pendingDelivery.findUnique({
      include: {
        orders: {
          include: {
            handler: true,
            items: true,
            pendingDelivery: true,
          },
        },
      },
      where: {
        handlerId: ctx.session.user.id,
      },
    });
  }),

  setDeliveryStatus: protectedProcedure
    .input(z.object({ orderId: z.string(), status: z.custom<DeliveryStatus>() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.order.update({
        data: {
          status: input.status,
        },
        where: {
          id: input.orderId,
        },
      });
    }),
});
