"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { getLearningSuggestions } from '@/app/actions';
import Link from 'next/link';

export function AIAssistant({ quizzes }) {
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const weakQuizzes = quizzes.filter(quiz => quiz.score < 75);
    const weakSkills = [...new Set(weakQuizzes.flatMap(quiz => quiz.skills))];

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

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    AI Learning Assistant
                </CardTitle>
                <CardDescription>
                    Get personalized YouTube video suggestions to improve in your weak areas.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {weakSkills.length > 0 ? (
                    <>
                        <p className="text-sm text-muted-foreground mb-4">
                            We've noticed you could improve in the following areas: <span className="font-semibold text-primary">{weakSkills.join(', ')}</span>.
                        </p>
                        <Button onClick={handleGetSuggestions} disabled={isLoading}>
                            {isLoading ? 'Analyzing...' : 'Get Video Suggestions'}
                        </Button>
                    </>
                ) : (
                    <p className="text-sm font-medium text-green-600">
                        Great job! You're scoring well in all your recent quizzes. Keep it up!
                    </p>
                )}

                {isLoading && (
                    <div className="mt-4 space-y-2">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="animate-pulse flex space-x-4">
                                <div className="rounded-md bg-muted h-16 w-28"></div>
                                <div className="flex-1 space-y-2 py-1">
                                    <div className="h-4 bg-muted rounded w-3/4"></div>
                                    <div className="h-4 bg-muted rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {error && <p className="mt-4 text-sm text-destructive">{error}</p>}

                {suggestions.length > 0 && (
                    <div className="mt-6">
                        <h4 className="font-semibold mb-4">Recommended Videos:</h4>
                        <div className="space-y-4">
                            {suggestions.map((video, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <Link href={video.link} target="_blank" rel="noopener noreferrer" className="block w-28 flex-shrink-0">
                                        <img src={video.thumbnail} alt={video.title} className="rounded-md object-cover w-full h-16 transition-transform hover:scale-105" />
                                    </Link>
                                    <div className="flex-1">
                                        <Link href={video.link} target="_blank" rel="noopener noreferrer">
                                            <p className="font-semibold text-sm hover:text-primary transition-colors">{video.title}</p>
                                        </Link>
                                        <p className="text-xs text-muted-foreground">{video.channel}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
