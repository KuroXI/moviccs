import { env } from "@/env";
import { cn, getColorByIndex } from "@/lib/utils";
import type { Coordinate, OrderRoute } from "@/types";
import "mapbox-gl/dist/mapbox-gl.css";
import { type Session } from "next-auth";
import { useTheme } from "next-themes";
import ReactMapGL, { Layer, Marker, Source } from "react-map-gl";
import { IconOrderLocation } from "../deliveries/IconOrderLocation";
import { AvatarRider } from "./AvatarRider";

type MapboxProps = {
  className?: string;
  location: Coordinate;
  session: Session;
  orderRoute: OrderRoute[] | undefined;
};

export const Mapbox = ({ className, location, session, orderRoute }: MapboxProps) => {
  const { theme } = useTheme();

  return (
    <div className={cn(className)}>
      <ReactMapGL
        mapboxAccessToken={env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        mapStyle={
          theme === "dark"
            ? "mapbox://styles/kuroxi/clt326849009q01o8gkdy38ij"
            : "mapbox://styles/kuroxi/clt5ab9ga00d101rahgl70l2l"
        }
        initialViewState={{
          longitude: location.longitude,
          latitude: location.latitude,
          zoom: 14.81,
        }}
      >

        {orderRoute?.length
          ? orderRoute.map((order, index) => (
              <Source
                key={`${order.destinationId}-source-${index}`}
                id={`${order.destinationId}-source-${index}`}
                type="geojson"
                data={{
                  coordinates: order.routeDescription.route,
                  type: "LineString",
                }}
              >
                <Layer
                  id={`${order.destinationId}-layer-${index}`}
                  type="line"
                  layout={{ "line-join": "round", "line-cap": "round" }}
                  paint={{ "line-color": getColorByIndex(index), "line-width": 4, "line-opacity": 1 }}
                />
              </Source>
            ))
          : null}

        {orderRoute?.length
          ? orderRoute.map(
              ({ order, destinationId }, index) =>
                order !== null && (
                  <Marker
                    key={`${destinationId}-marker-${index}`}
                    latitude={order.coordinates[0]!}
                    longitude={order.coordinates[1]!}
                  >
                    <IconOrderLocation number={index + 1} />
                  </Marker>
                ),
            )
          : null}

        <Marker latitude={location.latitude} longitude={location.longitude}>
          <AvatarRider session={session} />
        </Marker>
      </ReactMapGL>
    </div>
  );
};
