"use client";

import { api } from "@/trpc/react";
import { Button } from "../ui/button";
import { useState } from "react";
import { type Coordinate } from "@/types";
import { toast } from "sonner";
import { type Order } from "@prisma/client";

type HomeClientProps = {
  orders: Order[];
};

export const HomeClient = ({ orders } : HomeClientProps) => {
  const [location] = useState<Coordinate>({
    latitude: 14.662039,
    longitude: 121.058082,
  });

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

  return (
    <div>
      <Button onClick={generate}>Generate Order</Button>
      <ul>
        {orders.map((order) => (
          <li key={order.id}>{order.address}</li>
        ))}
      </ul>
    </div>
  );
};
