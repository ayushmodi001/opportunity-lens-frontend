import { AvatarWithDropdown } from "./ui/avatar-with-dropdown"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { auth } from "@/auth"
import { redirect } from "next/navigation"

export async function Dashboard(){
    const session = await auth()

    if(!session?.user) redirect("/")
    return(
        <>
            <div className="flex justify-between p-7 border-2 border-solid items-center">
                <div>
                    <h1>Welcome back, {session?.user?.name}</h1>
                </div>
                <div className="flex gap-10">
                    <ThemeToggle/>
                    <AvatarWithDropdown/>
                </div>
        </div>
    </>
    )
}