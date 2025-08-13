import NextAuth from "next-auth";
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from "next-auth/providers/credentials"
// import {getUserByEmail} from "./data/users"
import { dbConnect } from "@/lib/mongo";

import {User} from "./model/user-model";
import bcrypt from "bcryptjs";


export const {
    handlers :  {GET, POST},
    auth,
    signIn,
    signOut,
}  = NextAuth({
    session : {
        strategy : "jwt"
    },
        providers : [
            CredentialsProvider({
                async authorize(credentials) {
                    if (credentials == null) return null;
                    
                    try {
                        await dbConnect();
                        const user = await User.findOne({ email: credentials.email });

                        if (user) {
                            const isMatch = await bcrypt.compare(
                                credentials.password,
                                user.password
                            );

                            if (isMatch) {
                                return {
                                    id: user._id,
                                    email: user.email,
                                    name: user.Username,
                                };
                            }
                        }
                    } catch (error) {
                        console.error("Authorization Error:", error);
                        // To prevent revealing whether a user exists, we'll fall through and return null,
                        // but you could also throw a specific error for logging if needed.
                    }
                    
                    return null; // Return null for any failed authentication attempt
                }
            }),
            GoogleProvider({
                clientId : process.env.GOOGLE_CLIENT_ID,
                clientSecret : process.env.GOOGLE_CLIENT_SECRET,

                authorization : {
                    params: {
                        prompt : "consent",
                        access_type : "offline",
                        response_type : "code",
                    }
                }
            })
        ]
})