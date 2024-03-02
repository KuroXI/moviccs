import { HomeClient } from "@/components/home/HomeClient";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerAuthSession();

  if (session) {
    return redirect("/dashboard");
  }

  return <HomeClient />;
}
