import './globals.css'
import Nav from '@/components/Nav'


export const metadata = {
  title: 'SCI',
  description: 'jornadas da ciencia',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        {children}
      </body>
    </html>
  )
}
