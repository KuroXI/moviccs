import { type IOrder } from "@/types";

type KnapsackInput = {
  maxWeight: number;
  orders: IOrder[];
};

export const knapsack = ({ maxWeight, orders }: KnapsackInput): IOrder[] => {
  const processedOrder = [];

  let totalWeight = 0;
  for (const order of orders) {
    const itemTotalWeight = order.items.reduce((acc, item) => acc + item.weight, 0);
    if (itemTotalWeight + totalWeight <= maxWeight) {
      processedOrder.push(order);
      totalWeight += itemTotalWeight;
    }
  }

  return processedOrder;
};
