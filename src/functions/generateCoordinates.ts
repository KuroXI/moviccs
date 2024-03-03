import { faker } from "@faker-js/faker";
import { type Coordinate } from "@/types";

type GenerateCoordinatesInput = {
  count: number;
  location: Coordinate;
};

export const generateCoordinates = ({ count, location }: GenerateCoordinatesInput) => {
  const generateCoordinate = (): Coordinate => {
    const [latitude, longitude] = faker.location.nearbyGPSCoordinate({
      origin: [location.latitude, location.longitude],
      radius: 4,
      isMetric: true,
    });

    return {
      latitude,
      longitude,
    };
  };

  return faker.helpers.multiple(generateCoordinate, { count });
};
