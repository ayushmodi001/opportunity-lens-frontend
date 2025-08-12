"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function QuizList({ quizzes }) {
  if (!quizzes || quizzes.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold">No Quizzes Found</h3>
        <p className="text-muted-foreground mt-2 mb-4">
          You haven't taken any assessments yet.
        </p>
        <Link href="/test">
          <Button>Start a New Assessment</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {quizzes.map((quiz) => (
        <Card key={quiz._id} className="flex flex-col hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex flex-wrap gap-2">
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
            </div>
            <Button asChild className="mt-4 w-full">
              <Link href={`/quiz/${quiz._id}`} target="_blank" rel="noopener noreferrer">Start Quiz</Link>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
