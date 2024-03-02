import { HomeClient } from "@/components/home/HomeClient";
import { api } from "@/trpc/server";
import { unstable_noStore as noStore } from "next/cache";

export default async function Home() {
  noStore();

  const orders = await api.order.get.query();

  return <HomeClient orders={orders} />;
}
