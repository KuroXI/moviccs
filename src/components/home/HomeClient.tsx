"use client";

import { Button } from "../ui/button";
import { signIn } from "next-auth/react";

export const HomeClient = () => {
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      <Button onClick={() => signIn("google")}>Login with Google</Button>
    </div>
  );
};
