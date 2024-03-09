import { env } from "@/env";
import axios from "axios";

export const mapboxInstance = axios.create({
  baseURL: "https://api.mapbox.com",
  params: {
    access_token: env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
  },
});

export const imageSearchInstance = axios.create({
  baseURL: "https://api.unsplash.com/search",
  params: {
    client_id: env.NEXT_PUBLIC_UNSPLASH_ACCESS_TOKEN,
    page: 1,
    per_page: 1,
    orientation: "landscape",
  },
});
