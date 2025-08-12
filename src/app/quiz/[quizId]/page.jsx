import { QuizPage } from "@/components/quizpage";
import { getQuizById } from "@/queries/quizzes";
import { notFound } from "next/navigation";

export default async function Page({ params }) {
    const { quizId } = params;
    const quiz = await getQuizById(quizId);

    if (!quiz) {
        notFound();
    }

    // We need to serialize the quiz object to pass it to the client component
    const serializedQuiz = JSON.parse(JSON.stringify(quiz));

    return <QuizPage quiz={serializedQuiz} />;
}
