"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import ResultDisplay from "@/components/result-display"
import AnimatedBackground from "@/components/animated-background"

interface AnalysisResult {
  type: "file" | "url"
  name: string
  prediction: "real" | "fake"
  confidence: number
  fileUrl: string
}

export default function ResultsPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedResult = localStorage.getItem("deepcheck-result")
    if (storedResult) {
      setResult(JSON.parse(storedResult))
    } else {
      router.push("/")
    }
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col relative">
        <AnimatedBackground />
        <Navigation />
        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading results...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col relative">
        <AnimatedBackground />
        <Navigation />
        <div className="flex-1 flex items-center justify-center relative z-10">
          <div className="text-center">
            <p className="text-muted-foreground">No results found</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      <AnimatedBackground />
      <Navigation />
      <main className="flex-1 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <ResultDisplay result={result} />
        </div>
      </main>
      <Footer />
    </div>
  )
}
