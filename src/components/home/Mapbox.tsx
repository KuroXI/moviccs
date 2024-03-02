import ReactMapGL, { Layer, Marker, Source } from "react-map-gl";
import { LocateFixed, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import type { Coordinate, GeoJSON } from "@/types";

type MapboxProps = {
  className?: string;
  orders: GeoJSON[];
  location: Coordinate;
};

export const Mapbox = ({ className, orders, location }: Readonly<MapboxProps>) => {
  const { theme } = useTheme();

  return (
    <div className={cn(className)}>
      <ReactMapGL
        mapboxAccessToken={process.env.NEXT_PUBLIC_ACCESS_TOKEN}
        mapStyle={
          theme === "dark"
            ? "mapbox://styles/kuroxi/clt326849009q01o8gkdy38ij"
            : "mapbox://styles/kuroxi/clt5ab9ga00d101rahgl70l2l"
        }
        initialViewState={{
          longitude: 121.057,
          latitude: 14.663,
          zoom: 14.81,
        }}
      >
        {orders.length ? (
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
        ) : null}
        <Marker latitude={location.latitude} longitude={location.longitude}>
          <LocateFixed />
        </Marker>
        {orders.map(({ coordinates }) => (
          <Marker latitude={coordinates[0]} longitude={coordinates[1]} key={`${coordinates[0]}-${coordinates[1]}`}>
            <MapPin style={{ color: "red" }} />
          </Marker>
        ))}
      </ReactMapGL>
    </div>
  );
};
