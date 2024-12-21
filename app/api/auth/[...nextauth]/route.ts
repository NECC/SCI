import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcrypt";
import { NextRequest } from "@node_modules/next/server";
import { NextAuthOptions } from "@node_modules/next-auth";

const prisma = new PrismaClient();
export const authOptions: NextAuthOptions = {
  pages: {
    signIn: "/auth/signin",
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email" },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Password",
        },
      },
      async authorize(credentials) {
        try {
          const findUser = await prisma.user.findUnique({
            where: {
              email: credentials.email,
            },
          });

          if (findUser) {
            // console.log("User Exists!");

            const match = await bcrypt.compare(
              credentials.password,
              findUser.password
            );

            if (match) {
              // console.log("Passwords Match!");
              delete findUser.password;
              return findUser;
            }
          }
        } catch (error) {
          // console.log(error);
          return null;
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      return { ...token, ...user };
    },
    async session({ session, token }) {
      session.user = token;
      return session;
    },
  },
  session: { strategy: "jwt" }
};

const handler = async (req: NextRequest, context) => {
  // console.log("THIS IS AN HANDLER\n", req.url);

  if (req.method == "HEAD") {
    return new Response(null, { status: 200 });
  }

  return await NextAuth(req, context, authOptions);
};

export { handler as GET, handler as POST, handler as HEAD };
