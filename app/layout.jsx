import './globals.css'

import Navbar from '@/components/Nav'
import ServerComponentExample from "@/components/ServerComponentExample";
import "./globals.css";
import AuthProvider from "@/components/AuthProviders";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";

export const metadata = {
  title: 'SCI',
  description: 'jornadas da ciencia',
}

export default async function RootLayout({ children }) {
  const session = await getServerSession(authOptions);
  
  console.log("Session: ",session)

  return (
    <html lang="en">
      <AuthProvider>
        <body>
          <Navbar />
          <ServerComponentExample session={session}/>
          {children}
          </body>
      </AuthProvider>
    </html>
  );
}
