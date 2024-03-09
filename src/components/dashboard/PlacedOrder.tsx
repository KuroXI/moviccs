import { type IOrder } from "@/types";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";

type PlacedOrderProps = {
  orders: IOrder[];
};

export const PlacedOrder = ({ orders }: PlacedOrderProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>View placed order</Button>
      </DialogTrigger>
      <DialogContent className="max-h-fit max-w-5xl">
        <DialogHeader>
          <DialogTitle>Placed Order</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-96">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Address</TableHead>
                <TableHead>Distance</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Total Weight</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="truncate">{order.address}</TableCell>
                  <TableCell>{order.distance}</TableCell>
                  <TableCell>{order.items.reduce((acc, item) => (acc += item.price), 0)}</TableCell>
                  <TableCell>{order.items.reduce((acc, item) => (acc += item.weight * item.amount), 0)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
