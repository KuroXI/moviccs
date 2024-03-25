import { ArrowUpDown } from "lucide-react";
import { type ColumnDef } from "@tanstack/react-table";
import type { IOrder } from "@/types";
import { Checkbox } from "../ui/checkbox";
import { calculateTotalWeight, formatCurrency, formatMeter, handleFilter, handleHighlightedText } from "@/lib/utils";
import { Button } from "../ui/button";
import { stringMatching } from "@/functions/stringMatching";

export const orderTableDef = (maxWeight: number, isCaseSensitive: boolean): ColumnDef<IOrder>[] => {
  return [
    {
      id: "select",
      accessorKey: "select",
      header: ({ column }) => (
        <ArrowUpDown
          size={20}
          className="text-muted-foreground hover:cursor-pointer hover:text-foreground"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
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
      sortingFn: (a, b) => {
        const aValue = a.getIsSelected() ? 1 : 0;
        const bValue = b.getIsSelected() ? 1 : 0;
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      },
      enableSorting: true,
    },
    {
      accessorKey: "address",
      header: ({ column }) => (
        <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Address
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row, column }) => {
        if (row.columnFilters.address === true) {
          const filterValue = column.getFilterValue() as string;
          const { position } = stringMatching(row.original.address, filterValue, isCaseSensitive);

          const splittedAddress = handleHighlightedText(row.original.address, position);

          return splittedAddress.map((word, index) => {
            const isEqual = isCaseSensitive ? word === filterValue : word.toLowerCase() === filterValue.toLowerCase();
            return isEqual ? (
              <span className="bg-yellow-400 text-background" key={`${word}-${index}`}>
                {word}
              </span>
            ) : (
              <span key={`${word}-${index}`}>{word}</span>
            );
          });
        }

        return row.original.address;
      },
      filterFn: (rows, id, filterValue) => {
        const { position } = stringMatching(rows.original.address, filterValue as string, isCaseSensitive);
        return position.length > 0;
      },
    },
    {
      accessorKey: "distance",
      header: ({ column }) => (
        <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Distance
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <h1 className="text-center">{formatMeter(row.original.distance)}</h1>,
      sortingFn: (a, b) => {
        const aValue = a.original.distance;
        const bValue = b.original.distance;
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      },
    },
    {
      accessorKey: "weight",
      header: ({ column }) => (
        <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Weight
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <h1 className="text-center">{calculateTotalWeight(row.original.items)} kg</h1>,
      sortingFn: (a, b) => {
        const aValue = calculateTotalWeight(a.original.items);
        const bValue = calculateTotalWeight(b.original.items);
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      },
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <h1 className="text-right">
          {formatCurrency(row.original.items.reduce((acc, item) => acc + item.price * item.amount, 0))}
        </h1>
      ),
      sortingFn: (a, b) => {
        const aValue = a.original.items.reduce((acc, item) => acc + item.price * item.amount, 0);
        const bValue = b.original.items.reduce((acc, item) => acc + item.price * item.amount, 0);
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      },
    },
  ];
};
