import { cn } from "@/lib/utils";

type MaxWidthWrapperProps = {
  children: React.ReactNode;
  className?: string;
};

export const MaxWidthWrapper = ({ children, className }: MaxWidthWrapperProps) => {
  return <div className={cn(className, "mx-auto max-w-screen-lg")}>{children}</div>;
};
