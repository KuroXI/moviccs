"use client";

import type { Coordinate, IOrder, RouteDetails } from "@/types";
import { Mapbox } from "../dashboard/Mapbox";
import { Button } from "../ui/button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "../ui/dialog";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "../ui/table";
import { generateDeliveryRoute } from "@/functions/generateDeliveryRoute";
import { type Dispatch, type SetStateAction, useState } from "react";
import { type Session } from "next-auth";
import { formatMeter } from "@/lib/formatMeter";
import { ScrollArea } from "../ui/scroll-area";

type DeliveryPathProps = {
  location: Coordinate;
  deliveries: IOrder[];
  session: Session;
  setSelectRoute: Dispatch<SetStateAction<RouteDetails | null>>;
};

export const DeliveryPath = ({ location, deliveries, session, setSelectRoute }: DeliveryPathProps) => {
  const [routes, setRoutes] = useState<RouteDetails[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RouteDetails | null>(null);

  const takePath = async () => {
    const paths = await generateDeliveryRoute(location, deliveries);
    setRoutes(paths);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button onClick={takePath} disabled={!deliveries?.length}>
          Delivery Path
        </Button>
      </DialogTrigger>
      <DialogContent className="grid h-3/4 max-h-fit max-w-7xl grid-cols-3 gap-3">
        <ScrollArea className="col-span-1 flex flex-col items-end justify-between">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Path</TableHead>
                <TableHead className="text-end">Total Distance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {routes.map((route, index) => (
                <TableRow key={route.routeDistance} onClick={() => setSelectedRoute(route)}>
                  <TableHead>Path {index}</TableHead>
                  <TableHead className="text-end">{formatMeter(route.routeDistance)}</TableHead>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>

        <Mapbox
          className="z-50 col-span-2 h-full w-full p-5"
          location={location}
          session={session}
          route={selectedRoute}
        />
        <DialogClose asChild>
          <Button disabled={selectedRoute === null} onClick={() => setSelectRoute(selectedRoute)}>
            Accept
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};
