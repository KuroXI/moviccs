import { ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "../ui/dialog";
import { type IOrder } from "@/types";
import Image from "next/image";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { formatCurrency } from "@/lib/utils";

type OrderDialogProps = {
  order: IOrder;
};

export const OrderDialog = ({ order }: OrderDialogProps) => {
  const openImage = (src: string) => {
    const url = new URL(src);

    url.searchParams.delete("w");
    url.searchParams.delete("h");
    url.searchParams.delete("q");

    window.open(url, "_blank");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <ChevronDown size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-screen-lg">
        <div className="flex flex-col gap-10">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-bold">Order ID: #{order.orderId}</h1>
              <h1 className="text-sm">{order.createdAt.toDateString()}</h1>
              <Badge className="mt-3" variant="secondary">
                {order.status}
              </Badge>
            </div>

            <DialogClose asChild>
              <Button>Mark as delivered</Button>
            </DialogClose>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="col-span-1">
              <h1 className="text-sm font-bold">Tracking Number</h1>
              <h1 className="font-light">{order.id}</h1>
            </div>
            <div>
              <h1 className="text-sm font-bold">Address</h1>
              <h1 className="font-light">{order.address}</h1>
            </div>
          </div>
          <div>
            <h1 className="text-base font-bold">Products</h1>
            <div className="flex flex-col gap-1">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Unit Price</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead className="text-end">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="flex items-center gap-2">
                        <Image
                          onClick={() => openImage(item.image)}
                          src={item.image}
                          alt={item.item}
                          width={30}
                          height={75}
                          className="max-h-24 max-w-12 rounded-md"
                        />
                        {item.item}
                      </TableCell>
                      <TableCell>{item.weight} kg</TableCell>
                      <TableCell>{formatCurrency(item.price)}</TableCell>
                      <TableCell>{item.amount}</TableCell>
                      <TableCell className="text-end">{formatCurrency(item.amount * item.price)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          <div className="flex flex-col gap-5 text-end">
            <div>
              <h1 className="text-base font-medium">Total</h1>
              <h1 className="text-lg font-bold">
                {formatCurrency(order.items.reduce((acc, item) => (acc += item.price * item.amount), 0))}
              </h1>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
