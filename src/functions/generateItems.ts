import { imageSearchInstance } from "@/lib/axios";
import { type ImageResponse } from "@/types";
import { faker } from "@faker-js/faker";

type GenerateItemsInput = {
  count: number;
  orderById: string;
};

export const generateItems = async ({ count, orderById }: GenerateItemsInput) => {
  const getImage = async (query: string) => {
    const { data }: { data: ImageResponse } = await imageSearchInstance.get("/photos", {
      params: { query },
    });
    return data.results[0]!.urls.thumb;
  };

  const generateItem = async () => {
    const data = {
      item: faker.commerce.product(),
      price: parseInt(faker.commerce.price()),
      weight: faker.number.int({ min: 1, max: 3 }),
      amount: faker.number.int({ min: 1, max: 2 }),
      orderById,
    };

    const image = await Promise.resolve(getImage(data.item));
    return {
      ...data,
      image,
    };
  };

  return Promise.all(faker.helpers.multiple(generateItem, { count }));
};
