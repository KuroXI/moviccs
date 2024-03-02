import type { Item, Order } from "@prisma/client";

export interface IOrder extends Order {
  items: Item[];
}

export type Coordinate = {
  latitude: number;
  longitude: number;
};

export interface GeoJSON extends IOrder {
  geojson: {
    coordinates: number[][];
  };
}

export type GeoLocation = {
  features: [
    {
      place_name: string;
    },
  ];
};

export type Location = {
  routes: [
    {
      distance: number;
      geometry: {
        coordinates: number[][];
      };
    },
  ];
};
