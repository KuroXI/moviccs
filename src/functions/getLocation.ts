import { mapboxInstance } from "@/lib/axios";
import type { GeoLocation } from "@/types";

export const getLocation = async (latitude: number, longitude: number) => {
  const { data: geoLocation }: { data: GeoLocation } = await mapboxInstance.get(
    `/geocoding/v5/mapbox.places/${longitude},${latitude}.json`,
  );

  return {
    address: geoLocation.features[0].place_name,
  };
};
