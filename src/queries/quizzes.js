import { User } from "@/model/user-model";
import { dbConnect } from "@/lib/mongo";

export async function getQuizById(quizId) {
    try {
        await dbConnect();
        const user = await User.findOne({ "quizzes._id": quizId });
        if (!user) {
            return null;
        }
        const quiz = user.quizzes.id(quizId);
        return quiz;
    } catch (error) {
        console.error("Error fetching quiz by ID:", error);
        return null;
    }
}

export async function updateUserQuizScore(quizId, score) {
    try {
        await dbConnect();
        const result = await User.updateOne(
            { "quizzes._id": quizId },
            { $set: { "quizzes.$.score": score } }
        );

        if (result.nModified === 0) {
            throw new Error("Quiz not found or score not updated.");
        }

        return { success: true, message: "Score updated successfully." };
    } catch (error) {
        console.error("Error updating quiz score:", error);
        throw error;
    }
}
