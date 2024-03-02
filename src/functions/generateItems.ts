import { faker } from "@faker-js/faker";

type GenerateItemsInput = {
  count: number;
  orderById: string;
};

export const generateItems = ({ count, orderById }: GenerateItemsInput) => {
  const generateItem = () => {
    return {
      item: faker.commerce.product(),
      price: parseInt(faker.commerce.price()),
      weight: faker.number.int({ min: 1, max: 5 }),
      amount: faker.number.int({ min: 1, max: 5 }),
      orderById,
    };
  };

  return faker.helpers.multiple(generateItem, { count });
};
