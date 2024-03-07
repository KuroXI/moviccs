import { type RouteDetails } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { ChevronDown } from "lucide-react";
import { Button } from "../ui/button";
import { formatMeter } from "@/lib/formatMeter";

type DeliveriesTableProps = {
  route: RouteDetails;
};

export const DeliveriesTable = ({ route }: DeliveriesTableProps) => {
  return (
    <>
      <div className="flex items-center justify-end gap-5"></div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Address</TableHead>
            <TableHead>Distance</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {route.orderRoute
            .filter((order) => order.order !== null)
            .map((order) => (
              <TableRow key={order.order!.id} className={order.order?.status === "CONFIRMED" ? "" : "text-muted"}>
                <TableCell>{order.order!.address}</TableCell>
                <TableCell>{formatMeter(order.order!.distance)}</TableCell>
                <TableCell>
                  <Badge>{order.order!.status}</Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon">
                    <ChevronDown size={20} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </>
  );
};
