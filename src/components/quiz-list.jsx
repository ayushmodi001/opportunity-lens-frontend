"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

export function QuizList({ quizzes, completed = false }) {
  if (!quizzes || quizzes.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold">No Quizzes Found</h3>
        <p className="text-muted-foreground mt-2 mb-4">
          {completed ? "You haven't completed any assessments yet." : "There are no available assessments right now."}
        </p>
        {!completed && (
            <Link href="/test">
                <Button>Start a New Assessment</Button>
            </Link>
        )}
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {quizzes.map((quiz) => (
        <Card key={quiz._id} className="flex flex-col hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="truncate">{quiz.title || (quiz.skills && quiz.skills.length > 0 ? quiz.skills[0] : "Untitled Quiz")}</CardTitle>
            <div className="flex flex-wrap gap-2 pt-2">
              {quiz.skills.map((skill, index) => (
                <Badge key={index} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </CardHeader>
          <CardContent className="flex-grow flex flex-col justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Difficulty: <span className="font-medium text-primary">{quiz.difficulty}</span>
              </p>
              <p className="text-sm text-muted-foreground">
                Questions: <span className="font-medium text-primary">{quiz.questions.length}</span>
              </p>
              {completed && (
                <div className="mt-2 text-center p-2 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground">Your Score</p>
                  <p className="text-2xl font-bold text-primary">{Number(quiz.score).toFixed(1)}%</p>
                </div>
              )}
            </div>
            {completed ? (
              <Button disabled className="mt-4 w-full flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Completed
              </Button>
            ) : (
              <Button asChild className="mt-4 w-full">
                <Link href={`/quiz/${quiz._id}`} target="_blank" rel="noopener noreferrer">Start Quiz</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
