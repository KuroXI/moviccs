import "mapbox-gl/dist/mapbox-gl.css";
import ReactMapGL, { Marker } from "react-map-gl";
import { LocateFixed, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import type { Coordinate, IOrder } from "@/types";
import { env } from "@/env";

type MapboxProps = {
  className?: string;
  deliveries: IOrder[];
  location: Coordinate;
};

export const Mapbox = ({ className, deliveries, location }: Readonly<MapboxProps>) => {
  const { theme } = useTheme();

  return (
    <div className={cn(className)}>
      <ReactMapGL
        mapboxAccessToken={env.NEXT_PUBLIC_ACCESS_TOKEN}
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
        {/* {deliveries.length ? (
          <Source
            id="routeSource"
            type="geojson"
            data={{
              coordinates: orders[0]!.geojson.coordinates,
              type: "LineString",
            }}
          >
            <Layer
              id="roadLayer"
              type="line"
              layout={{ "line-join": "round", "line-cap": "round" }}
              paint={{ "line-color": "blue", "line-width": 4, "line-opacity": 0.75 }}
            />
          </Source>
        ) : null} */}
        <Marker latitude={location.latitude} longitude={location.longitude}>
          <LocateFixed />
        </Marker>
        {deliveries.map(({ coordinates }) => {
          console.log(coordinates);

          return (
            <Marker latitude={coordinates[0]!} longitude={coordinates[1]!} key={`${coordinates[0]}-${coordinates[1]}`}>
              <MapPin style={{ color: "red" }} />
            </Marker>
          );
        })}
      </ReactMapGL>
    </div>
  );
};
