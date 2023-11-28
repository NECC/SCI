import './globals.css'

import Navbar from '@/components/Nav'
import "./globals.css";
import AuthProvider from "@/components/AuthProviders";

export const metadata = {
  title: 'SCI',
  description: 'jornadas da ciencia',
}

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <AuthProvider>
        <body>
          <Navbar />
          {children}
          </body>
      </AuthProvider>
    </html>
  );
}
