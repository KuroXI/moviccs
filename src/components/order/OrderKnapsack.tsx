"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { knapsack } from "@/functions/knapsack";
import { toast } from "sonner";
import { useState, useEffect, useContext } from "react";
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  type ColumnFiltersState,
  type SortingState,
  getSortedRowModel,
  type VisibilityState,
} from "@tanstack/react-table";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { OrderTableDef } from "./OrderTableDef";
import { getRowSelection, handleFilter } from "@/lib/utils";
import { Input } from "../ui/input";
import { Toggle } from "../ui/toggle";
import { ALargeSmall } from "lucide-react";
import { DataContext } from "@/context/DataContext";

type OrderKnapsackProps = {
  maxWeight: number;
};

export const OrderKnapsack = ({ maxWeight }: OrderKnapsackProps) => {
  const { orders, selectedOrder, setSelectedOrder } = useContext(DataContext);

  const [isCaseSensitive, setIsCaseSensitive] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const columns = OrderTableDef(maxWeight, isCaseSensitive);

  const table = useReactTable({
    data: orders!.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    state: {
      rowSelection,
      columnFilters,
      columnVisibility,
      sorting,
    },
    initialState: {
      sorting: [
        {
          desc: true,
          id: "select",
        },
      ],
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
      return toast.warning("No available orders. Please try again.");
    }

    const column = table.getColumn("select");
    column?.toggleSorting(true);

    table.setRowSelection(() => getRowSelection(order));

    setSelectedOrder!(order);
    toast.success("Successfully picked orders using knapsack algorithm.");
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex w-full max-w-xs items-center gap-2">
          <Input
            id="address-search"
            name="address-search"
            placeholder="Search address..."
            value={(table.getColumn("address")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("address")?.setFilterValue(event.target.value)}
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
        <div className="flex items-center justify-end gap-3">
          <Button onClick={() => table.toggleAllRowsSelected(false)} variant="ghost" size="sm">
            Clear selection
          </Button>
          <Button size="sm" onClick={takeOrder} disabled={table.getSelectedRowModel().rows.length > 0}>
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
