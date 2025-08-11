"use client"
import React, { useState } from 'react'
import { Card } from './ui/card'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { AvatarWithDropdown } from "./ui/avatar-with-dropdown"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import BlurIn from "./animTxt"
import StaggeredFade from "./an3"
import ShinyButton from "@/components/ui/shinyButton"
import Image from "next/image"
import Link from "next/link"

export function TestPage({ userImage, userName }) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedSubject, setSelectedSubject] = useState("");
    const [selectedLevel, setSelectedLevel] = useState(0);

    const handleStartAssessment = () => {
        if (!selectedSubject) {
            alert("Please select a subject first");
            return;
        }
        setIsLoading(true);
        // Simulate the 70-second API call
        setTimeout(() => {
            setIsLoading(false);
            // Handle the API response here
        }, 70000); // 70 seconds
    };

    const finalUserImage = userImage && userImage.trim() !== "" ? userImage : "/Avatar21.svg";

    const subjects = [
        "JavaScript",
        "Python",
        "Java",
        "React",
        "Node.js",
        "Data Structures",
        "Algorithms",
        "Machine Learning",
        "Web Development",
        "Database Management"
    ]

    const proficiencyLevels = [
        "Beginner",
        "Intermediate",
        "Advanced"
    ]

    return (
        <>
            <div className="m-2 p-1 flex flex-col">
                <header>
                    <nav>
                        <div className="flex justify-between p-6 items-center h-16 rounded-2xl border-2 border-solid">
                            <div className="flex gap-1 items-center">                                <Link href="/dashboard" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
                                    <img src="/logo.svg" alt="logo" className="h-8"/>
                                    <BlurIn className="md:text-lg">Opportunity Lens</BlurIn>
                                </Link>
                            </div>
                            <div className="flex items-center gap-6">
                                <Link 
                                    href="/dashboard" 
                                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border/40 hover:bg-accent transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="3" width="7" height="7"/>
                                        <rect x="14" y="3" width="7" height="7"/>
                                        <rect x="14" y="14" width="7" height="7"/>
                                        <rect x="3" y="14" width="7" height="7"/>
                                    </svg>
                                    <span className="hidden md:inline">Dashboard</span>
                                </Link>
                                <ThemeToggle/>
                                <AvatarWithDropdown userImage={finalUserImage}/>
                            </div>
                        </div>
                    </nav>
                </header>
            </div>

            <div className="m-3 p-1 flex flex-row items-center justify-center gap-2 border-2 border-solid rounded-2xl">
                <div>
                    <BlurIn className="md:text-[35px] font-extrabold">Assessment Center</BlurIn>
                </div>
                <div>
                    <StaggeredFade text={userName} className="md:text-[35px] text-primary font-extrabold"/>
                </div>
            </div>

            <div className="m-4 p-8">
                <div className="flex flex-col md:flex-row items-center justify-center gap-16 max-w-6xl mx-auto">
                    <div className="w-full md:w-1/3 flex justify-center items-center">
                        <Image
                            src="/testvector.svg"
                            alt="Test Assessment Illustration"
                            width={400}
                            height={400}
                            className="object-contain hover:scale-105 transition-transform duration-300"
                        />
                    </div>
                    
                    <Card className="w-full md:w-2/3 p-8 space-y-8 hover:shadow-xl transition-shadow duration-300">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-center">Knowledge Assessment</h2>
                                <p className="text-muted-foreground text-center">Select a subject and your proficiency level to begin the test</p>
                            </div>

                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="subject" className="text-lg font-medium">Select Subject</Label>
                                    <select 
                                        id="subject"
                                        value={selectedSubject}
                                        onChange={(e) => setSelectedSubject(e.target.value)}
                                        className="w-full p-3 rounded-lg border-2 border-input bg-background hover:border-primary transition-colors"
                                    >
                                        <option value="">Choose a subject...</option>
                                        {subjects.map((subject) => (
                                            <option key={subject} value={subject}>{subject}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="level" className="text-lg font-medium">Proficiency Level</Label>
                                    <div className="grid grid-cols-3 gap-4">
                                        {proficiencyLevels.map((level, index) => (
                                            <Button
                                                key={level}
                                                variant="outline"
                                                onClick={() => setSelectedLevel(index)}
                                                className={`w-full py-6 border-2 transition-all ${
                                                    index === selectedLevel 
                                                        ? 'border-primary text-primary bg-primary/10' 
                                                        : 'hover:border-primary hover:text-primary'
                                                }`}
                                            >
                                                {level}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <ShinyButton 
                                    onClick={handleStartAssessment}
                                    disabled={isLoading || !selectedSubject}
                                    className={`w-full py-6 text-primary-foreground transition-all ${
                                        !selectedSubject 
                                            ? 'bg-muted cursor-not-allowed' 
                                            : 'bg-primary hover:bg-primary/90'
                                    }`}
                                >
                                    {isLoading ? 'Preparing Test...' : 'Start Assessment'}
                                </ShinyButton>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Loading Clock - Only shown when isLoading is true */}
            {isLoading && (
                <div className="fixed bottom-8 left-8 flex items-center gap-3 bg-background/80 backdrop-blur-sm p-4 rounded-full shadow-lg border border-primary/20">
                    <div className="relative w-6 h-6">
                        <div className="absolute w-6 h-6 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                    </div>
                    <span className="text-sm font-medium text-primary">Preparing your test...</span>
                    <span className="text-xs text-muted-foreground">(~70s)</span>
                </div>
            )}
        </>
    )
}
