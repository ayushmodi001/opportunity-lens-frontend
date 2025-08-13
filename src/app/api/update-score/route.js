import { User } from "@/model/user-model";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongo";

export async function POST(request) {
    const session = await auth();
    if (!session?.user?.email) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    const { quizId, score } = await request.json();

    if (!quizId || typeof score !== 'number') {
        return new Response(JSON.stringify({ error: "Invalid request body" }), { status: 400 });
    }

    try {
        await dbConnect();
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
        }

        const quiz = user.quizzes.id(quizId);

        if (!quiz) {
            return new Response(JSON.stringify({ error: "Quiz not found" }), { status: 404 });
        }

        quiz.score = score;
        quiz.completedAt = new Date();

        if (score >= 80) {
            const achievementExists = user.achievements.some(ach => ach.quizName === quiz.skills.join(', '));
            if (!achievementExists) {
                user.achievements.push({
                    quizName: quiz.skills.join(', '),
                    score: score,
                });
            }
        }

        await user.save();

        return new Response(JSON.stringify({ message: "Score updated successfully" }), { status: 200 });

    } catch (error) {
        console.error("Error updating score:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}

