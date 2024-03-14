"use client";

import { formatMeter } from "@/lib/utils";
import { Badge } from "../ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { OrderDialog } from "./OrderDialog";
import { useContext } from "react";
import { DataContext } from "@/context/DataContext";

export const DeliveriesTable = () => {
  const { routeDetails } = useContext(DataContext);

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Address</TableHead>
          <TableHead>Distance</TableHead>
          <TableHead className="text-center">Status</TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="w-full">
        {routeDetails ? (
          routeDetails.orderRoute
            .filter((route) => route.order !== null)
            .map((route) => (
              <TableRow
                key={route.order!.id}
                className={
                  route.order?.status !== "DELIVERED" ?? route.order?.status !== "DISPATCHED" ? "" : "text-muted"
                }
              >
                <TableCell>{route.order!.address}</TableCell>
                <TableCell>{formatMeter(route.order!.distance)}</TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary">{route.order!.status}</Badge>
                </TableCell>
                <TableCell>
                  <OrderDialog order={route.order!} />
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
