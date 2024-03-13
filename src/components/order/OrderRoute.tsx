import type { Coordinate, IOrder, RouteDetails } from "@/types";
import { Mapbox } from "../dashboard/Mapbox";
import { ScrollArea } from "../ui/scroll-area";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "../ui/table";
import { type Session } from "next-auth";
import { useEffect, type Dispatch, type SetStateAction, useState, useContext } from "react";
import { generateDeliveryRoute } from "@/functions/generateDeliveryRoute";
import { formatMeter } from "@/lib/utils";
import { DataContext } from "@/context/DataContext";

type OrderRouteProps = {
  location: Coordinate;
  session: Session;
  selectedOrder: IOrder[];
  selectedRoute: RouteDetails | null;
  setSelectedRoute: Dispatch<SetStateAction<RouteDetails | null>>;
};

export const OrderRoute = ({ location, session, selectedOrder, }: OrderRouteProps) => {
  const [routes, setRoutes] = useState<RouteDetails[]>([]);

  const { route,  setRoute } = useContext(DataContext);

  useEffect(() => {
    const fetchRoutes = async () => {
      const paths = await generateDeliveryRoute(location, selectedOrder);
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
              <TableRow key={route.routeDistance} onClick={() => { setRoute!(route) }}>
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
