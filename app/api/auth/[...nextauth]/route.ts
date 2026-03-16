import NextAuth from "next-auth/next";
import { NextRequest } from "next/server";
import { authOptions } from "@lib/auth";

const handler = async (req: NextRequest, context: any) => {
  // console.log("THIS IS AN HANDLER\n", req.url);

  if (req.method == "HEAD") {
    return new Response(null, { status: 200 });
  }

  return await NextAuth(req, context, authOptions);
};

export { handler as GET, handler as POST, handler as HEAD };
