"use client"
import React, { useState, useEffect } from 'react'
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
import { MultiSelect } from './ui/multi-select'
import { Checkbox } from './ui/checkbox'

export function TestPage({ userImage, userName }) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedLevel, setSelectedLevel] = useState(0);
    const [isDegreeTest, setIsDegreeTest] = useState(false);
    const [countdown, setCountdown] = useState(120);

    useEffect(() => {
        let timer;
        if (isLoading && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);
        } else if (!isLoading || countdown === 0) {
            clearInterval(timer);
        }
        return () => clearInterval(timer);
    }, [isLoading, countdown]);

    const handleStartAssessment = async () => {
        if (selectedItems.length === 0) {
            alert(`Please select at least one ${isDegreeTest ? 'degree' : 'subject'}.`);
            return;
        }
        
        setIsLoading(true);
        setCountdown(120); // Reset countdown

        const difficultyMap = ["Easy", "Medium", "Hard"];
        const payload = {
            skills: isDegreeTest ? [selectedItems.join(', ')] : selectedItems,
            difficulty: difficultyMap[selectedLevel],
            num_mcqs: 10,
            for_career_clarity: isDegreeTest,
        };

        try {
            const response = await fetch('https://ayush472-opportunity-t5-model.hf.space/generate-mcq/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-KEY': process.env.NEXT_PUBLIC_X_API_KEY,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`API request failed with status ${response.status}`);
            }

            const result = await response.json();
            console.log("API Response:", result);
            alert("Assessment generated successfully! Check the console for the response.");

        } catch (error) {
            console.error("API Error:", error);
            alert(`An error occurred: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTestTypeChange = (checked) => {
        setIsDegreeTest(checked);
        setSelectedItems([]); // Reset selections when changing test type
    };

    const finalUserImage = userImage && userImage.trim() !== "" ? userImage : "/Avatar21.svg";

    const subjects = [
        "JavaScript", "Python", "Java", "React", "Node.js", 
        "Data Structures", "Algorithms", "Machine Learning", 
        "Web Development", "Database Management"
    ];

    const degrees = [
        "Bachelor's of Technology in CSE", "Bachelor's of Architecture",
        "Bachelor's of Pharmacy", "Bachelor of Business Administration",
        "Bachelor of Technology in Fashion Design"
    ];

    const proficiencyLevels = ["Easy", "Medium", "Hard"];
    const currentOptions = isDegreeTest ? degrees : subjects;

    return (
        <>
            <div className="m-2 p-1 flex flex-col">
                <header>
                    <nav>
                        <div className="flex justify-between p-6 items-center h-16 rounded-2xl border-2 border-solid">
                            <div className="flex gap-1 items-center">
                                <Link href="/dashboard" className="flex items-center gap-1 hover:opacity-80 transition-opacity">
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
                                        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
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
                <div><BlurIn className="md:text-[35px] font-extrabold">Assessment Center</BlurIn></div>
                <div><StaggeredFade text={userName} className="md:text-[35px] text-primary font-extrabold"/></div>
            </div>

            <div className="m-4 p-8">
                <div className="flex flex-col md:flex-row items-center justify-center gap-16 max-w-6xl mx-auto">
                    <div className="w-full md:w-1/3 flex justify-center items-center">
                        <Image src="/testvector.svg" alt="Test Assessment Illustration" width={400} height={400} className="object-contain hover:scale-105 transition-transform duration-300"/>
                    </div>
                    
                    <Card className="w-full md:w-2/3 p-8 space-y-8 hover:shadow-xl transition-shadow duration-300">
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-center">Knowledge Assessment</h2>
                                <p className="text-muted-foreground text-center">Select your options and proficiency level to begin the test</p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center space-x-2 mb-4">
                                    <Checkbox id="degree-test-toggle" checked={isDegreeTest} onCheckedChange={handleTestTypeChange}/>
                                    <Label htmlFor="degree-test-toggle" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Tests After 10/12th Grade
                                    </Label>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="subject" className="text-lg font-medium">
                                        {isDegreeTest ? 'Select Degree' : 'Select Topics'}
                                    </Label>
                                    <MultiSelect
                                        options={currentOptions}
                                        selected={selectedItems}
                                        onChange={setSelectedItems}
                                        className="w-full"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <Label htmlFor="level" className="text-lg font-medium">Proficiency Level</Label>
                                    <div className="grid grid-cols-3 gap-4">
                                        {proficiencyLevels.map((level, index) => (
                                            <Button
                                                key={level}
                                                variant="outline"
                                                onClick={() => setSelectedLevel(index)}
                                                className={`w-full py-6 border-2 transition-all ${index === selectedLevel ? 'border-primary text-primary bg-primary/10' : 'hover:border-primary hover:text-primary'}`}
                                            >
                                                {level}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                <ShinyButton 
                                    onClick={handleStartAssessment}
                                    disabled={isLoading || selectedItems.length === 0}
                                    className={`w-full py-6 text-primary-foreground transition-all ${selectedItems.length === 0 ? 'bg-muted cursor-not-allowed' : 'bg-primary hover:bg-primary/90'}`}
                                >
                                    {isLoading ? 'Preparing Test...' : 'Start Assessment'}
                                </ShinyButton>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {isLoading && (
                <div className="fixed bottom-8 left-8 flex items-center gap-3 bg-background/80 backdrop-blur-sm p-4 rounded-full shadow-lg border border-primary/20">
                    <div className="relative w-6 h-6">
                        <div className="absolute w-6 h-6 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
                    </div>
                    <span className="text-sm font-medium text-primary">Preparing your test...</span>
                    <span className="text-xs text-muted-foreground">({countdown}s remaining)</span>
                </div>
            )}
        </>
    )
}
