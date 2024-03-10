import { type IOrder } from "@/types";
import { getPriceWeightRatio } from "./getPriceWeightRatio";

type KnapsackInput = {
  maxWeight: number;
  orders: IOrder[];
};

/**
 * * This is a knapsack with greedy algorithm that will give us the best value for the weight
 *
 * Example:
 * Item A has 60 value and 10 weight (ratio = 6 value/weight)
 * Item B has 50 value and 5 weight (ratio = 10 value/weight)
 *
 * Even though Item A has higher absolute value, Item B gives us more value per unit of weight.
 */
export const knapsack = ({ maxWeight, orders }: KnapsackInput): IOrder[] => {
  orders.sort((a, b) => getPriceWeightRatio(b.items) - getPriceWeightRatio(a.items));

  let totalWeight = 0;
  const sack = [];

  for (const order of orders) {
    if (totalWeight === maxWeight) break;

    const itemTotalWeight = order.items.reduce((acc, item) => acc + item.weight * item.amount, 0);
    if (itemTotalWeight + totalWeight <= maxWeight) {
      sack.push(order);
      totalWeight += itemTotalWeight;
    }
  }

  return sack;
};
