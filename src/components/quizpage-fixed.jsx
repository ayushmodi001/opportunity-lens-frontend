"use client"

import React, { useState, useEffect, useCallback } from "react";
import { Clock, CheckCircle, XCircle, BarChart3, AlertTriangle } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import Image from "next/image";

// Chart components
const ChartContainer = ({ children, className, config }) => <div className={`w-full ${className || ""}`}>{children}</div>;
const ChartTooltip = ({ content }) => null;
const ChartTooltipContent = () => null;

// Quiz questions data
const quizQuestions = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
  },
  {
    id: 3,
    question: "What is 15 + 27?",
    options: ["41", "42", "43", "44"],
    correctAnswer: 1,
  },
  {
    id: 4,
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correctAnswer: 2,
  },
  {
    id: 5,
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
    correctAnswer: 3,
  },
  {
    id: 6,
    question: "Which programming language is known for web development?",
    options: ["Python", "JavaScript", "C++", "Java"],
    correctAnswer: 1,
  },
  {
    id: 7,
    question: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correctAnswer: 2,
  },
  {
    id: 8,
    question: "Which year did World War II end?",
    options: ["1944", "1945", "1946", "1947"],
    correctAnswer: 1,
  },
  {
    id: 9,
    question: "What is the square root of 64?",
    options: ["6", "7", "8", "9"],
    correctAnswer: 2,
  },
  {
    id: 10,
    question: "Which continent is the largest by area?",
    options: ["Africa", "Asia", "North America", "Europe"],
    correctAnswer: 1,
  },
];

const QUIZ_TIME_MINUTES = 15;
const QUIZ_TIME_SECONDS = QUIZ_TIME_MINUTES * 60;
const VIOLATION_PENALTY = 2;

export default function Quizpage() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState(Array(quizQuestions.length).fill(-1));
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIME_SECONDS);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [violations, setViolations] = useState(0);
  const [showViolationWarning, setShowViolationWarning] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted before using browser APIs
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fullscreen logic
  const enterFullscreen = useCallback(async () => {
    try {
      if (!mounted || typeof document === 'undefined') {
        return;
      }

      if (!document.documentElement.requestFullscreen) {
        console.warn("Fullscreen API not supported");
        return;
      }

      if (document.fullscreenElement) {
        return;
      }

      await document.documentElement.requestFullscreen();
    } catch (err) {
      console.error("Error attempting to enable fullscreen:", err);
    }
  }, [mounted]);

  const handleSubmitQuiz = useCallback(async () => {
    try {
      setQuizCompleted(true);
      setEndTime(new Date());
      
      if (document.fullscreenElement && document.exitFullscreen) {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Error submitting quiz:", err);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const handleFullscreenChange = () => {
      try {
        if (!quizStarted || quizCompleted) {
          return;
        }

        if (!document.fullscreenElement) {
          setViolations((prev) => prev + 1);
          setShowViolationWarning(true);

          setTimeout(() => {
            setShowViolationWarning(false);
          }, 3000);

          enterFullscreen();
        }
      } catch (err) {
        console.error("Error in fullscreen change handler:", err);
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [mounted, quizStarted, quizCompleted, enterFullscreen]);

  useEffect(() => {
    if (!quizStarted || quizCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, quizCompleted, handleSubmitQuiz]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStartQuiz = async () => {
    try {
      setQuizStarted(true);
      setStartTime(new Date());
      await enterFullscreen();
    } catch (err) {
      console.error("Error starting quiz:", err);
    }
  };

  const handleAnswerSelect = (answerIndex) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = () => {
    let correctAnswers = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === quizQuestions[index].correctAnswer) {
        correctAnswers++;
      }
    });

    const wrongAnswers = quizQuestions.length - correctAnswers;
    const baseScore = correctAnswers * 10;
    const violationPenalty = violations * VIOLATION_PENALTY;
    const finalScore = Math.max(0, baseScore - violationPenalty);
    const maxPossibleScore = quizQuestions.length * 10;
    const percentage = Math.round((finalScore / maxPossibleScore) * 100);
    const timeTaken =
      startTime && endTime ? Math.floor((endTime.getTime() - startTime.getTime()) / 1000) : QUIZ_TIME_SECONDS - timeLeft;

    return {
      correctAnswers,
      wrongAnswers,
      timeTaken,
      percentage,
      totalQuestions: quizQuestions.length,
      baseScore,
      violationPenalty,
      finalScore,
      maxPossibleScore,
      violations,
    };
  };

  const results = quizCompleted ? calculateResults() : null;

  // Show loading until component is mounted (prevents SSR issues)
  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="text-lg text-foreground">Loading Quiz...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Chart data
  const pieChartData = results
    ? [
        { name: "Correct", value: results.correctAnswers, fill: "hsl(var(--chart-1))" },
        { name: "Wrong", value: results.wrongAnswers, fill: "hsl(var(--chart-2))" },
      ]
    : [];

  const timeChartData = results
    ? [
        { name: "Time Used", value: Math.floor(results.timeTaken / 60), fill: "hsl(var(--chart-3))" },
        {
          name: "Time Remaining",
          value: Math.floor((QUIZ_TIME_SECONDS - results.timeTaken) / 60),
          fill: "hsl(var(--chart-4))",
        },
      ]
    : [];

  const scoreChartData = results
    ? [
        { name: "Base Score", value: results.baseScore, fill: "hsl(var(--chart-1))" },
        { name: "Penalty", value: results.violationPenalty, fill: "hsl(var(--chart-2))" },
      ]
    : [];

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header with logo and theme toggle */}
        <header className="border-b border-border">
          <div className="flex justify-between items-center p-6 max-w-6xl mx-auto">
            <div className="flex items-center gap-3">
              <Image src="/logo.svg" alt="Opportunity Lens" width={32} height={32} />
              <h1 className="text-xl font-bold text-foreground">Opportunity Lens</h1>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <div className="flex items-center justify-center p-4 min-h-[calc(100vh-80px)]">
          <Card className="w-full max-w-md shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-foreground">Quiz Challenge</CardTitle>
              <CardDescription className="text-muted-foreground">Test your knowledge with 10 questions in 15 minutes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-foreground">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">Time Limit: 15 minutes</span>
                </div>
                <div className="flex items-center gap-3 text-foreground">
                  <BarChart3 className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium">10 Multiple Choice Questions</span>
                </div>
                <div className="flex items-center gap-3 text-foreground">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  <span className="text-sm font-medium">Quiz will enter fullscreen mode</span>
                </div>
              </div>
              <div className="bg-secondary border border-border rounded-lg p-4">
                <p className="text-sm text-foreground">
                  <strong>Important:</strong> Exiting fullscreen during the quiz will result in violations and mark
                  deduction (2 points per violation).
                </p>
              </div>
              <Button 
                onClick={handleStartQuiz} 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3 rounded-lg transition-colors"
                size="lg"
              >
                Start Quiz
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (quizCompleted && results) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header with logo and theme toggle */}
        <header className="border-b border-border">
          <div className="flex justify-between items-center p-6 max-w-6xl mx-auto">
            <div className="flex items-center gap-3">
              <Image src="/logo.svg" alt="Opportunity Lens" width={32} height={32} />
              <h1 className="text-xl font-bold text-foreground">Opportunity Lens</h1>
            </div>
            <ThemeToggle />
          </div>
        </header>

        <div className="p-4">
          <div className="w-full max-w-7xl mx-auto space-y-6">
            <Card className="shadow-lg">
              <CardHeader className="text-center bg-primary text-primary-foreground rounded-t-lg">
                <CardTitle className="text-3xl font-bold">Quiz Results</CardTitle>
                <CardDescription className="text-primary-foreground/80">Here's how you performed!</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                  <Card className="border-2 border-green-500/20 hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold text-green-600">{results.correctAnswers}</div>
                      <div className="text-sm text-muted-foreground font-medium">Correct</div>
                    </CardContent>
                  </Card>
                  <Card className="border-2 border-red-500/20 hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold text-red-600">{results.wrongAnswers}</div>
                      <div className="text-sm text-muted-foreground font-medium">Wrong</div>
                    </CardContent>
                  </Card>
                  <Card className="border-2 border-primary/20 hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold text-primary">{results.percentage}%</div>
                      <div className="text-sm text-muted-foreground font-medium">Final Score</div>
                    </CardContent>
                  </Card>
                  <Card className="border-2 border-chart-3/20 hover:shadow-md transition-shadow">
                    <CardContent className="p-4 text-center">
                      <div className="text-3xl font-bold" style={{ color: "hsl(var(--chart-3))" }}>{formatTime(results.timeTaken)}</div>
                      <div className="text-sm text-muted-foreground font-medium">Time Taken</div>
                    </CardContent>
                  </Card>
                  <Card className={`border-2 hover:shadow-md transition-shadow ${results.violations > 0 ? "border-destructive/20 bg-destructive/5" : "border-green-500/20 bg-green-50 dark:bg-green-950/20"}`}>
                    <CardContent className="p-4 text-center">
                      <div className={`text-3xl font-bold ${results.violations > 0 ? "text-destructive" : "text-green-600"}`}>
                        {results.violations}
                      </div>
                      <div className="text-sm text-muted-foreground font-medium">Violations</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Score Breakdown */}
                <Card className="mb-6 border-2 border-border">
                  <CardHeader className="bg-muted">
                    <CardTitle className="text-lg text-foreground">Score Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center py-2 border-b border-border">
                        <span className="text-foreground">Base Score ({results.correctAnswers} × 10 points)</span>
                        <span className="font-bold text-green-600 text-lg">+{results.baseScore}</span>
                      </div>
                      {results.violations > 0 && (
                        <div className="flex justify-between items-center py-2 border-b border-border">
                          <span className="text-foreground">
                            Violation Penalty ({results.violations} × {VIOLATION_PENALTY} points)
                          </span>
                          <span className="font-bold text-destructive text-lg">-{results.violationPenalty}</span>
                        </div>
                      )}
                      <div className="border-t-2 border-border pt-3 flex justify-between items-center text-lg font-bold">
                        <span className="text-foreground">Final Score</span>
                        <span className="text-primary text-xl">
                          {results.finalScore}/{results.maxPossibleScore}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border-2 border-border hover:shadow-lg transition-shadow">
                    <CardHeader className="bg-primary text-primary-foreground">
                      <CardTitle className="text-lg">Answer Distribution</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <ChartContainer
                        config={{
                          correct: { label: "Correct", color: "hsl(var(--chart-1))" },
                          wrong: { label: "Wrong", color: "hsl(var(--chart-2))" },
                        }}
                        className="h-[200px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={pieChartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={40}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {pieChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.fill} />
                              ))}
                            </Pie>
                            <ChartTooltip content={<ChartTooltipContent />} />
                          </PieChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-border hover:shadow-lg transition-shadow">
                    <CardHeader className="bg-secondary text-secondary-foreground">
                      <CardTitle className="text-lg">Time Usage (Minutes)</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <ChartContainer
                        config={{
                          used: { label: "Time Used", color: "hsl(var(--chart-3))" },
                          remaining: { label: "Time Remaining", color: "hsl(var(--chart-4))" },
                        }}
                        className="h-[200px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={timeChartData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="value" fill="hsl(var(--chart-3))" radius={4} />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-border hover:shadow-lg transition-shadow">
                    <CardHeader className="bg-accent text-accent-foreground">
                      <CardTitle className="text-lg">Score Impact</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <ChartContainer
                        config={{
                          base: { label: "Base Score", color: "hsl(var(--chart-1))" },
                          penalty: { label: "Penalty", color: "hsl(var(--chart-2))" },
                        }}
                        className="h-[200px]"
                      >
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={scoreChartData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Bar dataKey="value" fill="hsl(var(--chart-1))" radius={4} />
                          </BarChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    </CardContent>
                  </Card>
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-bold text-foreground mb-6">Question Review</h3>
                  <div className="space-y-4">
                    {quizQuestions.map((question, index) => {
                      const userAnswer = selectedAnswers[index];
                      const isCorrect = userAnswer === question.correctAnswer;
                      return (
                        <Card
                          key={question.id}
                          className={`border-l-4 hover:shadow-md transition-shadow ${isCorrect ? "border-l-green-500 bg-green-50 dark:bg-green-950/20" : "border-l-red-500 bg-red-50 dark:bg-red-950/20"}`}
                        >
                          <CardContent className="p-5">
                            <div className="flex items-start gap-4">
                              {isCorrect ? (
                                <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                              ) : (
                                <XCircle className="w-6 h-6 text-red-500 mt-0.5 flex-shrink-0" />
                              )}
                              <div className="flex-1">
                                <p className="font-semibold text-foreground text-lg mb-3">{question.question}</p>
                                <div className="space-y-2">
                                  <p className="text-sm">
                                    <span className="font-semibold text-foreground">Your answer:</span>{" "}
                                    <span
                                      className={`font-medium ${
                                        userAnswer === -1
                                          ? "text-muted-foreground"
                                          : isCorrect
                                            ? "text-green-600"
                                            : "text-red-600"
                                      }`}
                                    >
                                      {userAnswer === -1 ? "Not answered" : question.options[userAnswer]}
                                    </span>
                                  </p>
                                  {!isCorrect && (
                                    <p className="text-sm">
                                      <span className="font-semibold text-foreground">Correct answer:</span>{" "}
                                      <span className="text-green-600 font-medium">{question.options[question.correctAnswer]}</span>
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-8 text-center">
                  <Button 
                    onClick={() => {
                      try {
                        window.location.reload();
                      } catch (err) {
                        console.error("Error reloading page:", err);
                        // Fallback: reset component state
                        setCurrentQuestion(0);
                        setSelectedAnswers(Array(quizQuestions.length).fill(-1));
                        setTimeLeft(QUIZ_TIME_SECONDS);
                        setQuizStarted(false);
                        setQuizCompleted(false);
                        setStartTime(null);
                        setEndTime(null);
                        setViolations(0);
                        setShowViolationWarning(false);
                      }
                    }} 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all"
                    size="lg"
                  >
                    Take Quiz Again
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = quizQuestions[currentQuestion];
  const allQuestionsAnswered = selectedAnswers.every((answer) => answer !== -1);

  return (
    <div className="min-h-screen bg-background">
      {/* Header with logo and theme toggle */}
      <header className="border-b border-border">
        <div className="flex justify-between items-center p-6 max-w-6xl mx-auto">
          <div className="flex items-center gap-3">
            <Image src="/logo.svg" alt="Opportunity Lens" width={32} height={32} />
            <h1 className="text-xl font-bold text-foreground">Opportunity Lens</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="p-4">
        {/* Violation Warning */}
        {showViolationWarning && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-destructive text-destructive-foreground px-6 py-4 rounded-lg shadow-2xl animate-bounce">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6" />
              <span className="font-bold text-lg">
                Violation Detected! Returning to fullscreen. 2 points deducted. Total: {violations}
              </span>
            </div>
          </div>
        )}
        
        {/* Fullscreen Header */}
        <div className="fixed top-4 left-4 right-4 z-40 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Timer */}
            <div
              className={`
              flex items-center gap-3 px-5 py-3 rounded-full font-mono text-base font-bold backdrop-blur-sm shadow-lg
              ${
                timeLeft < 300
                  ? "bg-destructive/10 text-destructive border-2 border-destructive/30"
                  : "bg-primary/10 text-primary border-2 border-primary/30"
              }
            `}
            >
              <Clock className="w-5 h-5" />
              {formatTime(timeLeft)}
            </div>
            
            {/* Question indicator */}
            <Badge className="bg-background/95 text-foreground border-2 border-border px-4 py-2 text-sm font-bold shadow-lg">
              Question {currentQuestion + 1} of {quizQuestions.length}
            </Badge>
            
            {/* Violations counter */}
            {violations > 0 && (
              <Badge className="bg-destructive/95 text-destructive-foreground border-2 border-destructive px-4 py-2 text-sm font-bold shadow-lg">
                <AlertTriangle className="w-4 h-4 mr-2" />
                {violations} Violations
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {/* Submit button */}
            <Button
              onClick={handleSubmitQuiz}
              disabled={!allQuestionsAnswered}
              className={`
              px-6 py-3 rounded-full font-bold text-base transition-all duration-300 shadow-lg
              ${
                allQuestionsAnswered
                  ? "bg-green-600 hover:bg-green-700 text-white shadow-green-200 hover:shadow-xl"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
              }
            `}
            >
              Submit Quiz
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full px-6 pt-24 pb-8 space-y-8">
          {/* Question Card */}
          <Card className="shadow-2xl max-w-5xl mx-auto border-2 border-border bg-card/95 backdrop-blur-sm">
            <CardHeader className="pb-6 bg-primary text-primary-foreground rounded-t-lg">
              <CardTitle className="text-2xl leading-relaxed font-bold">
                {currentQ.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-6">
              {currentQ.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedAnswers[currentQuestion] === index ? "default" : "outline"}
                  className={`w-full justify-start text-left h-auto p-6 text-lg transition-all duration-300 hover:shadow-lg border-2 ${
                    selectedAnswers[currentQuestion] === index
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground border-primary shadow-lg"
                      : "bg-background hover:bg-accent text-foreground border-border hover:border-primary/50"
                  }`}
                  onClick={() => handleAnswerSelect(index)}
                >
                  <span className={`mr-4 font-bold text-xl min-w-[2rem] ${
                    selectedAnswers[currentQuestion] === index ? "text-primary-foreground" : "text-primary"
                  }`}>
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span className="flex-1 font-medium">{option}</span>
                </Button>
              ))}
            </CardContent>
          </Card>
          
          {/* Navigation */}
          <Card className="shadow-lg max-w-5xl mx-auto border-2 border-border bg-card/95 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestion === 0}
                  className="px-8 py-3 text-lg bg-background border-2 border-border hover:border-primary hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ← Previous
                </Button>
                
                <div className="flex gap-3 flex-wrap justify-center">
                  {quizQuestions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentQuestion(index)}
                      className={`
                      w-12 h-12 rounded-full text-sm font-bold transition-all duration-300 border-2
                      ${
                        currentQuestion === index
                          ? "bg-primary text-primary-foreground shadow-lg border-primary scale-110"
                          : selectedAnswers[index] !== -1
                            ? "bg-green-500 text-white border-green-500 hover:scale-105"
                            : "bg-background text-foreground border-border hover:bg-accent hover:border-primary/50"
                      }
                    `}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>
                
                <Button
                  onClick={handleNextQuestion}
                  disabled={currentQuestion === quizQuestions.length - 1}
                  className="px-8 py-3 text-lg bg-primary hover:bg-primary/90 text-primary-foreground border-2 border-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next →
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
