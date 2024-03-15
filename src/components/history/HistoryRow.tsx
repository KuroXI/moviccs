import { stringMatching } from "@/functions/stringMatching";
import { handleHighlightedText } from "@/lib/utils";
import { TableCell, TableRow } from "../ui/table";

type HistoryRowProps = {
  delivery: {
    orderId: number;
    id: string;
    address: string;
    updatedAt: Date;
  };
  search: string;
  isCaseSensitive: boolean;
};

export const HistoryRow = ({ delivery, search, isCaseSensitive }: HistoryRowProps) => {
  const { position } = stringMatching(delivery.address, search, isCaseSensitive);
  const splittedAddress = handleHighlightedText(delivery.address, position);

  return (
    <TableRow key={delivery.id}>
      <TableCell>{delivery.orderId}</TableCell>
      <TableCell>
        {splittedAddress.map((word, index) => {
          const isMatch = isCaseSensitive ? word === search : word.toLowerCase() === search?.toLowerCase();
          return isMatch ? (
            <span className="bg-yellow-400 text-background" key={`${word}-${index}`}>
              {word}
            </span>
          ) : (
            <span key={`${word}-${index}`}>{word}</span>
          );
        })}
      </TableCell>
      <TableCell className="hover:cursor-pointer hover:underline">{delivery.id}</TableCell>
      <TableCell className="text-right">{delivery.updatedAt.toLocaleString()}</TableCell>
    </TableRow>
  );
};
