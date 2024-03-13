"use client";

import { DataContext } from "@/context/DataContext";
import { cn } from "@/lib/utils";
import type { Coordinate, IOrder, RouteDetails, RowSelection } from "@/types";
import { type Session } from "next-auth";
import { useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { OrderFooter } from "./OrderFooter";
import { OrderKnapsack } from "./OrderKnapsack";
import { OrderRoute } from "./OrderRoute";
import { api } from "@/trpc/react";

type OrderProps = {
  orders: IOrder[] | undefined;
  deliveries: IOrder[] | undefined;
  isFetching: boolean;
  session: Session;
  location: Coordinate;
};

export const Order = ({ orders, deliveries, isFetching, session, location }: OrderProps) => {
  const [page, setPage] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<RowSelection[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RouteDetails | null>(null);

  const { route, setRouteDetails } = useContext(DataContext);

  useEffect(() => setPage(!deliveries?.length ? 1 : 2), [deliveries]);

  const handleVisibilityEvent = (open: boolean) => {
    if (!open) {
      setPage(!deliveries?.length ? 1 : 2);
      setSelectedOrder([]);
      setSelectedRoute(null);
    }
  };

  const pendingDelivery = api.order.setDeliveryOrder.useMutation();

  /**
   * TODO
   * - [ ] Set selected order to "CONFIRMED" (using server mutation)
   * - [ ] add the selected order to the route using the setRoute function
   *       with updated route details
   */

  const onConfirm = async () => {
    console.log('Confirmed Route: ', route);
    setRouteDetails!(route);

    console.log('On Confirm Selected Order: ', selectedOrder);

    pendingDelivery.mutate(
      { orderIds: selectedOrder.map((order) => order.order.id)}, 
      {
        onSuccess: () => {
          toast.success("Order confirmed");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );

    return 'success';
  };

  return (
    <Dialog onOpenChange={handleVisibilityEvent}>
      <DialogTrigger asChild>
        <Button disabled={isFetching}>Order</Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-screen-lg">
        <div className="pointer-events-none flex items-center justify-between whitespace-nowrap px-10 py-5">
          <div className="flex items-center justify-center">
            <Badge className={page > 0 ? "bg-green-500" : ""}>Order</Badge>
          </div>
          <div className="flex w-full items-center justify-center">
            <Separator className={cn(page > 1 ? "bg-green-500" : "")} />
          </div>
          <div className="flex items-center justify-center">
            <Badge className={page > 1 ? "bg-green-500" : ""}>Route</Badge>
          </div>
          <div className="flex w-full items-center justify-center">
            <Separator className={cn(page > 2 ? "bg-green-500" : "")} />
          </div>
          <div className="flex items-center justify-center">
            <Badge className={page > 2 ? "bg-green-500" : ""}>Confirmation</Badge>
          </div>
        </div>

        {page === 1 && orders ? (
          <OrderKnapsack
            maxWeight={session.user.maxWeight}
            orders={orders}
            selectedOrder={selectedOrder}
            setSelectedOrder={setSelectedOrder}
          />
        ) : null}

        {page === 2 ? (
          <OrderRoute
            location={location}
            session={session}
            selectedOrder={selectedOrder.map((order) => order.order)}
            selectedRoute={selectedRoute}
            setSelectedRoute={setSelectedRoute}
          />
        ) : null}

        <OrderFooter page={page} hasLength={!deliveries?.length} setPage={setPage} onConfirm={onConfirm} />
      </DialogContent>
    </Dialog>
  );
};
