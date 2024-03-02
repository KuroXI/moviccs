import { createTRPCRouter } from "@/server/api/trpc";
import { orderRouter } from "./routers/order";
import { deliveryRouter } from "./routers/delivery";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  order: orderRouter,
  delivery: deliveryRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
