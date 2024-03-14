"use client";

import { DataContext } from "@/context/DataContext";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import type { Coordinate, IOrder } from "@/types";
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

type OrderProps = {
  deliveries: IOrder[] | undefined;
  session: Session;
  location: Coordinate;
};

export const Order = ({ deliveries, session, location }: OrderProps) => {
  const [page, setPage] = useState(1);

  const { orders, handleUpdate, selectedOrder, setSelectedOrder } = useContext(DataContext);

  useEffect(() => {
    if (deliveries?.length) {
      setSelectedOrder!(deliveries.map((order) => ({ order })));
    }

    setPage(!deliveries?.length ? 1 : 2);
  }, [deliveries, setSelectedOrder]);

  const handleVisibilityEvent = (open: boolean) => {
    if (!open) {
      setPage(!deliveries?.length ? 1 : 2);
      setSelectedOrder!([]);
    }
  };

  const pendingDelivery = api.order.setDeliveryOrder.useMutation();

  const onConfirm = async () => {
    pendingDelivery.mutate(
      { orderIds: selectedOrder!.map((order) => order.order.id) },
      {
        onSuccess: () => {
          handleUpdate!();
          toast.success("Order confirmed");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      },
    );
  };

  return (
    <Dialog onOpenChange={handleVisibilityEvent}>
      <DialogTrigger asChild>
        <Button disabled={orders?.isFetching}>Order</Button>
      </DialogTrigger>

      <DialogContent className="w-full max-w-screen-lg">
        <div className="pointer-events-none flex items-center justify-between whitespace-nowrap p-10">
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

        {page === 1 && orders ? <OrderKnapsack maxWeight={session.user.maxWeight} /> : null}

        {page === 2 ? <OrderRoute location={location} session={session} /> : null}

        <OrderFooter page={page} hasLength={!deliveries?.length} setPage={setPage} onConfirm={onConfirm} />
      </DialogContent>
    </Dialog>
  );
};
