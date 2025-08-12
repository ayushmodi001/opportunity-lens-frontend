"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Confetti from 'react-confetti';
import Link from 'next/link';

export function QuizPage({ quiz }) {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [score, setScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [timeLeft, setTimeLeft] = useState(quiz.questions.length * 60); // 1 minute per question

    const finishQuiz = useCallback(async () => {
        if (isFinished) return; 
        let finalScore = 0;
        quiz.questions.forEach((q, index) => {
            if (selectedAnswers[index] === q.correct_answer) {
                finalScore++;
            }
        });
        
        const percentageScore = (finalScore / quiz.questions.length) * 100;
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
    }, [isFinished, quiz, selectedAnswers]);

    useEffect(() => {
        if (isFinished) return;

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
    }, [isFinished, finishQuiz]);

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

    if (isFinished) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
                {score > 70 && <Confetti />}
                <Card className="w-full max-w-2xl text-center p-8">
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold">Quiz Completed!</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-5xl font-bold my-4 text-primary">{score.toFixed(2)}%</p>
                        <p className="text-muted-foreground">You answered {Math.round(score / 100 * quiz.questions.length)} out of {quiz.questions.length} questions correctly.</p>
                        <Button asChild className="mt-8">
                            <Link href="/dashboard">Back to Dashboard</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
            <Card className="w-full max-w-4xl">
                <CardHeader className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <Badge variant="secondary">{quiz.skills.join(', ')}</Badge>
                        <div className="text-lg font-semibold">
                            <span>{minutes}:{seconds < 10 ? `0${seconds}` : seconds}</span>
                        </div>
                    </div>
                    <Progress value={progress} className="w-full" />
                    <CardTitle className="text-2xl mt-4">{currentQuestion.question}</CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentQuestion.options.map((option, index) => (
                            <Button
                                key={index}
                                variant={selectedAnswers[currentQuestionIndex] === option ? 'default' : 'outline'}
                                onClick={() => handleAnswerSelect(option)}
                                className="h-auto py-4 text-left whitespace-normal"
                            >
                                {option}
                            </Button>
                        ))}
                    </div>
                    <div className="mt-6 flex justify-end">
                        <Button onClick={handleNextQuestion} disabled={selectedAnswers[currentQuestionIndex] === undefined}>
                            {currentQuestionIndex < quiz.questions.length - 1 ? 'Next' : 'Finish'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}