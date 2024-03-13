import { DashboardClient } from "@/components/dashboard/DashboardClient";
import { Navbar } from "@/components/home/Navbar";
import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";
import DataProvider from "@/context/DataContext";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerAuthSession();
  if (!session) return redirect("/");

  return (
    <>
      <Navbar session={session} />
      <MaxWidthWrapper>
        <DataProvider>
          <DashboardClient session={session} />
        </DataProvider> 
      </MaxWidthWrapper>
    </>
  );
}