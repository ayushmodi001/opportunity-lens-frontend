import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { dbConnect } from "@/lib/mongo";
import React from 'react'
import { Timeline } from "@/components/ui/timeline";
import { AvatarWithDropdown } from "@/components/ui/avatar-with-dropdown";
import Link from "next/link";
import BlurIn from "@/components/animTxt";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export default async function page() {
    const session = await auth()
    
    if(!session?.user) redirect("/unauthorized")

    await dbConnect();
    const { User } = await import("@/model/user-model");
    const user = await User.findOne({ email: session.user.email }).lean();
    const userImage = session?.user?.image && session.user.image.trim() !== "" ? session.user.image : "/Avatar21.svg";

    // This will be fetched from the database later
    const modules = [
        {
            title: "Module 1: Introduction to Programming",
            chapters: [
                {
                    title: "Chapter 1: Getting Started",
                    subTopics: [
                        { title: "What is Programming?", demoLink: "/learn/demo/intro-to-programming/chapter-1/sub-1" },
                        { title: "Setting up your environment", demoLink: "/learn/demo/intro-to-programming/chapter-1/sub-2" },
                    ]
                },
                {
                    title: "Chapter 2: Variables and Data Types",
                    subTopics: [
                        { title: "Understanding Variables", demoLink: "/learn/demo/intro-to-programming/chapter-2/sub-1" },
                        { title: "Exploring Data Types", demoLink: "/learn/demo/intro-to-programming/chapter-2/sub-2" },
                    ]
                },
            ],
            quiz: {
                id: "quiz1",
                title: "Module 1 Assessment",
                description: "Test your knowledge on the basics of programming.",
            },
        },
        {
            title: "Module 2: Data Structures",
            chapters: [
                {
                    title: "Chapter 1: Arrays",
                    subTopics: [
                        { title: "Introduction to Arrays", demoLink: "/learn/demo/data-structures/chapter-1/sub-1" },
                        { title: "Array Operations", demoLink: "/learn/demo/data-structures/chapter-1/sub-2" },
                    ]
                },
            ],
            quiz: {
                id: "quiz2",
                title: "Module 2 Assessment",
                description: "Test your knowledge on data structures.",
            },
        },
        {
            title: "End Assessment",
            chapters: [],
            quiz: {
                id: "final-assessment",
                title: "Final Course Assessment",
                description: "This is the final assessment to complete the course.",
            },
        }
    ];

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
                                                <Link href={subTopic.demoLink} key={subTopicIndex} passHref>
                                                    <Button variant="link" className="justify-start">
                                                        {subTopic.title}
                                                    </Button>
                                                </Link>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    )}
                    <div className="flex gap-4 mt-4">
                        <Link href={`/quiz/${module.quiz.id}`} passHref>
                            <Button>{module.quiz.title}</Button>
                        </Link>
                    </div>
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