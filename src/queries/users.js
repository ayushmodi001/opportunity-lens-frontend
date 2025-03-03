import { User } from "@/model/user-model";

export async function createUser(userData){
    try {
        const user = await User.create(userData)  // <-- Use userData instead of user
        return user;
    } catch (error) {
        throw new Error(error.message)  // Better to pass the error message as a string
    }
}