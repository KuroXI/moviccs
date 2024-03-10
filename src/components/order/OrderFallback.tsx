import { SpinnerIcon } from "../ui/icons";

export const OrderFallback = () => {
  console.log("is fetching");

  return (
    <div className="flex h-full w-full items-center justify-center py-20">
      <SpinnerIcon className="h-10 w-10 animate-spin text-gray-500" />
    </div>
  );
};
