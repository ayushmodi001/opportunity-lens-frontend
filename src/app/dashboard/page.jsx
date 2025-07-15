import { Dashboard } from "@/components/dashboard";
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import DashboardToastHandler from "@/components/dashboard-toast-handler";

export default async function DashboardPage() {
  const session = await auth()

  if(!session?.user) redirect("/unauthorized")

  return (
    <div>
      <DashboardToastHandler />
      <div>
        <Dashboard session={session}/>
      </div>
    </div>
  );
}
