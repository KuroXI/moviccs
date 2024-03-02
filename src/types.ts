export type Order = {
  name: string;
  distance: number;
  coordinates: [latitude: number, longitude: number];
  geojson: GeoJSON;
  item: Item;
};

export type Item = {
  name: string;
  price: number;
  weight: number;
  quantity: number;
};

export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type GeoJSON = {
  coordinates: number[][];
};