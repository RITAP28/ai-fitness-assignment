import Plans from "@/components/custom/source/plans";
import Unauthorised from "@/components/custom/unauthorised";
import { getServerSession } from "@/lib/get-session"

export default async function Page() {
    const session = await getServerSession();
    if (!session) return <Unauthorised />

    const user = session.user;

    return (
        <Plans user={user} />
    )
}