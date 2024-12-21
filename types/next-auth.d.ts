// types/next-auth.d.ts
import { Role } from "@node_modules/.prisma/client";
import { JWT } from "next-auth/jwt"
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: Role;
      [key: string]: any; // Add dynamic properties
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name: string;
    role: Role;
    [key: string]: any; // Add dynamic properties
  }
}