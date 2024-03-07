import { type Session } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type AvatarRiderProps = {
  session: Session;
};

export const AvatarRider = ({ session }: AvatarRiderProps) => {
  return (
    <Avatar>
      <AvatarImage src={session.user.image!} alt={session.user.name!} />
      <AvatarFallback>{session.user.name?.charAt(0).toUpperCase() ?? "R"}</AvatarFallback>
    </Avatar>
  );
};
