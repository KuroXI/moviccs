"use client";

import { useContext, useReducer, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { HistoryContext } from "@/context/HistoryContext";
import { Button } from "../ui/button";
import { ALargeSmall, ArrowUpDown } from "lucide-react";
import { selectionSort } from "@/functions/selectionSort";
import { Input } from "../ui/input";
import { Toggle } from "../ui/toggle";
import { HistoryRow } from "./HistoryRow";

export const HistoryClient = () => {
  const { history, setHistory, isDesc, setIsDesc } = useContext(HistoryContext);
  const [, forceUpdate] = useReducer((x: number) => x + 1, 0);

  const sort = (key: "orderId" | "id" | "address" | "updatedAt") => {
    setIsDesc!(isDesc === undefined ? true : !isDesc);
    setHistory!(selectionSort(history!, key, !!isDesc));
    forceUpdate();
  };

  const [search, setSearch] = useState<string>("");
  const [isCaseSensitive, setIsCaseSensitive] = useState(false);

  const filteredHistory =
    search.length > 0
      ? history?.filter((delivery) =>
          isCaseSensitive
            ? delivery.address.includes(search)
            : delivery.address.toLowerCase().includes(search.toLowerCase()),
        )
      : history;

  return (
    <div className="pb-20">
      <div className="flex items-center gap-2 px-2 py-10">
        <Input
          className="w-1/4"
          placeholder="Search address"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Toggle
          aria-label="Toggle case-sensitive"
          size="sm"
          onPressedChange={(press) => setIsCaseSensitive(press)}
          pressed={isCaseSensitive}
        >
          <ALargeSmall size={20} />
        </Toggle>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Button variant="ghost" size="sm" onClick={() => sort("orderId")}>
                Order #
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" size="sm" onClick={() => sort("address")}>
                Address
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>Tracking Number</TableHead>
            <TableHead className="text-right">
              <Button variant="ghost" size="sm" onClick={() => sort("updatedAt")}>
                Delivered On
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {typeof filteredHistory !== "undefined" ? (
            search.length > 0 ? (
              filteredHistory.length > 0 ? (
                filteredHistory.map((delivery) => (
                  <HistoryRow key={delivery.id} delivery={delivery} search={search} isCaseSensitive={isCaseSensitive} />
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    Address containing &quot;{search}&quot; not found
                  </TableCell>
                </TableRow>
              )
            ) : (
              history?.map((delivery) => (
                <TableRow key={delivery.id}>
                  <TableCell>{delivery.orderId}</TableCell>
                  <TableCell>{delivery.address}</TableCell>
                  <TableCell className="hover:cursor-pointer hover:underline">{delivery.id}</TableCell>
                  <TableCell className="text-right">{delivery.updatedAt.toLocaleString()}</TableCell>
                </TableRow>
              ))
            )
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No history found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
