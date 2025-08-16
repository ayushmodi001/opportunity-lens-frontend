"use client";

import { AvatarWithDropdown } from "./ui/avatar-with-dropdown"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import Link from "next/link"
import BlurIn from "./animTxt"
import { QuizList } from "./quiz-list"
import { AchievementList } from "./achievement-list"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { BarChart, Trophy, Activity } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart as RechartsBarChart, CartesianGrid, XAxis, YAxis, Cell, LineChart, Line, AreaChart, Area } from "recharts"
import { AIAssistant } from "./ai-assistant";

export function Dashboard({ user, session, availableQuizzes, recentQuizzes, achievements, totalQuizzes }) {
    const userImage = session?.user?.image && session.user.image.trim() !== "" ? session.user.image : "/Avatar21.svg";
    const userName = user?.Username || session?.user?.name;

    const chartData = recentQuizzes.map(quiz => ({
        name: (quiz.title || (quiz.skills && quiz.skills.length > 0 ? quiz.skills[0] : "Untitled Quiz")).slice(0, 15), // Shorten name for chart
        score: quiz.score,
    }));

    const averageScore = recentQuizzes.length > 0 
        ? (recentQuizzes.reduce((acc, quiz) => acc + quiz.score, 0) / recentQuizzes.length).toFixed(2)
        : 0;

    const highestScore = recentQuizzes.length > 0 
        ? Math.max(...recentQuizzes.map(q => q.score)).toFixed(2)
        : 0;
    
    const lowestScore = recentQuizzes.length > 0
        ? Math.min(...recentQuizzes.map(q => q.score)).toFixed(2)
        : 0;

    const quizzesPassed = recentQuizzes.filter(q => q.score >= 50).length;
    const passingRate = recentQuizzes.length > 0
        ? ((quizzesPassed / recentQuizzes.length) * 100).toFixed(2)
        : 0;

    const uniqueRecentQuizzes = Object.values(recentQuizzes.reduce((acc, quiz) => {
        const title = quiz.title || (quiz.skills && quiz.skills.length > 0 ? quiz.skills[0] : "Untitled Quiz");
        acc[title] = quiz; // Always overwrite to keep the last (most recent) quiz
        return acc;
    }, {}));

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-[1600px] mx-auto px-2 sm:px-4 py-2">
                {/* Header */}
                <header className="mb-4 md:mb-8">
                    <nav>
                        <div className="flex justify-between p-2 sm:p-4 items-center h-16 rounded-xl bg-card shadow-sm border border-border/40">
                            <div className="flex gap-2 items-center">
                                <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                                    <img src="/logo.svg" alt="logo" className="h-8 hover:scale-105 transition-transform" />
                                    <BlurIn className="text-base md:text-lg font-medium">Opportunity Lens</BlurIn>
                                </Link>
                            </div>
                            <div className="flex gap-2 sm:gap-4 md:gap-6 items-center">
                                <Link
                                    href="/test"
                                    className="flex items-center gap-2 px-3 py-2 sm:px-4 rounded-lg border border-border/40 hover:bg-accent transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M8 2v4" />
                                        <path d="M16 2v4" />
                                        <path d="M3 10h18" />
                                        <path d="M9 16l2 2 4-4" />
                                        <rect x="3" y="4" width="18" height="18" rx="2" />
                                    </svg>
                                    <span className="hidden md:inline">Assessment</span>
                                </Link>
                                <ThemeToggle />
                                <AvatarWithDropdown userImage={userImage} />
                            </div>
                        </div>
                    </nav>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-8">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-4 md:space-y-8">
                        <Card>
                            <CardHeader>
                                <CardTitle>Welcome back, {userName}!</CardTitle>
                                <CardDescription>Here's a snapshot of your journey. Ready for the next challenge?</CardDescription>
                            </CardHeader>
                        </Card>

                        {/* Quick Stats - Mobile Only */}
                        <div className="lg:hidden">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><BarChart className="w-5 h-5" /> Quick Stats</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 sm:grid-cols-2 gap-4">
                                    <div className="flex flex-col items-center justify-center p-4 bg-secondary rounded-lg">
                                        <span className="text-xl md:text-2xl font-bold">{averageScore}%</span>
                                        <span className="text-xs md:text-sm text-muted-foreground text-center">Average Score</span>
                                    </div>
                                    <div className="flex flex-col items-center justify-center p-4 bg-secondary rounded-lg">
                                        <span className="text-xl md:text-2xl font-bold">{highestScore}%</span>
                                        <span className="text-xs md:text-sm text-muted-foreground text-center">Highest Score</span>
                                    </div>
                                    <div className="flex flex-col items-center justify-center p-4 bg-secondary rounded-lg">
                                        <span className="text-xl md:text-2xl font-bold">{lowestScore}%</span>
                                        <span className="text-xs md:text-sm text-muted-foreground text-center">Lowest Score</span>
                                    </div>
                                    <div className="flex flex-col items-center justify-center p-4 bg-secondary rounded-lg">
                                        <span className="text-xl md:text-2xl font-bold">{passingRate}%</span>
                                        <span className="text-xs md:text-sm text-muted-foreground text-center">Passing Rate</span>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm font-medium text-center">Quizzes Completed: {recentQuizzes.length} / {totalQuizzes + recentQuizzes.length}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Tabs defaultValue="available" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="available">Available Quizzes</TabsTrigger>
                                <TabsTrigger value="recent">Completed Quizzes</TabsTrigger>
                            </TabsList>
                            <TabsContent value="available">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Choose Your Next Challenge</CardTitle>
                                        <CardDescription>{availableQuizzes.length} quizzes available</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <QuizList quizzes={availableQuizzes} />
                                    </CardContent>
                                </Card>
                            </TabsContent>
                            <TabsContent value="recent">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Review Your Performance</CardTitle>
                                        <CardDescription>You've completed {recentQuizzes.length} quizzes</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <QuizList quizzes={recentQuizzes} completed={true} />
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>

                        <AIAssistant quizzes={recentQuizzes} />

                        <Card>
                            <CardHeader>
                                <CardTitle>Performance Analytics</CardTitle>
                                <CardDescription>Your scores from recently completed quizzes, displayed in different chart formats.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-4">
                                <div className="flex flex-col h-80 md:h-96">
                                    <h3 className="text-lg font-semibold mb-2 text-center">Quiz Scores Overview</h3>
                                    <ChartContainer config={{ score: { label: "Score", color: "hsl(var(--primary))" } }}>
                                        <RechartsBarChart data={chartData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                                            <CartesianGrid vertical={false} />
                                            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }} />
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                            <Bar dataKey="score" radius={4}>
                                                {chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={`hsl(var(--chart-${index % 5 + 1}))`} />
                                                ))}
                                            </Bar>
                                        </RechartsBarChart>
                                    </ChartContainer>
                                </div>
                                <div className="flex flex-col h-80 md:h-96">
                                    <h3 className="text-lg font-semibold mb-2 text-center">Score Progression</h3>
                                    <ChartContainer config={{ score: { label: "Score", color: "hsl(var(--chart-2))" } }}>
                                        <LineChart data={chartData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                                            <CartesianGrid vertical={false} />
                                            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}/>
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                            <Line type="monotone" dataKey="score" strokeWidth={2} dot={true} stroke="hsl(var(--chart-2))" />
                                        </LineChart>
                                    </ChartContainer>
                                </div>
                                <div className="flex flex-col h-80 md:h-96">
                                     <h3 className="text-lg font-semibold mb-2 text-center">Score Distribution</h3>
                                     <ChartContainer config={{ score: { label: "Score", color: "hsl(var(--chart-3))" } }}>
                                        <AreaChart data={chartData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                                            <CartesianGrid vertical={false} />
                                            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}/>
                                            <ChartTooltip content={<ChartTooltipContent />} />
                                            <defs>
                                                <linearGradient id="fillScore" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="hsl(var(--chart-3))" stopOpacity={0.8}/>
                                                    <stop offset="95%" stopColor="hsl(var(--chart-3))" stopOpacity={0.1}/>
                                                </linearGradient>
                                            </defs>
                                            <Area type="monotone" dataKey="score" fill="url(#fillScore)" stroke="hsl(var(--chart-3))" />
                                        </AreaChart>
                                    </ChartContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1 space-y-4 md:space-y-8">
                        {/* Quick Stats - Desktop Only */}
                        <div className="hidden lg:block">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><BarChart className="w-5 h-5" /> Quick Stats</CardTitle>
                                </CardHeader>
                                <CardContent className="grid grid-cols-2 gap-4">
                                    <div className="flex flex-col items-center justify-center p-4 bg-secondary rounded-lg">
                                        <span className="text-2xl font-bold">{averageScore}%</span>
                                        <span className="text-sm text-muted-foreground text-center">Average Score</span>
                                    </div>
                                    <div className="flex flex-col items-center justify-center p-4 bg-secondary rounded-lg">
                                        <span className="text-2xl font-bold">{highestScore}%</span>
                                        <span className="text-sm text-muted-foreground text-center">Highest Score</span>
                                    </div>
                                    <div className="flex flex-col items-center justify-center p-4 bg-secondary rounded-lg">
                                        <span className="text-2xl font-bold">{lowestScore}%</span>
                                        <span className="text-sm text-muted-foreground text-center">Lowest Score</span>
                                    </div>
                                    <div className="flex flex-col items-center justify-center p-4 bg-secondary rounded-lg">
                                        <span className="text-2xl font-bold">{passingRate}%</span>
                                        <span className="text-sm text-muted-foreground text-center">Passing Rate</span>
                                    </div>
                                    <div className="col-span-2">
                                        <p className="text-sm font-medium text-center">Quizzes Completed: {recentQuizzes.length} / {totalQuizzes + recentQuizzes.length}</p>
                                        <Progress value={(recentQuizzes.length / (totalQuizzes + recentQuizzes.length)) * 100} className="mt-2" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Trophy className="w-5 h-5" /> Achievements</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <AchievementList achievements={achievements} />
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}