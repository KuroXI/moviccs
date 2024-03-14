import { DataContext } from "@/context/DataContext";
import { generateDeliveryRoute } from "@/functions/generateDeliveryRoute";
import { formatMeter } from "@/lib/utils";
import type { Coordinate, RouteDetails } from "@/types";
import { type Session } from "next-auth";
import { useContext, useEffect, useState } from "react";
import { Mapbox } from "../dashboard/Mapbox";
import { ScrollArea } from "../ui/scroll-area";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "../ui/table";

type OrderRouteProps = {
  location: Coordinate;
  session: Session;
};

export const OrderRoute = ({ location, session }: OrderRouteProps) => {
  const [routes, setRoutes] = useState<RouteDetails[]>([]);

  const { route,  setRoute, setRouteDetails, selectedOrder } = useContext(DataContext);

  useEffect(() => {
    const fetchRoutes = async () => {
      const paths = await generateDeliveryRoute(location, selectedOrder!.map((order) => order.order));
      setRoutes(paths);
    };

    fetchRoutes().catch(console.error);
  }, [location, selectedOrder]);

  return (
    <div className="grid min-h-96 grid-cols-3">
      <ScrollArea className="col-span-1 flex max-h-96 flex-col items-end justify-between">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Path</TableHead>
              <TableHead className="text-end">Total Distance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {routes.map((route, index) => (
              <TableRow key={route.routeDistance} onClick={() => { setRoute!(route); setRouteDetails!(route) }}>
                <TableHead>Path {index + 1}</TableHead>
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
        orderRoute={route?.orderRoute}
      />
    </div>
  );
};
