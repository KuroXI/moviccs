"use client";

import { api } from "@/trpc/react";
import type { HistoryDeliveries } from "@/types";
import { type ReactNode, createContext, useState, type Dispatch, type SetStateAction, useEffect } from "react";

interface HistoryInterface {
  history: HistoryDeliveries | undefined;
  setHistory: Dispatch<SetStateAction<HistoryDeliveries | undefined>>;

  isDesc: boolean | undefined;
  setIsDesc: Dispatch<SetStateAction<boolean>>;
}

export const HistoryContext = createContext<Partial<HistoryInterface>>({});

const HistoryProvider = ({ children }: { children: ReactNode }) => {
  const historyQuery = api.order.getHistoryDeliveries.useQuery();

  const [history, setHistory] = useState<HistoryDeliveries | undefined>(historyQuery.data);
  const [isDesc, setIsDesc] = useState(true);

  useEffect(() => {
    if (typeof historyQuery.data !== "undefined") {
      setHistory(historyQuery.data);
    }
  }, [historyQuery.data, history]);

  return (
    <HistoryContext.Provider value={{ history, setHistory, isDesc, setIsDesc }}>
      {children}
    </HistoryContext.Provider>
  );
};

export default HistoryProvider;
