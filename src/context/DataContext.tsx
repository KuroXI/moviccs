"use client"

import { api } from "@/trpc/react";
import { type RouteDetails } from "@/types";
import { type Dispatch, type ReactNode, type SetStateAction, createContext, useState } from "react";

export interface DataInterface {
  route: RouteDetails | undefined;
  routeDetails: RouteDetails | undefined;
  setRoute: Dispatch<SetStateAction<RouteDetails | undefined>>;
  setRouteDetails: Dispatch<SetStateAction<RouteDetails | undefined>>; 
};

export const DataContext = createContext<Partial<DataInterface>>({});

type UserProviderProps = {
    children: ReactNode;
};

const DataProvider = ({ children }: UserProviderProps) => {
    const [route, setRoute] = useState<RouteDetails | undefined>(undefined); 
    const [routeDetails, setRouteDetails] = useState<RouteDetails | undefined>(undefined);
    // const [pendingDelivery, setPendingDelivery] = useState<>();

    const pendingDeliveries = api.order.getPendingDeliveries.useQuery();
    
    console.log('Pending Deliveries: ', pendingDeliveries.data);
    console.log('IsFetching ', pendingDeliveries.isFetching);

    return (
        <DataContext.Provider value={{ route, setRoute, routeDetails, setRouteDetails }}>
            {children}
        </DataContext.Provider>
    );
};

export default DataProvider;