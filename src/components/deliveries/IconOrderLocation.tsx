type IconOrderLocationProps = {
  number: number;
};

export const IconOrderLocation = ({ number }: IconOrderLocationProps) => {
  return (
    <div className="bg flex h-5 w-5 items-center justify-center rounded-full bg-primary text-lg text-background">
      {number}
    </div>
  );
};
