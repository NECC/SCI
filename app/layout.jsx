import "./globals.css";
import Navbar from "@/components/Nav";
import "./globals.css";
import AuthProvider from "@components/providers/AuthProviders";
import NextUI from "@components/providers/NextUIProvider";
import Providers from "@components/providers/Providers";


export const metadata = {
  title: "SCI",
  description: "jornadas da ciencia",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NextUI>
          <AuthProvider>
            <Providers>
              {children}
            </Providers>
          </AuthProvider>
        </NextUI>
      </body>
    </html>
  );
}
