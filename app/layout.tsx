import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

import { neobrutalism } from '@clerk/themes';

import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'

const inter = Inter({ subsets: ['latin'] })

const metadata: Metadata = {
  title: 'PDFNugget',
  description: 'Chat with me to summarize your PDF!'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: [neobrutalism],
        signIn: { baseTheme: neobrutalism },
      }}
    >
      <html lang="en">
        <body className={`${inter.className} min-h-screen h-screen overflow-hidden flex flex-col`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  )
}

export { metadata }
