import type { RowSelection } from "@/types";
import { getPriceWeightRatio } from "./getPriceWeightRatio";
import { calculateTotalWeight } from "@/lib/utils";
import { selectionSort } from "./selectionSort";

type KnapsackInput = {
  maxWeight: number;
  orders: RowSelection[];
};

export const knapsack = ({ maxWeight, orders }: KnapsackInput) => {
  orders = selectionSort(orders, (a, b) => getPriceWeightRatio(a.order.items) - getPriceWeightRatio(b.order.items));

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
