import { auth } from "@/auth";
import { saveQuizForUser } from "@/queries/users";

export async function POST(request) {
    const session = await auth();
    if (!session?.user?.email) {
        return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    try {
        const { quizData } = await request.json();
        if (!quizData || !quizData.questions || !quizData.skills) {
            return new Response(JSON.stringify({ message: "Invalid quiz data provided." }), { status: 400 });
        }
        
        console.log("Received quiz data for user:", session.user.email);
        
        const result = await saveQuizForUser(session.user.email, quizData);

        return new Response(JSON.stringify({ message: result.message }), { status: 200 });

    } catch (error) {
        console.error("Error in /api/save-quiz:", error);
        
        let errorMessage = "Internal Server Error";
        if (error.message.includes("User not found")) {
            return new Response(JSON.stringify({ message: "User not found." }), { status: 404 });
        }
        if (error.name === 'ValidationError') {
            errorMessage = "Quiz data validation failed.";
            console.error("Validation Error Details:", JSON.stringify(error.errors, null, 2));
        }
        
        return new Response(JSON.stringify({ message: errorMessage }), { status: 500 });
    }
}
