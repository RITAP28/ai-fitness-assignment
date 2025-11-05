import Hero from "@/components/custom/hero";
import Unauthorised from "@/components/custom/unauthorised";
import { getServerSession } from "@/lib/get-session";
import { IUserProps } from "@/utils/interfaces";

export default async function Home() {
  const session = await getServerSession();
  const user = session?.user;

  return (
    <div className="w-full min-h-screen bg-gray-900 text-yellow-500">
      <Hero user={user as IUserProps} />
    </div>
  );
}
