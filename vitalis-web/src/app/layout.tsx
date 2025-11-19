import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Vitalis OS - Veterinary Intelligence System',
  description: 'The world\'s most advanced Veterinary AI SaaS platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}

