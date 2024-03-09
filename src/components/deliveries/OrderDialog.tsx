import { ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { type IOrder } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Separator } from "../ui/separator";
import Image from "next/image";

type OrderDialogProps = {
  order: IOrder;
};

export const OrderDialog = ({ order }: OrderDialogProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <ChevronDown size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <div className="flex flex-col gap-5">
          <h1>Order ID: {order.orderId}</h1>
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={order.handler!.image!} alt={order.handler!.id} />
              <AvatarFallback>{order.handler!.name?.charAt(0).toUpperCase() ?? "R"}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h1 className="text-lg text-foreground">{order.handler?.name}</h1>
              <h1 className="text-base text-muted-foreground">{order.handler?.email}</h1>
            </div>
          </div>
          <Separator />
          <div>
            <h1 className="text-base font-bold">Tracking Number</h1>
            <h1 className="text-lg text-muted-foreground">{order.id}</h1>
          </div>
          <div>
            <h1 className="text-base font-bold">Products</h1>
            <div className="flex flex-col gap-1">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-start gap-2">
                  <Image
                    src={item.image}
                    alt={item.item}
                    width={100}
                    height={50}
                    className="max-h-12 max-w-24 rounded-md object-fill"
                  />
                  <div className="flex flex-col">
                    <h1 className="text-sm text-muted-foreground">
                      {item.item} x{item.amount}
                    </h1>
                    <h1 className="text-sm text-muted-foreground">{item.weight * item.amount}</h1>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* <div className="flex flex-col gap-1">
            <h1 className="text-lg font-bold md:text-base">Carrier</h1>
          </div> */}
        </div>
      </DialogContent>
    </Dialog>
  );
};
