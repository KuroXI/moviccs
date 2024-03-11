import type { RowSelection } from "@/types";
import { getPriceWeightRatio } from "./getPriceWeightRatio";
import { calculateTotalWeight } from "@/lib/utils";

type KnapsackInput = {
  maxWeight: number;
  orders: RowSelection[];
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
export const knapsack = ({ maxWeight, orders }: KnapsackInput) => {
  orders.sort((a, b) => getPriceWeightRatio(b.order.items) - getPriceWeightRatio(a.order.items));

  let totalWeight = 0;
  const sack = [];

  for (const order of orders) {
    if (totalWeight === maxWeight) break;

    const itemTotalWeight = calculateTotalWeight(order.order.items);
    if (itemTotalWeight + totalWeight <= maxWeight) {
      sack.push(order);
      totalWeight += itemTotalWeight;
    }
  }

  return sack;
};
