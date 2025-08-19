import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { findUserByCredentials, updateSocialUser, findUserByEmail } from "@/queries/users";
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
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
        CredentialsProvider({
            async authorize(credentials) {
                if (credentials == null) return null;
                
                try {
                    const user = await findUserByCredentials(credentials);

                    if (user) {
                        if (!user.password) {
                            return null;
                        }

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
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (account.provider === "google") {
                try {
                    await updateSocialUser({
                        name: profile.name,
                        email: profile.email,
                        image: profile.picture,
                    });
                    return true;
                } catch (error) {
                    console.error("Google sign-in DB error:", error);
                    return false;
                }
            }
            return true;
        },
        async jwt({ token, user }) {
            if (user) {
                const dbUser = await findUserByEmail(user.email);
                if (dbUser) {
                    token.id = dbUser._id;
                }
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id;
            }
            return session;
        },
    },
})