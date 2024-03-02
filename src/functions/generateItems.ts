import type { Item } from "@/types";
import { faker } from "@faker-js/faker";

type GenerateItemsInput = {
  count: number;
};

export const generateItems = ({ count }: GenerateItemsInput) => {
  const generateItem = (): Item => {
    return {
      item: faker.commerce.product(),
      price: parseInt(faker.commerce.price()),
      weight: faker.number.int({ min: 1, max: 5 }),
      amount: faker.number.int({ min: 1, max: 5 }),
    };
  };

  return faker.helpers.multiple(generateItem, { count });
};
