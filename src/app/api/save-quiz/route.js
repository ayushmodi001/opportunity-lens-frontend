import { User } from "@/model/user-model";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/mongo";

export async function POST(request) {
    const session = await auth();
    if (!session?.user?.email) {
        return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    }

    try {
        await dbConnect();
        const { quizData } = await request.json();
        console.log("Received quiz data:", JSON.stringify(quizData, null, 2));
        
        const user = await User.findOne({ email: session.user.email });
        if (!user) {
            return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
        }

        user.quizzes.push(quizData);
        await user.save();

        return new Response(JSON.stringify({ message: "Quiz saved successfully" }), { status: 200 });

    } catch (error) {
        if (error.name === 'ValidationError') {
            console.error("Validation Error Details:", JSON.stringify(error.errors, null, 2));
        } else {
            console.error("Error saving quiz:", error);
        }
        return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 });
    }
}
