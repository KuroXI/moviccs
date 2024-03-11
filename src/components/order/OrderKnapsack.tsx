"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { knapsack } from "@/functions/knapsack";
import { toast } from "sonner";
import type { IOrder, RowSelection } from "@/types";
import { useState, type Dispatch, type SetStateAction, useEffect } from "react";
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  type ColumnFiltersState,
  type SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { orderTableDef } from "./OrderTableDef";
import { calculateTotalWeight, getRowSelection, handleFilter } from "@/lib/utils";
import { Input } from "../ui/input";

type OrderKnapsackProps = {
  maxWeight: number;
  orders: IOrder[];
  selectedOrder: RowSelection[];
  setSelectedOrder: Dispatch<SetStateAction<RowSelection[]>>;
};

export const OrderKnapsack = ({ maxWeight, orders, selectedOrder, setSelectedOrder }: OrderKnapsackProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const columns = orderTableDef(maxWeight);

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: () => setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    state: {
      rowSelection,
      columnFilters,
      sorting,
    },
  });

  useEffect(() => {
    if (!selectedOrder) return;
    return table.setRowSelection(() => getRowSelection(selectedOrder));
  }, [orders, selectedOrder, table]);

  const takeOrder = async () => {
    const order = knapsack({
      maxWeight,
      orders: table.getRowModel().rows.map((row) => ({
        index: row.index,
        order: row.original,
      })),
    });

    if (order.length === 0) {
      return toast.warning("No orders can be taken");
    }

    table.setRowSelection(() => getRowSelection(order));

    setSelectedOrder(order);
    toast.success("Orders taken");
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <Input placeholder="Search address..." />
        </div>
        <h1 className="flex text-sm text-muted-foreground">
          Selected a total of {table.getFilteredSelectedRowModel().rows.length} with{" "}
          {table
            .getFilteredSelectedRowModel()
            .rows.reduce((acc, item) => acc + calculateTotalWeight(item.original.items), 0)}{" "}
          of {maxWeight}kg weight
        </h1>
        <div className="flex items-center justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={takeOrder}>
            Auto pick
          </Button>
        </div>
      </div>
      <ScrollArea className="max-h-96">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={`${handleFilter(maxWeight, table, row) ? "" : "text-muted"}`}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </ScrollArea>
    </>
  );
};
