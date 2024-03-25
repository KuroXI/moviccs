import { calculateTotalWeight } from "@/lib/utils";
import type { knapsackOutput, RowSelection } from "@/types";
import { getPriceWeightRatio } from "./getPriceWeightRatio";

type KnapsackInput = {
  maxWeight: number;
  orders: RowSelection[];
};

export const knapsack = ({ maxWeight, orders } : KnapsackInput )  => {
  let currentKnapsack : knapsackOutput = {
    orders: [],
    totalWeight: 0,
    ratio: 0,
  }

  const totalSubsets = Math.pow(2, orders.length);
  const subsets: knapsackOutput[] = [];

  for (let i = 0; i < totalSubsets; i++) {
    const subset: RowSelection[] = [];
    let subsetWeight = 0;
    let ratio = 0;
    let temp = i;

    for (const order of orders) {
      if (temp % 2 === 1 && Boolean(order)) {
        subset.push(order);
        subsetWeight += calculateTotalWeight(order.order.items);
        ratio += getPriceWeightRatio(order.order.items);
      }

      temp = Math.floor(temp / 2);
    }

    subsets.push({
      orders: subset,
      totalWeight: subsetWeight,
      ratio: ratio,
    });

    if (subsetWeight <= maxWeight && ratio > currentKnapsack.ratio) {
      currentKnapsack = {
        orders: subset,
        totalWeight: subsetWeight,
        ratio: ratio,
      };
    }
  }

  console.log('Knapsack Subsets: ', subsets);
  console.log("Current Knapsack: ", currentKnapsack);
  console.log("Subset Weight: ", currentKnapsack.totalWeight);
  console.log("Subset Ratio: ", currentKnapsack.ratio);

  return currentKnapsack.orders;
}