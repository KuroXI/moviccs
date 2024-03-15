"use client";

import { DataContext } from "@/context/DataContext";
import { api } from "@/trpc/react";
import { PopoverClose } from "@radix-ui/react-popover";
import type { Session } from "next-auth";
import { useContext, useState } from "react";
import { toast } from "sonner";
import { DeliveriesTable } from "../deliveries/DeliveriesTable";
import { Order } from "../order/Order";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Mapbox } from "./Mapbox";

type DashboardClientProps = {
  session: Session;
};

export const DashboardClient = ({ session }: DashboardClientProps) => {
  const { route, location } = useContext(DataContext);

  const deliveries = api.order.getPendingDeliveries.useQuery();

  const orderMutation = api.order.create.useMutation();
  const generate = () => {
    orderMutation.mutate(
      { count: 20 },
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
      <Mapbox
        location={location!}
        session={session}
        className="z-10 row-span-1 h-full min-h-[50vh] w-full rounded-full"
        orderRoute={route?.orderRoute}
      />

      <div className="row-span-1 flex flex-col gap-5 p-3">
        <div className="flex items-center justify-between">
          <Button onClick={generate}>Generate Order</Button>
          <Order deliveries={deliveries.data?.orders} session={session} location={location!} />
          <Popover>
            <PopoverTrigger asChild>
              <Button>Set Max Weight</Button>
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
        </div>

        <DeliveriesTable />
      </div>
    </main>
  );
};
