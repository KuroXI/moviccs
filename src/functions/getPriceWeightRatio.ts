import { type Item } from "@prisma/client";

export const getPriceWeightRatio = (items: Item[]) => {
  return items.reduce((acc, item) => {
    const totalWeight = item.amount * item.weight;
    const totalValue = item.amount * item.price;
    return acc + totalValue / totalWeight;
  }, 0);
};
