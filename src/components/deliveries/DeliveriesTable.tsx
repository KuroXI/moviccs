import type { IOrder } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { OrderDialog } from "./OrderDialog";
import { formatMeter } from "@/lib/utils";

type DeliveriesTableProps = {
  orders: IOrder[] | undefined;
};

export const DeliveriesTable = ({ orders }: DeliveriesTableProps) => {

  console.log('Delivery Table', orders)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Address</TableHead>
          <TableHead>Distance</TableHead>
          <TableHead>Status</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="w-full">
        { orders ? (
          orders
          .filter((order) => order !== null)
          .map((order) => (
            <TableRow
              key={order.id}
              className={
                order.status !== "DELIVERED" ?? order.status !== "DISPATCHED" ? "" : "text-muted"
              }
            >
              <TableCell>{order.address}</TableCell>
              <TableCell>{formatMeter(order.distance)}</TableCell>
              <TableCell>
                <Badge variant="secondary">{order.status}</Badge>
              </TableCell>
              <TableCell>
                <OrderDialog 
                order={order} 
                />
              </TableCell>
            </TableRow>
          )
        )) : (
          <TableRow>
            <TableCell colSpan={4} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
