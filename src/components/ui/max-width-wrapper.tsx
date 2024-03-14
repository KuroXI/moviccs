import { cn } from "@/lib/utils";

type MaxWidthWrapperProps = {
  children: React.ReactNode;
  className?: string;
};

export const MaxWidthWrapper = ({ children, className }: MaxWidthWrapperProps) => {
  return <div className={cn(className, "mx-auto max-w-screen-xl")}>{children}</div>;
};
