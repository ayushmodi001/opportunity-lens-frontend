"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { getLearningSuggestions, generatePersonalizedCourse } from '@/app/actions';
import { toast } from "sonner";
import Link from 'next/link';

export function AIAssistant({ quizzes = [], user }) {
    const router = useRouter();
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState(null);

    const weakQuizzes = quizzes.filter(quiz => quiz.score < 75);
    const weakSkills = [...new Set(weakQuizzes.flatMap(quiz => quiz.skills))];
    const hasLearningPath = user?.learningPath && user.learningPath.length > 0;

    const handleGetSuggestions = async () => {
        setIsLoading(true);
        setError(null);
        setSuggestions([]);

        try {
            const result = await getLearningSuggestions(weakSkills);
            if (result.error) {
                setError(result.error);
            } else {
                setSuggestions(result);
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGeneratePath = async () => {
        setIsGenerating(true);
        toast.info("Generating your personalized learning path... This may take a moment.");

        try {
            const result = await generatePersonalizedCourse(weakSkills);
            if (result?.success) {
                toast.success("New learning path created! Redirecting...");
                router.push('/learn');
            } else {
                throw new Error(result?.error || "An unknown error occurred.");
            }
        } catch (error) {
            toast.error(`Failed to create learning path: ${error.message}`);
            setIsGenerating(false);
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        AI Learning Assistant
                    </CardTitle>
                    <CardDescription className="mt-2">
                        Get course recommendations or generate a new learning path.
                    </CardDescription>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                    {hasLearningPath && (
                        <Link href="/learn">
                            <Button variant="secondary" size="sm">View Path</Button>
                        </Link>
                    )}
                    {weakSkills.length > 0 && (
                        <>
                            <Button onClick={handleGetSuggestions} disabled={isLoading || isGenerating} size="sm">
                                {isLoading ? 'Analyzing...' : 'Get Suggestions'}
                            </Button>
                            <Button onClick={handleGeneratePath} disabled={isGenerating || isLoading} size="sm" variant="outline">
                                {isGenerating ? 'Generating...' : 'Generate New Path'}
                            </Button>
                        </>
                    )}
                </div>
            </CardHeader>
            <CardContent>
                {weakSkills.length === 0 && !isLoading && !error && suggestions.length === 0 && (
                    <p className="text-sm font-medium text-green-600 text-center py-4">
                        Great job! You're scoring well in all your recent quizzes. Keep it up!
                    </p>
                )}

                {isLoading && (
                    <div className="space-y-2">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="animate-pulse flex space-x-4">
                                <div className="flex-1 space-y-2 py-1">
                                    <div className="h-4 bg-muted rounded w-3/4"></div>
                                    <div className="h-4 bg-muted rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {error && <p className="text-sm text-destructive text-center py-4">{error}</p>}

                {suggestions.length > 0 && (
                    <div className="mt-4">
                        <h4 className="font-semibold mb-2 text-sm">Recommended Courses:</h4>
                        <div className="grid.grid-cols-1.md:grid-cols-2.lg:grid-cols-3.gap-4">
                            {suggestions.map((course, index) => (
                                <div key={index} className="p-3 rounded-lg border bg-background hover:bg-muted/50 transition-colors flex flex-col">
                                    <Link href={course.link} target="_blank" rel="noopener noreferrer" className="flex-grow">
                                        <p className="font-semibold text-sm hover:text-primary transition-colors">{course.title}</p>
                                        <p className="text-xs text-muted-foreground mt-1 flex-grow">{course.description}</p>
                                    </Link>
                                    <p className="text-xs font-medium text-muted-foreground uppercase mt-2 pt-2 border-t border-border/40">{course.platform}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
