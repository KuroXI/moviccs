"use client";

import { api } from "@/trpc/react";
import { Button } from "../ui/button";
import { useState } from "react";
import type { Coordinate, IOrder, RouteDetails } from "@/types";
import { toast } from "sonner";
import { Mapbox } from "./Mapbox";
import type { Session } from "next-auth";
import { DeliveriesTable } from "../deliveries/DeliveriesTable";
import { Order } from "../order/Order";

type DashboardClientProps = {
  session: Session;
};

export const DashboardClient = ({ session }: DashboardClientProps) => {
  const [location, setLocation] = useState<Coordinate>({
    latitude: 14.662039,
    longitude: 121.058082,
  });
  const [route, setRoute] = useState<RouteDetails | null>(null);

  const orders = api.order.getAvailableOrder.useQuery();
  const deliveries = api.order.getDeliveryOrder.useQuery();
  const pendingDeliveries = api.order.getPendingDeliveries.useQuery();

  const orderMutation = api.order.create.useMutation();
  const generate = () => {
    orderMutation.mutate(
      { count: 20, location },
      {
        onSuccess: () => {
          toast.success("Order generated");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };

  const simulateDelivery = async () => {
    for (const order of route!.orderRoute) {
      for (const route of order.routeDescription.route) {
        setLocation({
          latitude: route[1]!,
          longitude: route[0]!,
        });

        /**
         * 800 - More realistic simulation
         * 200  - Faster simulation (for presentation purposes)
         * 100  - Fastest simulation (for testing purposes)
         */
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  };

  return (
    <main className="grid h-full w-full grid-rows-2 p-5">
      {deliveries.data ? (
        <Mapbox
          location={location}
          session={session}
          className="z-10 row-span-1 h-full min-h-96 w-full rounded-full"
          orderRoute={route?.orderRoute}
        />
      ) : null}
      <div className="row-span-1 flex flex-col gap-5 p-3">
        <div className="flex items-center justify-between">
          <Button onClick={generate}>Generate Order</Button>
          <Order
            orders={orders.data}
            deliveries={deliveries.data}
            isFetching={!(deliveries.isFetching === false && orders.isFetching === false)}
            session={session}
            location={location}
            setRoute={setRoute}
          />
          <Button onClick={simulateDelivery} disabled={route === null}>
            Simulate Delivery
          </Button>
        </div>

        <DeliveriesTable 
          orders={pendingDeliveries.data?.orders as IOrder[]} 
        />
      </div>
    </main>
  );
};