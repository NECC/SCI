import { NextAuthOptions } from "@node_modules/next-auth";
 import CredentialsProvider from "next-auth/providers/credentials";
 import { PrismaClient } from "@prisma/client";
 import { PrismaAdapter } from "@auth/prisma-adapter";
 import bcrypt from "bcrypt";
 
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