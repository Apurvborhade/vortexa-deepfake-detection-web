import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "DeepCheck - Detect Deepfakes Instantly",
  description: "Upload an image or video and find out if it's real or fake using advanced AI detection.",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="font-sans bg-background text-foreground">
        <div className="min-h-screen bg-gradient-to-br from-background to-black/50">{children}</div>
        <Toaster />
      </body>
    </html>
  )
}
