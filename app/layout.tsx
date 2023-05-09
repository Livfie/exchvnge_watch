import './globals.css'
import { Inter } from 'next/font/google'
import AppHeader from './components/app_header'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Watch @ Exchvnge',
  description: 'Watch Live Events | Exchvnge',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AppHeader />
        {children}
      </body>
    </html>
  )
}
