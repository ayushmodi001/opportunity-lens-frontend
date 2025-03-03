import { AvatarWithDropdown } from "./ui/avatar-with-dropdown"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import StaggeredFade from "./an3"
import BlurIn from "./animTxt"
import ShinyButton from "@/components/ui/shinyButton"
import Image from "next/image"
import TypingEffect from "@/components/ui/typingEffect"


export async function Dashboard(){
    const session = await auth()

    if(!session?.user) redirect("/")

        const userImage = session?.user?.image && session.user.image.trim() !== "" ? session.user.image  : "/Avatar21.svg"; 

        const userName = session?.user?.name;
    return(
        <>
        <div className="m-2 p-1flex flex-col">
            <header>
                <nav>
                        <div className="flex justify-between p-6  items-center h-16 rounded-2xl border-2 border-solid">
                            <div className="flex gap-1 items-center">
                                <img src="/logo.svg" alt="logo" className="h-8"/>
                                <BlurIn className="md:text-lg">Opportunity Lens</BlurIn>
                            </div>
                            <div className="flex gap-10">
                                <ThemeToggle/>
                                <AvatarWithDropdown userImage={userImage}/>
                            </div>
                        </div>
                </nav>
            </header>
        </div>
        <div className="m-3 p-1 flex flex-row items-center justify-center gap-2 border-2 border-solid rounded-2xl">
            <div>
                <BlurIn className="md:text-[35px] font-extrabold">Welcome back,</BlurIn>
            </div>
            <div>
                <StaggeredFade text={userName} className="md:text-[35px] text-[#D1345B] font-extrabold"/>
            </div>
        </div>
        <div className="flex flex-row items-center justify-center m-4 p-4 md:p-4 border-solid border-2 rounded-2xl gap-5 md:gap-20">
            <div>
                <Image
                    src="/Group.svg"
                    height={250}
                    width={250}
                    alt="ExamSVG"
                />
            </div>
            <div className="flex flex-col gap-5">
                <div className="text-wrap">
                    <BlurIn className="text-[#34D1BF]">Let's Test Your Knowldge</BlurIn>
                </div>
                <div>
                    <ShinyButton className="rounded-xl">Click Here!</ShinyButton>
                </div>
            </div>
        </div>
        <div className="flex flex-col gap-3 border-2 border-solid rounded-2xl m-2 p-1">
            <TypingEffect text="Statistics" className="text-center sm:text-4xl font-bold md:text-4xl tracking-normal"/>
            <div className="border-2 border-solid rounded-2xl p-2 m-1">
                
            </div>
        </div>
        </>
    )
}