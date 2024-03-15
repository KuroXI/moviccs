"use client";

import { generateDeliveryRoute } from "@/functions/generateDeliveryRoute";
import { warehouseCoordinate } from "@/lib/constant";
import { api } from "@/trpc/react";
import type { AvailableOrder, Coordinate, IOrder, OrderRoute, RouteDetails, RowSelection } from "@/types";
import { createContext, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";
import { toast } from "sonner";

export interface DataInterface {
  route: RouteDetails | undefined;
  routeDetails: RouteDetails | undefined;
  orders: AvailableOrder | undefined;
  location: Coordinate;
  setRoute: Dispatch<SetStateAction<RouteDetails | undefined>>;
  setRouteDetails: Dispatch<SetStateAction<RouteDetails | undefined>>;
  setLocation: Dispatch<SetStateAction<Coordinate>>;
  selectedOrder: RowSelection[];
  setSelectedOrder: Dispatch<SetStateAction<RowSelection[]>>;
  handleUpdate: () => void;
}

export const DataContext = createContext<Partial<DataInterface>>({});

const DataProvider = ({ children }: { children: ReactNode }) => {
  const [selectedOrder, setSelectedOrder] = useState<RowSelection[]>([]);
  const [route, setRoute] = useState<RouteDetails | undefined>(undefined);
  const [routeDetails, setRouteDetails] = useState<RouteDetails | undefined>(undefined);
  const [location, setLocation] = useState<Coordinate>(warehouseCoordinate);

  const orders = api.order.getAvailableOrder.useQuery();
  const pendingDeliveries = api.order.getPendingDeliveries.useQuery();

  const deletePendingMutation = api.order.deletePendingDelivery.useMutation({
    onSuccess: () => {
      toast.success("All orders have been delivered. 🥳");
      handleUpdate();
      setLocation(warehouseCoordinate);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleUpdate = () => {
    if (routeDetails === undefined) return;

    pendingDeliveries
      .refetch()
      .then((pending) => {
        const newOrderRoute: OrderRoute[] = [];

        for (const route of routeDetails.orderRoute) {
          newOrderRoute.push({
            ...route,
            order: pending.data?.orders.find((order) => order.id === route.destinationId) ?? null,
          });
        }

        setRoute({
          orderRoute: newOrderRoute.filter((route) => route.order?.status === "DISPATCHED"),
          routeDistance: routeDetails?.routeDistance ?? 0,
        });

        setRouteDetails({
          routeDistance: routeDetails?.routeDistance ?? 0,
          orderRoute: newOrderRoute,
        });

        const filteredOrder = newOrderRoute.filter((route) => route.order !== null);
        const completedOrder = filteredOrder.filter((order) => order.order?.status === "DELIVERED");

        if (filteredOrder.length > 0 && completedOrder?.length === filteredOrder?.length) {
          deletePendingMutation.mutate();
        }
      })
      .catch((error: Error) => toast.error(error.message));
  };

  if (Boolean(pendingDeliveries.data) && routeDetails === undefined) {
    generateDeliveryRoute(location, pendingDeliveries.data?.orders as IOrder[])
      .then((route) => {
        setRouteDetails(route[0]);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <DataContext.Provider
      value={{
        orders,
        route,
        setRoute,
        routeDetails,
        setRouteDetails,
        location,
        setLocation,
        handleUpdate,
        selectedOrder,
        setSelectedOrder,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
