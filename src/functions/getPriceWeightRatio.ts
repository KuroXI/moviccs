import { type Item } from "@prisma/client";

export const getPriceWeightRatio = (items: Item[]) => {
  return items.reduce((acc, item) => acc + (item.amount * item.price) / (item.amount * item.weight), 0);
};
