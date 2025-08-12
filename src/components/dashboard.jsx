import { AvatarWithDropdown } from "./ui/avatar-with-dropdown"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import Link from "next/link"
import StaggeredFade from "./an3"
import BlurIn from "./animTxt"
import ShinyButton from "@/components/ui/shinyButton"
import Image from "next/image"
import TypingEffect from "@/components/ui/typingEffect"
import { QuizStats } from "./Charts/quizStats"
import { getQuizzesForUser } from "@/queries/users"
import { QuizList } from "./quiz-list"


export async function Dashboard({ session }){
    const userImage = session?.user?.image && session.user.image.trim() !== "" ? session.user.image  : "/Avatar21.svg"; 
    const quizzes = (await getQuizzesForUser(session.user.email)) || [];

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
                    <div className="relative overflow-hidden rounded-xl border border-border/40 shadow-sm bg-gradient-to-br from-[#D1345B]/5 via-background to-[#34D1BF]/5">
                        <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.5),transparent)]" />
                        <div className="relative p-6 sm:p-8">
                            <div className="flex flex-col md:flex-row items-start justify-between gap-8">
                                {/* Welcome Text */}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <BlurIn className="text-2xl md:text-3xl lg:text-4xl font-bold">
                                                Welcome back,
                                            </BlurIn>
                                            <StaggeredFade 
                                                text={userName} 
                                                className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#D1345B]"
                                            />
                                        </div>
                                        <p className="text-muted-foreground text-sm md:text-base max-w-2xl">
                                            Track your progress, take assessments, and improve your skills. Your learning journey continues here.
                                        </p>
                                    </div>
                                </div>

                                {/* Quick Stats */}
                                <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
                                    <div className="group flex-1 p-4 rounded-xl bg-card hover:bg-accent transition-colors border border-border/40">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 rounded-lg bg-[#D1345B]/10 text-[#D1345B] group-hover:bg-[#D1345B]/20 transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M12 20v-6M6 20V10M18 20V4"/>
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground font-medium">Assessments</p>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-2xl font-bold">5</span>
                                                    <span className="text-xs text-[#D1345B]">+2 this week</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="group flex-1 p-4 rounded-xl bg-card hover:bg-accent transition-colors border border-border/40">
                                        <div className="flex items-start gap-4">
                                            <div className="p-2 rounded-lg bg-[#34D1BF]/10 text-[#34D1BF] group-hover:bg-[#34D1BF]/20 transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12"/>
                                                    <circle cx="17" cy="7" r="5"/>
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-sm text-muted-foreground font-medium">Average Score</p>
                                                <div className="flex items-baseline gap-1">
                                                    <span className="text-2xl font-bold">78%</span>
                                                    <span className="text-xs text-[#34D1BF]">↑ 5%</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Saved Quizzes Section */}
                    <div className="rounded-xl bg-card border border-border/40 shadow-sm">
                        <div className="p-6 border-b border-border/40">
                            <h2 className="text-2xl md:text-3xl font-bold">Your Saved Quizzes</h2>
                            <p className="text-muted-foreground mt-2">
                                Review your past assessments or start a new one.
                            </p>
                        </div>
                        <div className="p-6">
                            <QuizList quizzes={JSON.parse(JSON.stringify(quizzes))} />
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