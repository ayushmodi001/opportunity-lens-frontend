import { auth } from "@/auth"
import { dbConnect } from "@/lib/mongo";
import React from 'react'
import { Timeline } from "@/components/ui/timeline";
import { AvatarWithDropdown } from "@/components/ui/avatar-with-dropdown";
import Link from "next/link";
import BlurIn from "@/components/animTxt";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";

export default async function page() {
    const session = await auth()
    
    if(!session?.user) redirect("/unauthorized")

    await dbConnect();
    const { User } = await import("@/model/user-model");
    const user = await User.findOne({ email: session.user.email }).lean();
    const userImage = session?.user?.image && session.user.image.trim() !== "" ? session.user.image : "/Avatar21.svg";

    const modules = user?.learningPath && user.learningPath.length > 0 ? user.learningPath : [];

    const data = modules.map((module, moduleIndex) => ({
        title: module.title,
        content: (
            <Card>
                <CardContent className="flex flex-col gap-4 pt-6">
                    {module.chapters && module.chapters.length > 0 && (
                        <Accordion type="single" collapsible className="w-full">
                            {module.chapters.map((chapter, chapterIndex) => (
                                <AccordionItem value={`item-${moduleIndex}-${chapterIndex}`} key={chapterIndex}>
                                    <AccordionTrigger>{chapter.title}</AccordionTrigger>
                                    <AccordionContent>
                                        <div className="flex flex-col gap-2 pl-4">
                                            {chapter.subTopics.map((subTopic, subTopicIndex) => (
                                                <Link
                                                    href={subTopic.demoLink || "#"}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    key={subTopicIndex}
                                                    className={cn(buttonVariants({ variant: "link", className: "justify-start" }))}
                                                >
                                                    {subTopic.title}
                                                </Link>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    )}
                </CardContent>
            </Card>
        )
    }));

  return (
    <div className="min-h-screen bg-background">
        <div className="max-w-[1600px] mx-auto px-2 sm:px-4 py-2">
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
            <main className="flex-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Your Learning Path</CardTitle>
                        <CardDescription>Complete the modules to unlock new quizzes and achievements.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Timeline data={data} />
                    </CardContent>
                </Card>
            </main>
        </div>
    </div>
  )
}