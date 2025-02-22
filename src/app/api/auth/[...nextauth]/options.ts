import { NextAuthOptions } from "next-auth";
import CredentialsProvider  from "next-auth/providers/credentials";

import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import { UserModel } from "@/model/user";


 const  authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",

      credentials: {
        //TODO: maybe ill need to comeback here since it feels wrong in some sense
        email: { label: "Email", type: "text"},
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
          throw new Error("Invalid email or password");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessage = user.isAcceptingMessage;
        token.username = user.username;
      }

      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id as string;
        session.user.isVerified = token.isVerified as boolean;
        session.user.isAcceptingMessage = token.isAcceptingMessage as boolean;
        session.user.username = token.username  as string;
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


 export default authOptions;