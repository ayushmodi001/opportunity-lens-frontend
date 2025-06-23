import { AvatarWithDropdown } from "./ui/avatar-with-dropdown"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import StaggeredFade from "./an3"
import BlurIn from "./animTxt"
import ShinyButton from "@/components/ui/shinyButton"
import Image from "next/image"
import TypingEffect from "@/components/ui/typingEffect"
import { QuizStats } from "./Charts/quizStats"


export async function Dashboard(){
    const session = await auth()

    if(!session?.user) redirect("/unauthorized")

        const userImage = session?.user?.image && session.user.image.trim() !== "" ? session.user.image  : "/Avatar21.svg"; 

        const userName = session?.user?.name;    return(
        <div className="min-h-screen bg-background">
            <div className="max-w-[1600px] mx-auto px-4 py-2">
                {/* Header */}
                <header className="mb-8">
                    <nav>
                        <div className="flex justify-between p-4 items-center h-16 rounded-xl bg-card shadow-sm border border-border/40">
                            <div className="flex gap-2 items-center">                                <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                                    <img src="/logo.svg" alt="logo" className="h-8 hover:scale-105 transition-transform"/>
                                    <BlurIn className="md:text-lg font-medium">Opportunity Lens</BlurIn>
                                </Link>
                            </div>
                            <div className="flex gap-6 items-center">
                                <Link 
                                    href="/test" 
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border/40 hover:bg-accent transition-colors"
                                >                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M8 2v4"/>
                                        <path d="M16 2v4"/>
                                        <path d="M3 10h18"/>
                                        <path d="M9 16l2 2 4-4"/>
                                        <rect x="3" y="4" width="18" height="18" rx="2"/>
                                    </svg>
                                    <span className="hidden md:inline">Assessment</span>
                                </Link>
                                <ThemeToggle/>
                                <AvatarWithDropdown userImage={userImage}/>
                            </div>
                        </div>
                    </nav>
                </header>

                <main className="space-y-6">
                    {/* Welcome Section with Quick Stats */}
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="md:col-span-2 p-8 rounded-xl bg-gradient-to-r from-background via-card to-background border border-border/40 shadow-sm">
                            <div className="flex flex-col gap-2">
                                <div className="flex items-center gap-3">
                                    <BlurIn className="text-2xl md:text-4xl font-bold">Welcome back,</BlurIn>
                                    <StaggeredFade text={userName} className="text-2xl md:text-4xl text-[#D1345B] font-bold"/>
                                </div>
                                <p className="text-muted-foreground text-sm md:text-base">
                                    Continue your learning journey and improve your skills
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-1 gap-4">
                            <div className="p-6 rounded-xl bg-[#D1345B]/10 border border-[#D1345B]/20 shadow-sm">
                                <div className="flex flex-col">
                                    <span className="text-sm text-muted-foreground">Total Assessments</span>
                                    <span className="text-2xl font-bold text-[#D1345B]">5</span>
                                    <span className="text-xs text-[#D1345B]/70 mt-1">+2 this week</span>
                                </div>
                            </div>
                            <div className="p-6 rounded-xl bg-[#34D1BF]/10 border border-[#34D1BF]/20 shadow-sm">
                                <div className="flex flex-col">
                                    <span className="text-sm text-muted-foreground">Average Score</span>
                                    <span className="text-2xl font-bold text-[#34D1BF]">78%</span>
                                    <span className="text-xs text-[#34D1BF]/70 mt-1">↑ 5% improvement</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions & Latest Achievement */}
                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Quick Start Section */}
                        <div className="md:col-span-2 grid md:grid-cols-2 gap-8 p-8 rounded-xl bg-card border border-border/40 shadow-sm">
                            <div className="flex justify-center items-center">
                                <Image
                                    src="/Group.svg"
                                    height={250}
                                    width={250}
                                    alt="ExamSVG"
                                    className="hover:scale-105 transition-transform duration-500 ease-out"
                                />
                            </div>
                            <div className="flex flex-col justify-center gap-6">
                                <div className="space-y-4">
                                    <BlurIn className="text-2xl md:text-3xl font-bold text-[#34D1BF]">
                                        Ready for Your Next Challenge?
                                    </BlurIn>
                                    <p className="text-muted-foreground">
                                        Test your knowledge across various subjects and track your improvement
                                    </p>
                                </div>
                                <Link href="/test" className="inline-block">
                                    <ShinyButton className="w-full md:w-auto rounded-xl px-8 py-3 text-lg">
                                        Start New Assessment
                                    </ShinyButton>
                                </Link>
                            </div>
                        </div>

                        {/* Latest Achievement */}
                        <div className="p-6 rounded-xl bg-gradient-to-b from-[#FFD700]/10 to-background border border-[#FFD700]/20 shadow-sm">
                            <div className="flex flex-col h-full">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 rounded-full bg-[#FFD700]/20">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-[#FFD700]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
                                            <path d="M18.727 15.727a6.964 6.964 0 0 0 0-7.454 8.97 8.97 0 0 0-13.454 0 6.964 6.964 0 0 0 0 7.454 8.97 8.97 0 0 0 13.454 0Z"/>
                                        </svg>
                                    </div>
                                    <span className="text-lg font-semibold">Latest Achievement</span>
                                </div>
                                <div className="bg-card/50 rounded-lg p-4 mb-4">
                                    <h3 className="font-medium text-[#FFD700]">Python Master</h3>
                                    <p className="text-sm text-muted-foreground mt-1">Scored 90% in Advanced Python Assessment</p>
                                </div>
                                <div className="mt-auto text-xs text-muted-foreground">
                                    Achieved 2 days ago
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Statistics Section */}
                    <div className="rounded-xl bg-card border border-border/40 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-border/40">
                            <div className="flex items-center justify-between">
                                <div>
                                    <TypingEffect 
                                        text="Your Performance Analytics" 
                                        className="text-2xl md:text-3xl font-bold"
                                    />
                                    <p className="text-muted-foreground mt-2">
                                        Track your progress and identify areas for improvement
                                    </p>
                                </div>
                                <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                                    <span className="h-2 w-2 rounded-full bg-[#D1345B]"></span> Updated daily
                                </div>
                            </div>
                        </div>
                        <div className="p-6">
                            <QuizStats />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}