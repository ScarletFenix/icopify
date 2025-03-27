// app/layout.jsx
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Providers } from './providers'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata = {
  title: "TopUrlz - Guest Posting Platform",
  description: "Premium guest posting and backlink services",
  icons: {
    icon: '/logoipsum-327.svg',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-white text-gray-900`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}