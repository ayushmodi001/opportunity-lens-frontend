import { updateUserQuizScore } from "@/queries/quizzes";
import { auth } from "@/auth";

export async function POST(request) {
    const session = await auth();
    if (!session?.user?.email) {
        return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    try {
        const { quizId, score } = await request.json();
        if (!quizId || typeof score !== 'number') {
            return new Response(JSON.stringify({ message: "Invalid data provided." }), { status: 400 });
        }

        const result = await updateUserQuizScore(quizId, score);

        return new Response(JSON.stringify({ message: result.message }), { status: 200 });

    } catch (error) {
        console.error("Error in /api/update-score:", error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
}
