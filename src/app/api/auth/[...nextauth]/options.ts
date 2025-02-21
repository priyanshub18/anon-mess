import { NextAuthOptions } from "next-auth";
import { CredentialsProvider } from "next-auth/providers";

import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/user";

export const authOptions: NextAuthOptions = {
  providers: [
    // @ts-ignore
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",

      credentials: {
        identifier: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          if (!user) {
            throw new Error("User not found");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your email");
          }

          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password,
          );
          if (isPasswordCorrect) {
            return user;
          }
          throw new Error("Invalid password");
        } catch (error) {
          console.log(error);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAccepting = user.isAccepting;
        token.username = user.username;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        // @ts-ignore
        session.user._id = token._id;
        // @ts-ignore
        session.user.isVerified = token.isVerified;
        // @ts-ignore
        session.user.isAccepting = token.isAccepting;
        // @ts-ignore
        session.user.username = token.username;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
