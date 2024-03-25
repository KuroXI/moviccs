import type { RowSelection } from "@/types";
import { getPriceWeightRatio } from "./getPriceWeightRatio";
import { calculateTotalWeight } from "@/lib/utils";
import { selectionSort } from "./selectionSort";

type KnapsackInput = {
  maxWeight: number;
  orders: RowSelection[];
};

type knapsackOutput = {
  orders: RowSelection[];
  totalWeight: number;
  ratio: number;
};

export const knapsackOriginal = ({ maxWeight, orders }: KnapsackInput) => {
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

export const knapsack = ({ maxWeight, orders } : KnapsackInput )  => {
  // Limit the number of orders to 10
  const limitedList = orders.slice(0, 10);

  let currentKnapsack : knapsackOutput = {
    orders: [],
    totalWeight: 0,
    ratio: 0,
  }

  const totalSubsets = Math.pow(2, limitedList.length);
  // All possible subsets NOT USED!.
  const subsets: knapsackOutput[] = [];

  for (let i = 0; i < totalSubsets; i++) {
    const subset: RowSelection[] = [];
    let subsetWeight = 0;
    let ratio = 0;
    let temp = i;

    for (const order of limitedList) {
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

  console.log("Current Knapsack: ", currentKnapsack);
  console.log("Subset Weight: ", currentKnapsack.totalWeight);
  console.log("Subset Ratio: ", currentKnapsack.ratio);

  return currentKnapsack.orders;
}