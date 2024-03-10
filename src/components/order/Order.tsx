"use client";

import { Dialog, DialogClose, DialogContent, DialogFooter, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { type Dispatch, useState, useEffect, type SetStateAction } from "react";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { cn } from "@/lib/utils";
import { OrderKnapsack } from "./OrderKnapsack";
import type { Coordinate, IOrder, RouteDetails } from "@/types";
import { toast } from "sonner";
import { OrderRoute } from "./OrderRoute";
import { type Session } from "next-auth";

type OrderProps = {
  orders: IOrder[] | undefined;
  deliveries: IOrder[] | undefined;
  isFetching: boolean;
  session: Session;
  location: Coordinate;
  setRoute: Dispatch<SetStateAction<RouteDetails | null>>;
};

export const Order = ({ orders, deliveries, isFetching, session, location, setRoute }: OrderProps) => {
  const [page, setPage] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState<IOrder[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RouteDetails | null>(null);

  useEffect(() => setPage(!deliveries?.length ? 1 : 2), [deliveries]);

  const handleVisibilityEvent = (open: boolean) => {
    if (!open) {
      setPage(!deliveries?.length ? 1 : 2);
      setSelectedOrder([]);
      setSelectedRoute(null);
    }
  };

  /**
   * TODO
   * - [ ] Set selected order to "CONFIRMED" (using server mutation)
   * - [ ] add the selected order to the route using the setRoute function
   *       with updated route details
   */
  const onConfirm = async () => {
    setRoute(selectedRoute);

    return toast.success("Order confirmed");
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
          <OrderKnapsack orders={orders} selectedOrder={selectedOrder} setSelectedOrder={setSelectedOrder} />
        ) : null}
        
        {page === 2 ? (
          <OrderRoute
            location={location}
            session={session}
            selectedOrder={selectedOrder}
            selectedRoute={selectedRoute}
            setSelectedRoute={setSelectedRoute}
          />
        ) : null}

        <DialogFooter>
          <Button
            size="sm"
            variant="ghost"
            disabled={page <= (!deliveries?.length ? 1 : 2)}
            onClick={() => setPage(page - 1)}
          >
            Back
          </Button>
          {page == 3 ? (
            <DialogClose>
              <Button size="sm" onClick={onConfirm}>
                Confirm
              </Button>
            </DialogClose>
          ) : (
            <Button size="sm" onClick={() => setPage(page + 1)}>
              Next
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
