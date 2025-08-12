import { User } from "@/model/user-model";
import { dbConnect } from "@/lib/mongo";

export async function getQuizzesForUser(email) {
    try {
        await dbConnect();
        const user = await User.findOne({ email }).select("quizzes").lean();
        // Sort quizzes by createdAt date in descending order (newest first)
        const quizzes = user ? user.quizzes : [];
        quizzes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        return quizzes;
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        return [];
    }
}

export async function addQuizToUser(email, quizData) {
    try {
        await dbConnect();
        // Add createdAt timestamp to the quiz data
        const quizWithTimestamp = { ...quizData, createdAt: new Date() };

        const result = await User.updateOne(
            { email },
            { $push: { quizzes: { $each: [quizWithTimestamp], $position: 0 } } }
        );

        if (result.modifiedCount === 0) {
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error("User not found.");
            }
            throw new Error("Failed to add quiz to user for an unknown reason.");
        }

        return { success: true, message: "Quiz added successfully." };
    } catch (error) {
        console.error("Error adding quiz to user:", error);
        throw error; // Re-throw to be handled by the API route
    }
}

export async function createUser(userData){
    try {
        const user = await User.create(userData)  // <-- Use userData instead of user
        return user;
    } catch (error) {
        throw new Error(error.message)  // Better to pass the error message as a string
    }
}