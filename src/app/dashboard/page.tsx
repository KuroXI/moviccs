import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { Navbar } from "@/components/home/Navbar";
import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerAuthSession();
  if (!session) return redirect("/");

  const orders = await api.order.getAvailableOrder.query();
  return (
    <>
      <Navbar session={session} />
      <MaxWidthWrapper>
        <DashboardClient orders={orders} session={session} />
      </MaxWidthWrapper>
    </>
  );
}
