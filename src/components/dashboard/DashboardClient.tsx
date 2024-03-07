"use client";

import { api } from "@/trpc/react";
import { Button } from "../ui/button";
import { useState } from "react";
import type { Coordinate, IOrder, RouteDetails } from "@/types";
import { toast } from "sonner";
import { knapsack } from "@/functions/knapsack";
import { Mapbox } from "./Mapbox";
import type { Session } from "next-auth";
import { DeliveriesTable } from "../deliveries/DeliveriesTable";
import { PlacedOrder } from "./PlacedOrder";
import { DeliveryPath } from "../deliveries/DeliveryPath";

type DashboardClientProps = {
  orders: IOrder[];
  session: Session;
};

export const DashboardClient = ({ orders, session }: DashboardClientProps) => {
  const [location, setLocation] = useState<Coordinate>({
    latitude: 14.662039,
    longitude: 121.058082,
  });
  const [selectedRoute, setSelectedRoute] = useState<RouteDetails | null>(null);

  const deliveries = api.delivery.get.useQuery();

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

  const deliveryMutation = api.delivery.create.useMutation();
  const takeOrder = async () => {
    const order = knapsack({ maxWeight: 15, orders });

    deliveryMutation.mutate(
      { orderIds: order.map((o) => o.id) },
      {
        onSuccess: () => {
          deliveries
            .refetch()
            .then(() => toast.success("Order taken"))
            .catch((error: Error) => toast.error(error.message));
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };

  const simulateDelivery = async () => {
    for (const order of selectedRoute!.orderRoute) {
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
    <main className="grid h-screen w-screen grid-cols-2 p-5">
      <div className="col-span-1 flex flex-col gap-5 p-3">
        <div className="flex items-center justify-between">
          <Button onClick={generate}>Generate Order</Button>
          <PlacedOrder orders={orders} />
          <Button onClick={takeOrder} disabled={!!deliveries.data?.length}>
            Take Order
          </Button>
          <DeliveryPath
            location={location}
            deliveries={deliveries.data as IOrder[]}
            session={session}
            setSelectRoute={setSelectedRoute}
          />
          <Button onClick={simulateDelivery} disabled={selectedRoute === null}>
            Simulate Delivery
          </Button>
        </div>

        {selectedRoute !== null ? <DeliveriesTable route={selectedRoute} /> : null}
      </div>
      {deliveries.data ? (
        <Mapbox
          location={location}
          session={session}
          className="z-50 col-span-1 h-full w-full rounded-full"
          route={selectedRoute}
        />
      ) : null}
    </main>
  );
};
