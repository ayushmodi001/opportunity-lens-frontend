import { User } from "@/model/user-model";
import { dbConnect } from "@/lib/mongo";

export async function getQuizzesForUser(email) {
    try {
        await dbConnect();
        const user = await User.findOne({ email: email }).lean();
        return user ? user.quizzes : [];
    } catch (error) {
        console.error("Error fetching quizzes for user:", error);
        throw new Error("Failed to fetch quizzes.");
    }
}

export async function findUserByCredentials(credentials) {
    try {
        await dbConnect();
        const user = await User.findOne({ email: credentials.email }).lean();
        return user;
    } catch (error) {
        console.error("Error finding user by credentials:", error);
        throw new Error("Failed to find user.");
    }
}

export async function registerUser(data) {
    try {
        await dbConnect();
        const userToInsert = data.user ? data.user : data;
        const newUser = await User.create(userToInsert);
        return newUser;
    } catch (error) {
        console.error("Error registering user:", error);
        throw new Error("Failed to register user.");
    }
}

export async function updateSocialUser(user) {
    try {
        await dbConnect();
        const filter = { email: user.email };
        const update = {
            $set: {
                // Use the name from the social provider for the Username field
                Username: user.name, 
                image: user.image,
            },
        };
        // Create the user if they don't exist, and return the new document
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };
        const updatedUser = await User.findOneAndUpdate(filter, update, options);
        return updatedUser;
    } catch (error) {
        console.error("Error updating social user:", error);
        throw new Error("Failed to update social user.");
    }
}

export async function saveQuizForUser(email, quizData) {
    try {
        await dbConnect();
        const result = await User.updateOne(
            { email: email },
            { $push: { quizzes: quizData } }
        );
        return result;
    } catch (error) {
        console.error("Error saving quiz for user:", error);
        throw new Error("Failed to save quiz.");
    }
}