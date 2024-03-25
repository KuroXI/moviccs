import type { Item, Order, User } from "@prisma/client";
import type { TRPCClientErrorLike } from "@trpc/client";
import type { UseTRPCQueryResult } from "@trpc/react-query/shared";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "./server/api/root";

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

export type RowSelection = {
  index?: number;
  order: IOrder;
};

export type HighlightedTextAccumulator = {
  currentIndex: number;
  splittedAddress: string[];
};

export type AvailableOrder = UseTRPCQueryResult<
  inferRouterOutputs<AppRouter>["order"]["getAvailableOrder"],
  TRPCClientErrorLike<AppRouter>
>;

export type HistoryDeliveries = {
  orderId: number;
  id: string;
  address: string;
  updatedAt: Date;
}[];

export type knapsackOutput = {
  orders: RowSelection[];
  totalWeight: number;
  ratio: number;
};