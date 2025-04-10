import { getServerSession } from "next-auth";
import { authOptions } from "@/components/authOptions";

export default async function Home() {
  const session = await getServerSession(authOptions);
  return <div> {session!.user!.id} </div>;
}
