import "./globals.css";
import AuthProvider from "@components/providers/AuthProviders";
import NextUI from "@components/providers/NextUIProvider";
import Nav from "@components/Nav";

export const metadata = {
  title: {
    template: '%s | Sci',
    default: 'Home | Sci'
  },
  description: "Jornadas da Ciência",
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <NextUI>
          <AuthProvider>
            <Nav />
            {children}
          </AuthProvider>
        </NextUI>
      </body>
    </html >
  );
}
