import "./globals.css";
import AuthProvider from "@components/providers/AuthProviders";
import NextUI from "@components/providers/NextUIProvider";
import Nav from "@components/Nav";

export const metadata = {
  title: {
    template: '%s | SCI',
    default: 'Home | SCI'
  },
  description: "Semana da Ciência e Inovação",
  metadataBase: new URL(process.env.PRODUCTION_URL)
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
