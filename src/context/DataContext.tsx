"use client";

import { type RouteDetails } from "@/types";
import { type Dispatch, type ReactNode, type SetStateAction, createContext, useState } from "react";

export interface DataInterface {
  route: RouteDetails | null;
  routeDetails: RouteDetails | null;
  setRoute: Dispatch<SetStateAction<RouteDetails | null>>;
  setRouteDetails: Dispatch<SetStateAction<RouteDetails | null>>;
}

export const DataContext = createContext<Partial<DataInterface>>({});

type UserProviderProps = {
  children: ReactNode;
};

const DataProvider = ({ children }: UserProviderProps) => {
  const [route, setRoute] = useState<RouteDetails | null>(null);
  const [routeDetails, setRouteDetails] = useState<RouteDetails | null>(null);

  return (
    <DataContext.Provider value={{ route, setRoute, routeDetails, setRouteDetails }}>{children}</DataContext.Provider>
  );
};

export default DataProvider;
