"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Confetti from 'react-confetti';
import Link from 'next/link';
import Image from 'next/image';
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Clock, AlertTriangle } from "lucide-react";
import { QuizAnalytics } from "@/components/quiz-analytics";

export function QuizPage({ quiz }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [timeLeft, setTimeLeft] = useState(quiz.questions.length * 60); // 1 minute per question
    const [violations, setViolations] = useState(0);
    const [showExitModal, setShowExitModal] = useState(false);
    const [quizStarted, setQuizStarted] = useState(false);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

    const finishQuiz = useCallback(async () => {
        if (isFinished) return; 
        let correctAnswers = 0;
        quiz.questions.forEach((q, index) => {
            if (selectedAnswers[index] === q.correct_answer) {
                correctAnswers++;
            }
        });
        
        const violationPenalty = violations * 1; // 1 point penalty per violation
        const finalScoreValue = Math.max(0, correctAnswers - violationPenalty);

        setCorrectAnswersCount(correctAnswers);
        const percentageScore = (finalScoreValue / quiz.questions.length) * 100;
        setScore(percentageScore);
        setIsFinished(true);

        try {
            await fetch(`/api/update-score`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ quizId: quiz._id, score: percentageScore }),
            });
        } catch (error) {
            console.error("Failed to update score:", error);
        }
    }, [isFinished, quiz, selectedAnswers, violations]);

    useEffect(() => {
        if (!quizStarted || isFinished) return;

        const handleFullscreenChange = () => {
            if (!document.fullscreenElement && !isFinished && quizStarted && !showExitModal) {
                setShowExitModal(true);
            }
        };

        document.addEventListener("fullscreenchange", handleFullscreenChange);

        return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
    }, [quizStarted, isFinished, showExitModal]);

    useEffect(() => {
        if (isFinished || showExitModal || !quizStarted) return;

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    finishQuiz();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isFinished, finishQuiz, showExitModal, quizStarted]);

    const handleAnswerSelect = (option) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [currentQuestionIndex]: option
        }));
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            finishQuiz();
        }
    };

    const handleStartQuiz = () => {
        setQuizStarted(true);
        document.documentElement.requestFullscreen().catch(err => {
          console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    };

    const handleContinueQuiz = () => {
        setShowExitModal(false);
        setViolations(prev => prev + 1);
        document.documentElement.requestFullscreen().catch(err => {
          console.error(`Error attempting to re-enable full-screen mode: ${err.message} (${err.name})`);
        });
    };

    const handleExitAndSubmit = () => {
        setShowExitModal(false);
        finishQuiz();
    };

    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
                <Card className="w-full max-w-2xl text-center p-8">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold">Quiz not found</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>The quiz you are looking for does not exist or has no questions.</p>
                        <Button asChild className="mt-8">
                            <Link href="/dashboard">Back to Dashboard</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const currentQuestion = quiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const totalTime = quiz.questions.length * 60;
    const timeUsed = totalTime - timeLeft;

    if (isFinished) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 sm:p-6 md:p-8">
                {score > 70 && <Confetti />}
                <div className="w-full max-w-4xl">
                    <Card className="w-full text-center p-6 sm:p-8 mb-8">
                        <CardHeader>
                            <CardTitle className="text-3xl sm:text-4xl font-bold">Quiz Completed!</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">Here is a summary of your performance.</p>
                        </CardContent>
                    </Card>
                    
                    <QuizAnalytics 
                        score={score}
                        correctCount={correctAnswersCount}
                        totalQuestions={quiz.questions.length}
                        timeUsed={timeUsed}
                        violations={violations}
                    />

                    <div className="text-center mt-8">
                        <Button asChild size="lg">
                            <Link href="/dashboard">Back to Dashboard</Link>
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (!quizStarted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
                <Card className="w-full max-w-2xl p-8">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-center">Quiz Disclaimer</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="text-center text-muted-foreground">
                            <p className="font-semibold text-lg">Please read the following rules carefully before you begin:</p>
                        </div>
                        <ul className="list-disc list-inside space-y-3 bg-secondary p-6 rounded-lg border">
                            <li>The quiz will be conducted in fullscreen mode to ensure a fair environment.</li>
                            <li>
                                <span className="font-bold text-destructive">Do not exit fullscreen or switch tabs.</span>
                            </li>
                            <li>Any attempt to exit fullscreen or switch to another tab will be considered a violation.</li>
                            <li>Marks will be deducted for each violation.</li>
                            <li>Make sure you have a stable internet connection before starting.</li>
                        </ul>
                        <div className="text-center">
                            <p className="text-sm text-muted-foreground">
                                By clicking "Start Quiz", you agree to abide by these rules.
                            </p>
                        </div>
                        <div className="flex justify-center mt-8">
                            <Button onClick={handleStartQuiz} size="lg">
                                Start Quiz
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-secondary">
            {showExitModal && (
                <div className="absolute inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
                    <Card className="w-full max-w-md p-8">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-center text-destructive">Violation Detected!</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center space-y-4">
                            <p className="text-muted-foreground">You have exited fullscreen mode. This is against the rules.</p>
                            <p>Do you want to continue the quiz (a penalty will be applied) or exit and submit your current answers?</p>
                            <div className="flex justify-around mt-6">
                                <Button variant="destructive" onClick={handleExitAndSubmit}>
                                    Exit & Submit
                                </Button>
                                <Button onClick={handleContinueQuiz}>
                                    Continue Quiz
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-b z-40">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between gap-6">
                    {/* Left Side: Logo & Title */}
                    <div className="flex items-center gap-4 flex-shrink-0">
                        <Image src="/logo.svg" alt="Opportunity Lens Logo" width={40} height={40} />
                        <div className="font-bold text-xl truncate hidden sm:block">
                            {quiz.skills.join(', ')}
                        </div>
                    </div>

                    {/* Middle: Timer */}
                    <div className="flex items-center gap-2 text-lg font-semibold text-primary">
                        <Clock className="h-5 w-5" />
                        <span>{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</span>
                    </div>

                    {/* Right Side: Actions & Status */}
                    <div className="flex items-center gap-4">
                        {violations > 0 && (
                            <div className="relative">
                                <div className="absolute -top-2 -right-2 h-6 w-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-xs font-bold">
                                    {violations}
                                </div>
                                <AlertTriangle className="h-6 w-6 text-destructive" />
                            </div>
                        )}
                        <ThemeToggle />
                        <Button 
                            onClick={finishQuiz}
                            disabled={Object.keys(selectedAnswers).length !== quiz.questions.length}
                            className="px-6 py-5 text-base"
                        >
                            Submit Quiz
                        </Button>
                    </div>
                </div>
            </header>

            <main className="flex-grow flex flex-col items-center justify-center pt-24 pb-20 px-4">
                <div className="w-full max-w-4xl">
                    <div className="text-center mb-8">
                        <p className="text-lg text-muted-foreground">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
                    </div>
                    <Card className="w-full shadow-2xl rounded-2xl border">
                        <CardHeader className="p-8">
                            <CardTitle className="text-4xl font-extrabold tracking-tight text-center">{currentQuestion.question}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-0">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {currentQuestion.options.map((option, index) => (
                                    <Button
                                        key={index}
                                        variant={selectedAnswers[currentQuestionIndex] === option ? 'default' : 'outline'}
                                        onClick={() => handleAnswerSelect(option)}
                                        className={`h-auto p-6 text-left whitespace-normal text-lg justify-start rounded-lg border-2 transition-all duration-200 transform hover:scale-105 ${selectedAnswers[currentQuestionIndex] === option ? 'border-primary' : 'border-border'}`}
                                    >
                                        <span className="mr-4 font-bold">{String.fromCharCode(65 + index)}.</span>
                                        <span className="flex-1">{option}</span>
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>

            <footer className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm border-t z-40">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Button 
                        variant="outline"
                        onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestionIndex === 0}
                        className="px-6 py-5 text-base"
                    >
                        Previous
                    </Button>
                    <div className="flex items-center gap-3 flex-wrap justify-center">
                        {quiz.questions.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentQuestionIndex(index)}
                                className={`h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200 border-2
                                    ${currentQuestionIndex === index 
                                        ? 'bg-primary text-primary-foreground border-primary scale-110 shadow-lg' 
                                        : selectedAnswers[index] !== undefined 
                                            ? 'bg-green-600/90 text-white border-green-700' 
                                            : 'bg-muted hover:bg-accent border-border'
                                    }
                                `}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                    <Button 
                        onClick={handleNextQuestion}
                        className="px-6 py-5 text-base"
                    >
                        {currentQuestionIndex < quiz.questions.length - 1 ? 'Next' : 'Finish'}
                    </Button>
                </div>
            </footer>
        </div>
    );
}