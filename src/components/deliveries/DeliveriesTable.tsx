import { type IOrder } from "@/types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { ChevronDown } from "lucide-react";
import { Button } from "../ui/button";

type DeliveriesTableProps = {
  deliveries: IOrder[];
};

export const DeliveriesTable = ({ deliveries }: DeliveriesTableProps) => {
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
      <TableBody>
        {deliveries.map((delivery) => (
          <TableRow key={delivery.id}>
            <TableCell>{delivery.address}</TableCell>
            <TableCell>{delivery.distance}</TableCell>
            <TableCell>
              <Badge>{delivery.status}</Badge>
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
  );
};
