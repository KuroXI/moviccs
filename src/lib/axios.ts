import axios from "axios";

export const mapboxInstance = axios.create({
  baseURL: "https://api.mapbox.com",
  params: {
    access_token: process.env.ACCESS_TOKEN,
  },
});