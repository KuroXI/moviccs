export type Order = {
  address: string;
  distance: number;
  coordinates: [latitude: number, longitude: number];
  item: Item[];
};

export type Item = {
  item: string;
  price: number;
  weight: number;
  amount: number;
};

export type Coordinate = {
  latitude: number;
  longitude: number;
};

export interface GeoJSON extends Order {
  geojson: {
    coordinates: number[][];
  };
}

export type GeoLocation = {
  features: [
    {
      place_name: string;
    },
  ];
};

export type Location = {
  routes: [
    {
      distance: number;
      geometry: {
        coordinates: number[][];
      };
    },
  ];
};
