"use client";

import { DataContext } from "@/context/DataContext";
import { api } from "@/trpc/react";
import type { Coordinate } from "@/types";
import type { Session } from "next-auth";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { DeliveriesTable } from "../deliveries/DeliveriesTable";
import { Order } from "../order/Order";
import { Button } from "../ui/button";
import { Mapbox } from "./Mapbox";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";

type DashboardClientProps = {
  session: Session;
};

export const DashboardClient = ({ session }: DashboardClientProps) => {
  const [location, setLocation] = useState<Coordinate>({
    latitude: 14.662039,
    longitude: 121.058082,
  });

  const { route, routeDetails } = useContext(DataContext);

  const orders = api.order.getAvailableOrder.useQuery();
  const deliveries = api.order.getDeliveryOrder.useQuery();

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

  const [weight, setWeight] = useState(session.user.maxWeight);
  const userMaxWeightMutation = api.user.setMaxWeight.useMutation();
  const mutateWeight = () => {
    userMaxWeightMutation.mutate(
      { weight },
      {
        onSuccess: () => {
          toast.success("Max weight updated");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <main className="grid h-full w-full grid-rows-2 p-5">
      {deliveries.data ? (
        <Mapbox
          location={location}
          session={session}
          className="z-10 row-span-1 h-full min-h-96 w-full rounded-full"
          orderRoute={routeDetails?.orderRoute}
        />
      ) : null}

      <div className="row-span-1 flex flex-col gap-5 p-3">
        <div className="flex items-center justify-between">
          <Button onClick={generate}>Generate Order</Button>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Set Max Weight</Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Max weight</h4>
                  <p className="text-sm text-muted-foreground">Set the maximum weight that you can carry.</p>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Input type="number" value={weight} onChange={(e) => setWeight(parseInt(e.target.value))} />
                  <PopoverClose asChild>
                    <Button onClick={mutateWeight}>Set Weight</Button>
                  </PopoverClose>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Order
            orders={orders.data}
            deliveries={deliveries.data}
            isFetching={!(deliveries.isFetching === false && orders.isFetching === false)}
            session={session}
            location={location}
          />
          <Button onClick={simulateDelivery} disabled={route === null}>
            Simulate Delivery
          </Button>
        </div>

        <DeliveriesTable route={routeDetails} />
      </div>
    </main>
  );
};
