import { HistoryClient } from "@/components/history/HistoryClient";
import { Navbar } from "@/components/home/Navbar";
import { MaxWidthWrapper } from "@/components/ui/max-width-wrapper";
import HistoryProvider from "@/context/HistoryContext";
import { getServerAuthSession } from "@/server/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await getServerAuthSession();
  if (!session) return redirect("/");

  return (
    <>
      <Navbar session={session} />
      <MaxWidthWrapper>
        <HistoryProvider>
          <HistoryClient />
        </HistoryProvider>
      </MaxWidthWrapper>
    </>
  );
}
