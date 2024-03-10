import { type RouteDetails } from "@/types";

export const calculateTotalWeight = (route: RouteDetails) => {
  return route?.orderRoute
    .filter((order) => order.order !== null)
    .reduce((acc, order) => {
      return (
        acc +
        order.order!.items.reduce((acc, item) => {
          return acc + item.weight * item.amount;
        }, 0)
      );
    }, 0);
};
