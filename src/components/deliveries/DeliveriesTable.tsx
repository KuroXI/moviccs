import { type RouteDetails } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { OrderDialog } from "./OrderDialog";
import { formatMeter } from "@/lib/utils";
import { Button } from "../ui/button";
import { ChevronDown } from "lucide-react";

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
          route.orderRoute.map((route) =>
            route.order != null ? (
              <TableRow
                key={route.order.id}
                className={
                  route.order?.status !== "DELIVERED" ?? route.order?.status !== "DISPATCHED" ? "" : "text-muted"
                }
              >
                <TableCell>{route.order.address}</TableCell>
                <TableCell>{formatMeter(route.order.distance)}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{route.order.status}</Badge>
                </TableCell>
                <TableCell>
                  <OrderDialog order={route.order} />
                </TableCell>
              </TableRow>
            ) : (
              <TableRow key={route.destinationId}>
                <TableCell colSpan={2}>Return to Hub</TableCell>
                <TableCell>
                  <Badge variant="secondary">PENDING</Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <ChevronDown size={20} />
                  </Button>
                </TableCell>
              </TableRow>
            ),
          )
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
