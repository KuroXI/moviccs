"use client";

import { type RouteDetails } from "@/types";
import { type Dispatch, type ReactNode, type SetStateAction, createContext, useState } from "react";

export interface DataInterface {
  route: RouteDetails | undefined;
  routeDetails: RouteDetails | undefined;
  setRoute: Dispatch<SetStateAction<RouteDetails | undefined>>;
  setRouteDetails: Dispatch<SetStateAction<RouteDetails | undefined>>;
}

export const DataContext = createContext<Partial<DataInterface>>({});

type UserProviderProps = {
  children: ReactNode;
};

const DataProvider = ({ children }: UserProviderProps) => {
  const [route, setRoute] = useState<RouteDetails | undefined>(undefined);
  const [routeDetails, setRouteDetails] = useState<RouteDetails | undefined>(undefined);

  return (
    <DataContext.Provider value={{ route, setRoute, routeDetails, setRouteDetails }}>{children}</DataContext.Provider>
  );
};

export default DataProvider;
