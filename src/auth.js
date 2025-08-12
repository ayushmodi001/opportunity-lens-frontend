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
                    await dbConnect()
                    if(credentials == null) return null;
                    try {
                        const user = await User.findOne({email : credentials?.email})
                        if (user) {
                            const isMatch =  bcrypt.compare(
                                credentials.password,
                                user.password
                            );

                            if (isMatch) {
                                return {
                                    id: user._id,
                                    email: user.email,
                                    name: user.Username,
                                }
                            }else{
                                throw new Error("Check Your Credentials")
                            }
                        }else{
                            throw new Error("User Not Found")
                        }
                    } catch (error) {
                        throw new Error(error)
                    }
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