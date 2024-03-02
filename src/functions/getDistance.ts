import { mapboxInstance } from "@/lib/axios";
import type { Location, Coordinate } from "@/types";

export const getDistance = async (current: Coordinate, target: Coordinate) => {
  const currentLocation = `${current.longitude},${current.latitude}`;
  const targetLocation = `${target.longitude},${target.latitude}`;

  const { data: distance }: { data: Location } = await mapboxInstance.get(
    `/directions/v5/mapbox/driving/${currentLocation};${targetLocation}`,
    {
      params: {
        alternatives: false,
        overview: "full",
        geometries: "geojson",
        steps: false,
        notifications: "none",
      },
    },
  );

  return {
    distance: distance.routes[0].distance,
    route: distance.routes[0].geometry.coordinates,
  };
};
