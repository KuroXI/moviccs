import { z } from "zod";
import { generateCoordinates } from "@/functions/generateCoordinates";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/server/api/trpc";
import { type Coordinate, type GeoLocation, type Location } from "@/types";
import { mapboxInstance } from "@/lib/axios";
import { generateItems } from "@/functions/generateItems";

export const orderRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ count: z.number(), location: z.custom<Coordinate>() }))
    .mutation(async ({ ctx, input }) => {
      // if (ctx.session.user.role !== "ADMIN") {
      //   throw new Error("You are not authorized to perform this action");
      // }

      const coordinates = await generateCoordinates({ count: input.count, location: input.location });

      for (const { latitude, longitude } of coordinates) {
        const { data: geoLocation }: { data: GeoLocation } = await mapboxInstance.get(
          `/geocoding/v5/mapbox.places/${longitude},${latitude}.json`,
        );

        const currentLocation = `${input.location.longitude},${input.location.latitude}`;
        const targetLocation = `${longitude},${latitude}`;
        const { data: distance }: { data: Location } = await mapboxInstance.get(
          `/directions/v5/mapbox/driving/${currentLocation};${targetLocation}`,
          {
            params: {
              alternatives: false,
              overview: "full",
              geometries: "geojson",
              steps: false,
              notifications: "none",
            },
          },
        );

        const createOrder = await ctx.db.order.create({
          data: {
            address: geoLocation.features[0].place_name,
            distance: distance.routes[0].distance,
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
