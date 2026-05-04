import './globals.css'
import Navbar from '@/components/Navbar'
import SocialSideBar from '@/components/SocialSideBar'
import EmailSideBar from '@/components/EmailSideBar'
import { Geist, Geist_Mono, Syne } from "next/font/google"

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
})

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "500", "600", "700"],
})

export const metadata = {
  title: 'Ji Hun (Edward) Park — Developer',
  description: 'Frontend developer building toward full-stack.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${syne.variable}`}>
        <Navbar />
        <SocialSideBar />
        <EmailSideBar />
        {/* <Hero /> */}
        {children}
      </body>
    </html>
  )
}