import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import { findUserByCredentials } from "@/queries/users";
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
                    const user = await findUserByCredentials(credentials);

                    if (user) {
                        const isMatch = await bcrypt.compare(
                            credentials.password,
                            user.password
                        );

                        if (isMatch) {
                            return user;
                        }
                    }
                } catch (error) {
                    console.error("Authorization Error:", error);
                    throw new Error("Authentication failed.");
                }
                
                return null;
            }
        })
    ]
})