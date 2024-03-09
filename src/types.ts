import type { Item, Order, User } from "@prisma/client";

export interface IOrder extends Order {
  items: Item[];
  handler: User | null;
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

export type OrderRoute = {
  destinationId: string;
  order: IOrder | null;
  routeDescription: {
    distance: number;
    route: number[][];
  };
};

export type RouteDetails = {
  orderRoute: OrderRoute[];
  routeDistance: number;
};

export type ImageResponse = {
  results: {
    urls: {
      thumb: string;
    };
  }[];
};
