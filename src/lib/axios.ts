import { env } from "@/env";
import axios from "axios";

export const mapboxInstance = axios.create({
  baseURL: "https://api.mapbox.com",
  params: {
    access_token: env.NEXT_PUBLIC_ACCESS_TOKEN,
  },
});
