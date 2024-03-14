"use client";

import { type Session } from "next-auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MaxWidthWrapper } from "../ui/max-width-wrapper";
import { Skeleton } from "../ui/skeleton";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { Switch } from "../ui/switch";

type NavbarProps = {
  session: Session;
};

export const Navbar = ({ session }: NavbarProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b backdrop-blur-lg">
      <MaxWidthWrapper className="flex items-center justify-between px-5 py-2">
        <h1>Moviccs</h1>
        {session ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar>
                <AvatarImage src={session.user.image!} alt={session.user.id} />
                <AvatarFallback>{session.user.name?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">{session.user.name}</p>
                  <p className="text-xs text-muted-foreground">{session.user.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="flex items-center justify-between"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                >
                  Dark Mode
                  <Switch checked={theme === "dark"} onClick={() => setTheme(theme === "dark" ? "light" : "dark")} />
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() =>
                  signOut({
                    callbackUrl: "/",
                    redirect: true,
                  })
                }
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Skeleton className="h-8 w-8 rounded-full" />
        )}
      </MaxWidthWrapper>
    </header>
  );
};
