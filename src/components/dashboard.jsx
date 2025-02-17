import { AvatarWithDropdown } from "./ui/avatar-with-dropdown"
import { ThemeToggle } from "./ui/theme-toggle"


export function Dashboard(){
    return(
        <>
            <div className="flex justify-between p-7 border-2 border-solid items-center">
                <div>
                    <h1>Welcome back to Dashboard</h1>
                </div>
                <div className="flex gap-10">
                    <ThemeToggle/>
                    <AvatarWithDropdown/>
                </div>
        </div>
    </>
    )
}