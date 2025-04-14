import { NextAuthOptions, AdapterUser } from "@node_modules/next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcrypt";
import { Role } from "@prisma/client";

const prisma = new PrismaClient();
declare module "@node_modules/next-auth" {
  interface AdapterUser {
    role?: Role;
  }
  interface User {
    role?: Role;
  }
}

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
      async authorize(credentials, req) {
        if (!credentials) {
          return null;
        }
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
              const { password, ...userWithoutPassword } = findUser;
              //delete findUser.password;
              return userWithoutPassword;
            }
          }

          return null;

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
      if (user) {
        console.log("User in JWT callback", user);
        token.id = user.id;
        token.email = user.email ?? "";
        token.name = user.name ?? "";
        token.role = user.role ?? "USER"; // assuming your user model includes role
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.role = token.role as Role;
      }
      return session;
    },
  },
  session: { strategy: "jwt" }
};