import { XCircle } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import type { IOrder } from "@/types";
import { Checkbox } from "../ui/checkbox";
import { calculateTotalWeight, formatCurrency, formatMeter, handleFilter } from "@/lib/utils";

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
      header: () => {
        return <h1>Address</h1>;
      },
      cell: ({ row }) => row.original.address,
    },
    {
      accessorKey: "distance",
      header: () => {
        return <h1 className="text-right">Distance</h1>;
      },
      cell: ({ row }) => formatMeter(row.original.distance),
    },
    {
      accessorKey: "weight",
      header: () => {
        return <h1 className="text-right">Weight</h1>;
      },
      cell: ({ row }) => <h1 className="text-right">{calculateTotalWeight(row.original.items)} kg</h1>,
    },
    {
      accessorKey: "price",
      header: () => {
        return <h1 className="text-right">Price</h1>;
      },
      cell: ({ row }) => (
        <h1 className="text-right">
          {formatCurrency(row.original.items.reduce((acc, item) => acc + item.price * item.amount, 0))}
        </h1>
      ),
    },
  ];
};
