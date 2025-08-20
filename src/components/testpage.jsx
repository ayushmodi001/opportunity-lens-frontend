"use client"
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
import { toast } from "sonner";
import { Checkbox } from './ui/checkbox'
import { generatePersonalizedCourse } from '@/app/actions';

export function TestPage({ userImage, userName }) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedItems, setSelectedItems] = useState([]);
    const [selectedLevel, setSelectedLevel] = useState(0);
    const [isDegreeTest, setIsDegreeTest] = useState(false);
    const [countdown, setCountdown] = useState(120);
    const [generatedQuiz, setGeneratedQuiz] = useState(null);
    const [isSaved, setIsSaved] = useState(false);

    // Effect for the countdown timer
    useEffect(() => {
        let timer;
        if (isLoading && countdown > 0) {
            timer = setInterval(() => {
                setCountdown((prevCountdown) => prevCountdown - 1);
            }, 1000);
        } else if (isLoading && countdown === 0) {
            // Timer ran out, but we're still loading. Extend the timer.
            setCountdown(60);
        }
        return () => clearInterval(timer);
    }, [isLoading, countdown]);

    // Effect to save quiz if user leaves the page
    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (generatedQuiz && !isSaved) {
                const difficultyMap = ["Easy", "Medium", "Hard"];
                const quizData = {
                    skills: isDegreeTest ? [selectedItems.join(', ')] : selectedItems,
                    difficulty: difficultyMap[selectedLevel],
                    questions: generatedQuiz.mcqs,
                    topic_counts: generatedQuiz.topic_counts,
                };
                const blob = new Blob([JSON.stringify({ quizData })], { type: 'application/json; charset=UTF-8' });
                navigator.sendBeacon('/api/save-quiz', blob);
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [generatedQuiz, isSaved, selectedItems, selectedLevel, isDegreeTest]);


    const saveQuiz = async (quizResult) => {
        const difficultyMap = ["Easy", "Medium", "Hard"];
        const quizData = {
            skills: isDegreeTest ? [selectedItems.join(', ')] : selectedItems,
            difficulty: difficultyMap[selectedLevel],
            questions: quizResult.mcqs,
            topic_counts: quizResult.topic_counts,
        };

        try {
            const saveResponse = await fetch('/api/save-quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quizData }),
            });

            if (!saveResponse.ok) {
                throw new Error('Failed to save the quiz.');
            }
            
            setIsSaved(true);
            toast.success("Assessment generated and saved successfully!");
            router.push('/dashboard');

        } catch (saveError) {
            console.error("Failed to save quiz:", saveError);
            toast.error(`Assessment generated but failed to save: ${saveError.message}`);
        }
    };

    const handleStartAssessment = async () => {
        if (selectedItems.length === 0) {
            toast.warning(`Please select at least one ${isDegreeTest ? 'degree' : 'subject'}.`);
            return;
        }
        
        setIsLoading(true);
        setCountdown(120); // Reset countdown
        setGeneratedQuiz(null);
        setIsSaved(false);

        const difficultyMap = ["Easy", "Medium", "Hard"];
        const payload = {
            skills: isDegreeTest ? [selectedItems.join(', ')] : selectedItems,
            difficulty: difficultyMap[selectedLevel],
            num_mcqs: 10,
            for_career_clarity: isDegreeTest,
        };

        console.log("Sending payload to API:", JSON.stringify(payload, null, 2));

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
            setGeneratedQuiz(result);
            await saveQuiz(result);

        } catch (error) {
            console.error("API Error:", error);
            toast.error(`An error occurred: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateCourse = async () => {
        if (selectedItems.length === 0) {
            toast.warning(`Please select at least one subject.`);
            return;
        }
        if (isDegreeTest) {
            toast.info("Course generation is available for topics, not degrees.");
            return;
        }

        toast.info("Generating your personalized learning path... This may take a moment.");
        
        try {
            const result = await generatePersonalizedCourse(selectedItems);
            if (result?.success) {
                toast.success("Learning path created! You can view it on the Learn page.");
                router.push('/learn');
            } else {
                throw new Error(result?.error || "An unknown error occurred.");
            }
        } catch (error) {
            console.error("Failed to generate course:", error);
            toast.error(`Failed to create learning path: ${error.message}`);
        }
    };

    const handleTestTypeChange = (checked) => {
        setIsDegreeTest(checked);
        setSelectedItems([]); // Reset selections when changing test type
    };

    const finalUserImage = userImage && userImage.trim() !== "" ? userImage : "/Avatar21.svg";

    const subjects = [
        "programming in C", "programming in C++", "programming in Java", "programming in Python", "programming in JavaScript", "HTML", "CSS", "React", "Angular", "Node.js", "data structures - arrays", "data structures - linked lists", "data structures - stacks", "data structures - queues", "data structures - trees", "data structures - graphs", "algorithms - sorting", 
        "algorithms - searching", "algorithms - graph algorithms", "operating systems - process management", "operating systems - memory management", "database management - SQL", "database management - NoSQL", "database management - MongoDB", "database management - PostgreSQL", "database management - MySQL", "software development lifecycle", 
        "version control - Git", "debugging techniques", "unit testing", "integration testing", "web technologies", "mobile app development - Android", "mobile app development - iOS", "mobile app development - Flutter", "mobile app development - Swift", "mobile app development - Kotlin", "cloud computing - AWS", "cloud computing - Azure", "cloud computing - Google Cloud", 
        "machine learning - supervised learning", "machine learning - unsupervised learning", "deep learning", "neural networks", "natural language processing", "computer vision", "transformers", "cybersecurity principles", "penetration testing", "ethical hacking", "DevOps practices", "Agile methodology", "Scrum", "Kanban", "containerization - Docker", "containerization - Kubernetes", 
        "RESTful APIs", "microservices architecture", "blockchain basics", "smart contracts - Solidity", "systems programming", "embedded systems programming", "functional programming", "concurrency", "parallel programming", "big data technologies - Hadoop", "big data technologies - Spark", "data visualization - Tableau", "data visualization - Power BI", "data visualization - Matplotlib", 
        "data visualization - Seaborn", "data visualization - D3.js", "computer graphics", "distributed systems", "communication skills", "teamwork", "project management", "engineering mechanics", "thermodynamics", "fluid mechanics", "heat transfer", "materials science", "machine design", "manufacturing processes", "control systems", "robotics", "CAD software - SolidWorks", 
        "CAD software - AutoCAD", "CAD software - CATIA", "CAM technologies", "finite element analysis - FEA", "vibration analysis", "hydraulics", "pneumatics", "automation and control", "electric vehicles technology", "renewable energy systems", "AI in manufacturing", "prototyping", "3D printing", "machining and fabrication", "maintenance engineering", "quality control", 
        "structural analysis", "concrete and steel design", "surveying techniques", "soil mechanics", "geotechnical engineering", "construction management", "transportation engineering", "water resources engineering", "environmental engineering", "building information modeling - BIM", "project scheduling", "cost estimation", "safety management", "sustainable construction practices", 
        "urban planning", "site engineering", "quantity surveying", "road and highway design", "analog electronics", "digital electronics", "signals and systems", "communication theory", "microprocessors", "microcontrollers", "VLSI design", "wireless communication", "antenna design", "circuit simulation - MATLAB", "circuit simulation - Multisim", "FPGA programming - Verilog", 
        "FPGA programming - VHDL", "Internet Of Things","Embedded Systems", "Embedded Devices", "PCB design", "telecommunications protocols", "network security", "signal processing", "assembly language programming", "circuit design", "electrical machines", "power systems", "power electronics", "instrumentation", "PLC programming", "SCADA systems", "MATLAB/Simulink", "automation systems", "smart grids", 
        "fault diagnosis", "energy management", "Bash scripting", "PowerShell scripting", "UI/UX design", "data analytics", "chemical process design", "reaction engineering", "process control", "HAZOP analysis", "Aspen Plus", "HYSYS", "biochemical engineering", "polymer science", "nanotechnology basics", "aerodynamics", "flight mechanics", "propulsion systems", "avionics", 
        "computational fluid dynamics - CFD", "navigation systems", "propulsion testing", "AI for aerospace", "biomedical instrumentation", "medical imaging technologies", "biomechanics", "clinical engineering", "prosthetics design", "medical device regulatory compliance", "tissue engineering", "biochemistry", "microbiology", "biotechnology processes", "environmental monitoring", 
        "food technology", "home science", "agricultural engineering", "soil science", "crop management", "pest control", "farm mechanization", "architecture design principles", "sustainability in architecture", "criminal law", "civil law", "international law", "public administration", "political theory", "sociology", "anthropology", "cognitive psychology", "clinical psychology", "developmental psychology", "microeconomics", 
        "macroeconomics", "econometrics", "statistical analysis - SPSS", "statistical analysis - R", "statistical analysis - Stata", "strategic management", "digital marketing", "business analytics", "entrepreneurship", "finance", "taxation", "banking", "human resource management", "marketing research", "journalism", "content creation", "media studies"

    ];

    const degrees = [
        "bachelor's of technology in computer science", "bachelor's of technology in mechanical engineering", "bachelor's of technology in civil engineering", "bachelor's of technology in electronics and communication", "bachelor's of technology in electrical engineering", "bachelor's of technology in information technology", 
        "bachelor's of technology in chemical engineering", "bachelor's of technology in aerospace engineering", "bachelor's of technology in artificial intelligence and data science", "bachelor's of technology in biomedical engineering", "bachelor's of arts in english literature", "bachelor's of arts in political science", 
        "bachelor's of arts in economics", "bachelor's of arts in psychology", "bachelor's of arts in history", "bachelor's of arts in sociology", "bachelor's of arts in philosophy", "bachelor's of arts in journalism and mass communication", "bachelor's of arts in anthropology", "bachelor's of arts in fine arts", "bachelor's of science in physics", 
        "bachelor's of science in chemistry", "bachelor's of science in mathematics", "bachelor's of science in biotechnology", "bachelor's of science in microbiology", "bachelor's of science in environmental science", "bachelor's of science in computer science", "bachelor's of science in zoology", "bachelor's of science in botany", "bachelor's of science in statistics", 
        "bachelor's of commerce in accounting and finance", "bachelor's of commerce in banking and insurance", "bachelor's of commerce in economics", "bachelor's of commerce in taxation", "bachelor's of commerce in business administration", "bachelor's of commerce in marketing and advertising", "bachelor's of commerce in human resource management", 
        "bachelor's of commerce in international business", "bachelor's of commerce in cost and management accounting", "bachelor of business administration in finance", "bachelor of business administration in human resource management", "bachelor of business administration in marketing", "bachelor of business administration in entrepreneurship", 
        "bachelor of management studies in strategic management", "bachelor of business studies in international business", "bachelor of business administration in hospitality management", "bachelor of management studies in operations and analytics", "bachelor of business administration in digital marketing", "bachelor of management studies in business analytics", 
        "bachelor of law in civil law", "bachelor of law in criminal law", "bachelor of law in international law", "bachelor of law in labour law", "bachelor of medicine and bachelor of surgery (MBBS)", "bachelor of pharmacy general", "bachelor of pharmacy honours", "bachelor's of pharmacy in pharmaceutical chemistry", "bachelor's of pharmacy in pharmacology", 
        "bachelor's of pharmacy in pharmaceutical biotechnology", "bachelor's of pharmacy in pharmaceutical analysis", "bachelor's of pharmacy in clinical pharmacy", "bachelor of architecture", "bachelor of agriculture", "bachelor of ayurvedic medicine and surgery (BAMS)", "bachelor of science in software engineering", "bachelor's of technology in cyber physical systems", 
        "bachelor's of science in environmental engineering", "bachelor's of arts in multimedia and mass communication", "bachelor's of science in biomedical science", "bachelor's of science in food technology", "bachelor's of science in instrumentation", "bachelor's of science in polymer science", "bachelor's of science in food technology", "bachelor's of science in home science", 
        "bachelor of elementary education", "bachelor of science in biochemistry", "bachelor's of technology in medical coding", "bachelor's of technology in musopathy"
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

                                <div className="relative flex py-2 items-center">
                                    <div className="flex-grow border-t border-muted-foreground"></div>
                                    <span className="flex-shrink mx-4 text-muted-foreground">Or</span>
                                    <div className="flex-grow border-t border-muted-foreground"></div>
                                </div>

                                <Button
                                    variant="outline"
                                    onClick={handleGenerateCourse}
                                    disabled={isDegreeTest || selectedItems.length === 0}
                                    className="w-full py-6"
                                >
                                    Just Generate Learning Path
                                </Button>
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
