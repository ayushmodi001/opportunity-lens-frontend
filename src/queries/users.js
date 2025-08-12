import { User } from "@/model/user-model";
import { dbConnect } from "@/lib/mongo";

export async function getQuizzesForUser(email) {
    try {
        await dbConnect();
        const user = await User.findOne({ email }).select("quizzes").lean();
        return user ? user.quizzes : [];
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        return [];
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