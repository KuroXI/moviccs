"use client";

import { api } from "@/trpc/react";
import { Button } from "../ui/button";
import { useState } from "react";
import type { Coordinate, IOrder } from "@/types";
import { toast } from "sonner";
import { knapsack } from "@/functions/knapsack";
import { Mapbox } from "./Mapbox";

type DashboardClientProps = {
  orders: IOrder[];
};

export const DashboardClient = ({ orders }: DashboardClientProps) => {
  const [location] = useState<Coordinate>({
    latitude: 14.662039,
    longitude: 121.058082,
  });

  const deliveries = api.delivery.get.useQuery();

  const orderMutation = api.order.create.useMutation();
  const generate = () => {
    orderMutation.mutate(
      {
        count: 50,
        location,
      },
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
  const takeOrder = () => {
    const order = knapsack({ maxWeight: 50, orders });

    deliveryMutation.mutate(
      { orderIds: order.map((o) => o.id) },
      {
        onSuccess: () => {
          return toast.success("Order taken");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <main className="flex h-screen w-screen p-5">
      <div className="flex flex-col gap-5 p-3">
        <div className="flex items-center justify-between">
          <Button onClick={generate}>Generate Order</Button>
          <Button onClick={takeOrder}>Take Order</Button>
        </div>

        {deliveries.data ? (
          <ul>
            {deliveries.data.map((delivery) => (
              <li key={delivery.id}>{delivery.address}</li>
            ))}
          </ul>
        ) : null}
      </div>
      {deliveries.data ? (
        <Mapbox deliveries={deliveries.data as IOrder[]} location={location} className="z-50 h-full w-full" />
      ) : null}
    </main>
  );
};
