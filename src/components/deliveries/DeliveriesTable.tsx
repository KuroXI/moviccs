import { type RouteDetails } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { OrderDialog } from "./OrderDialog";
import { formatMeter } from "@/lib/utils";

type DeliveriesTableProps = {
  route: RouteDetails | undefined;
};

export const DeliveriesTable = ({ route }: DeliveriesTableProps) => {
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
        {route ? (
          route.orderRoute
            .filter((order) => order.order !== null)
            .map((order) => (
              <TableRow
                key={order.order!.id}
                className={
                  order.order?.status !== "DELIVERED" ?? order.order?.status !== "DISPATCHED" ? "" : "text-muted"
                }
              >
                <TableCell>{order.order!.address}</TableCell>
                <TableCell>{formatMeter(order.order!.distance)}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{order.order!.status}</Badge>
                </TableCell>
                <TableCell>
                  <OrderDialog order={order.order!} />
                </TableCell>
              </TableRow>
            ))
        ) : (
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
