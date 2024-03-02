import { faker } from "@faker-js/faker";
import { mapboxInstance } from "@/lib/axios";
import type { GeoLocation, Coordinate, Location, Order } from "@/types";
import { generateItems } from "./generateItems";

type GetGeoLocationInput = {
  coordinates: Coordinate[];
  location: Coordinate;
};

export const getGeoLocation = async ({ coordinates, location }: GetGeoLocationInput) => {
  const geoLocationArray = [] as Order[];

  for (const { latitude, longitude } of coordinates) {
    const { data: geoLocation }: { data: GeoLocation } = await mapboxInstance.get(
      `/geocoding/v5/mapbox.places/${longitude},${latitude}.json`,
    );

    const currentLocation = `${location.longitude},${location.latitude}`;
    const targetLocation = `${longitude},${latitude}`;
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

    geoLocationArray.push({
      address: geoLocation.features[0].place_name,
      distance: distance.routes[0].distance,
      coordinates: [latitude, longitude],
      item: generateItems({ count: faker.number.int({ min: 1, max: 5 }) }),
    });
  }

  return geoLocationArray;
};
