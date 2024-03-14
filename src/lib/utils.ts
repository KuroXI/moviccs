import type { HighlightedTextAccumulator, IOrder, RowSelection } from "@/types";
import { type Item } from "@prisma/client";
import type { Row, Table } from "@tanstack/react-table";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleFilter = (maxWeight: number, table: Table<IOrder>, row: Row<IOrder>) => {
  if (row.getIsSelected()) return true;

  const rowWeight = calculateTotalWeight(row.original.items);
  const selectedWeight = table
    .getSelectedRowModel()
    .rows.reduce((acc, item) => acc + calculateTotalWeight(item.original.items), 0);
  return rowWeight + selectedWeight <= maxWeight;
};

export const calculateTotalWeight = (items: Item[]) => {
  return items.reduce((acc, item) => acc + item.weight * item.amount, 0);
};

export const getColorByIndex = (index: number): string => {
  const colors = ["red", "green", "blue", "yellow", "orange", "purple", "pink", "brown", "gray", "teal"];

  return colors[(index + colors.length) % colors.length]!;
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
};

export const formatMeter = (value: number, decimalPlaces = 2): string => {
  const absValue = Math.abs(value);

  let unit = "m";
  let formattedValue = absValue.toFixed(decimalPlaces);

  if (absValue >= 1000) {
    formattedValue = (absValue / 1000).toFixed(decimalPlaces);
    unit = "km";
  } else if (absValue < 1) {
    formattedValue = (absValue * 100).toFixed(decimalPlaces);
    unit = "cm";
  }

  return `${value < 0 ? "-" : ""}${formattedValue} ${unit}`;
};

export const getRowSelection = (row: RowSelection[]) => {
  const rowSelection = {} as unknown as Record<string, boolean>;

  row.forEach((order) => {
    if (!order.index) return;
    rowSelection[order.index] = true;
  });
  return rowSelection;
};

export const handleHighlightedText = (text: string, position: number[][]): string[] => {
  const { splittedAddress } = position.reduce(
    (acc: HighlightedTextAccumulator, [start, end]) => {
      if (start! > acc.currentIndex) {
        acc.splittedAddress.push(text.substring(acc.currentIndex, start));
      }

      acc.splittedAddress.push(text.substring(start!, end! + 1));
      acc.splittedAddress.push(text.substring(end! + 1));
      acc.currentIndex = end! + 1;
      return acc;
    },
    { splittedAddress: [], currentIndex: 0 },
  );

  return splittedAddress;
};
