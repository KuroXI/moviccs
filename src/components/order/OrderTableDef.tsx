import { ArrowUpDown, XCircle } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import type { IOrder } from "@/types";
import { Checkbox } from "../ui/checkbox";
import { calculateTotalWeight, formatCurrency, formatMeter, handleFilter } from "@/lib/utils";
import { Button } from "../ui/button";

export const orderTableDef = (maxWeight: number): ColumnDef<IOrder>[] => {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <XCircle
          size={20}
          className="text-muted-foreground hover:cursor-pointer hover:text-foreground"
          onClick={() => table.toggleAllRowsSelected(false)}
        />
      ),
      cell: ({ row, table }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          disabled={!handleFilter(maxWeight, table, row)}
          aria-label="Select row"
        />
      ),
    },
    {
      accessorKey: "address",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Address
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => row.original.address,
    },
    {
      accessorKey: "distance",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Distance
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => formatMeter(row.original.distance),
    },
    {
      accessorKey: "weight",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Weight
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <h1 className="text-right">{calculateTotalWeight(row.original.items)} kg</h1>,
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <h1 className="text-right">
          {formatCurrency(row.original.items.reduce((acc, item) => acc + item.price * item.amount, 0))}
        </h1>
      ),
    },
  ];
};
