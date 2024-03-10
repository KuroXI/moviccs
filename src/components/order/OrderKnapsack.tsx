"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { ChevronUp } from "lucide-react";
import { knapsack } from "@/functions/knapsack";
import { toast } from "sonner";
import type { IOrder } from "@/types";
import { type Dispatch, type SetStateAction } from "react";
import { getPriceWeightRatio } from "@/functions/getPriceWeightRatio";

type OrderKnapsackProps = {
  orders: IOrder[];
  selectedOrder: IOrder[];
  setSelectedOrder: Dispatch<SetStateAction<IOrder[]>>;
};

export const OrderKnapsack = ({ orders, selectedOrder, setSelectedOrder }: OrderKnapsackProps) => {
  const takeOrder = async () => {
    const order = knapsack({ maxWeight: 15, orders });

    if (order.length === 0) {
      toast.error("No orders can be taken");
      return;
    }

    setSelectedOrder(order);
  };

  return (
    <>
      {selectedOrder.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Address</TableHead>
              <TableHead>Distance</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Total Weight</TableHead>
              <TableHead>Ratio</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedOrder.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="line-clamp-2">{order.address}</TableCell>
                <TableCell>{order.distance}</TableCell>
                <TableCell>{order.items.reduce((acc, item) => (acc += item.price * item.amount), 0)}</TableCell>
                <TableCell>{order.items.reduce((acc, item) => (acc += item.weight * item.amount), 0)}</TableCell>
                <TableCell>{getPriceWeightRatio(order.items).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : null}

      <div className="flex w-full items-center justify-center">
        <Button variant="outline" size="sm" onClick={takeOrder} disabled={Boolean(selectedOrder.length)}>
          <ChevronUp /> Take Order
        </Button>
      </div>

      <ScrollArea className="max-h-96">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Address</TableHead>
              <TableHead>Distance</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="truncate">Total Weight</TableHead>
              <TableHead>Ratio</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders ? (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="line-clamp-2">{order.address}</TableCell>
                  <TableCell>{order.distance}</TableCell>
                  <TableCell>{order.items.reduce((acc, item) => (acc += item.price * item.amount), 0)}</TableCell>
                  <TableCell>{order.items.reduce((acc, item) => (acc += item.weight * item.amount), 0)}</TableCell>
                  <TableCell>{getPriceWeightRatio(order.items).toFixed(2)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  No orders available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </>
  );
};
