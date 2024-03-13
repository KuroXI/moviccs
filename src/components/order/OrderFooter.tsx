import type { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";
import { DialogClose, DialogFooter } from "../ui/dialog";

type OrderFooterProps = {
  page: number;
  hasLength: boolean;
  setPage: Dispatch<SetStateAction<number>>;
  onConfirm: () => Promise<string | number>;
};

export const OrderFooter = ({ page, hasLength, setPage, onConfirm }: OrderFooterProps) => {
  return (
    <DialogFooter>
      <Button
        size="sm"
        variant="ghost"
        disabled={page <= (hasLength ? 1 : 2)}
        onClick={() => setPage(page - 1)}
      >
        Back
      </Button>
      {page == 3 ? (
        <DialogClose onClick={onConfirm} asChild>
          <Button size="sm">Confirm</Button>
        </DialogClose>
      ) : (
        <Button size="sm" onClick={() => setPage(page + 1)}>
          Next
        </Button>
      )}
    </DialogFooter>
  );
};
