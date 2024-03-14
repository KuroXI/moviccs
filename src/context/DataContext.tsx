"use client"

import { generateDeliveryRoute } from "@/functions/generateDeliveryRoute";
import { api } from "@/trpc/react";
import type { AvailableOrder, Coordinate, IOrder, OrderRoute,  RouteDetails } from "@/types";
import { type Dispatch, type ReactNode, type SetStateAction, createContext, useState } from "react";

export interface DataInterface {
  route: RouteDetails | undefined;
  routeDetails: RouteDetails | undefined;
  orders: AvailableOrder | undefined;
  location: Coordinate;
  setRoute: Dispatch<SetStateAction<RouteDetails | undefined>>;
  setRouteDetails: Dispatch<SetStateAction<RouteDetails | undefined>>;
  setLocation: Dispatch<SetStateAction<Coordinate>>;
  handleUpdate: () => void;
}

export const DataContext = createContext<Partial<DataInterface>>({});

type UserProviderProps = {
    children: ReactNode;
};

const DataProvider = ({ children }: UserProviderProps) => {
  const [route, setRoute] = useState<RouteDetails | undefined>(undefined);
  const [routeDetails, setRouteDetails] = useState<RouteDetails | undefined>(undefined);
  const [location, setLocation] = useState<Coordinate>({
    latitude: 14.662039,
    longitude: 121.058082,
  });

  const orders = api.order.getAvailableOrder.useQuery();
  const pendingDeliveries = api.order.getPendingDeliveries.useQuery();

  const handleUpdate = () => {
    if (routeDetails === undefined) return;

    pendingDeliveries.refetch()
      .then((pending) => {
        const newOrderRoute : OrderRoute[] = [];

        routeDetails?.orderRoute.forEach((route) => {
          newOrderRoute.push({
            ...route,
            order: pending.data?.orders.find((order) => order.id === route.destinationId) ?? null
          })
        })

        setRoute({
          orderRoute: newOrderRoute.filter(route => route.order?.status === 'DISPATCHED'),
          routeDistance: routeDetails?.routeDistance ?? 0
        });

        setRouteDetails({
          routeDistance: routeDetails?.routeDistance ?? 0,
          orderRoute: newOrderRoute
        });
      })
      .catch((error) => {
        console.error(error);
      })
  }

  if (Boolean(pendingDeliveries.data) && routeDetails === undefined) {
    generateDeliveryRoute(location, pendingDeliveries.data?.orders as IOrder[])
      .then((route) => {
        setRouteDetails(route[0])
      })
      .catch((error) => {
        console.error(error)
      })
  }

  return (
    <DataContext.Provider
      value={{
        orders: orders,
        route,
        setRoute,
        routeDetails,
        setRouteDetails,
        location,
        setLocation,
        handleUpdate
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;