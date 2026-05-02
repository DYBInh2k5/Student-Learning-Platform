import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Student Learning Platform',
  description: 'Learn programming with our community-driven platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}
