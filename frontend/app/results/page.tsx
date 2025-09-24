"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import AnimatedBackground from "@/components/animated-background"

interface AnalysisResult {
  prediction: "real" | "fake"
  confidence: number
  realism: number
  deepfake: number
  fileUrl: string
}

export default function ResultsPage() {
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedResult = localStorage.getItem("deepcheck-result")
    if (storedResult) {
      try {
        const parsed = JSON.parse(storedResult)
        if (parsed.fileUrl && parsed.Realism !== undefined && parsed.Deepfake !== undefined) {
          const realism = parsed.Realism
          const deepfake = parsed.Deepfake
          const prediction = realism > 0.75 ? "real" : "fake"
          const confidence = prediction === "real" ? Math.round(realism * 100) : Math.round(Math.max(deepfake, realism) * 100)
          setResult({ ...parsed, prediction, confidence, realism, deepfake })
        } else {
          setResult(parsed)
        }
      } catch {
        setResult(null)
      }
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
          <p className="text-muted-foreground">No results found</p>
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
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
          {/* File Preview */}
          {result.fileUrl && (
            <div className="flex justify-center mb-6">
              {result.fileUrl.endsWith(".mp4") || result.fileUrl.endsWith(".mov") || result.fileUrl.endsWith(".avi") ? (
                <video src={result.fileUrl} controls className="max-h-96 rounded-lg" />
              ) : (
                <img src={result.fileUrl} alt="preview" className="max-h-96 rounded-lg object-contain" />
              )}
            </div>
          )}

          {/* Result Info */}
          <div className="text-center space-y-2">
            <p className="text-lg font-medium">Prediction: {result.prediction.toUpperCase()}</p>
            <p className="text-muted-foreground">Confidence: {result.confidence}%</p>
            <p className="text-sm text-muted-foreground">
              Realism: {(result.realism * 100).toFixed(2)}%, Deepfake: {(result.deepfake * 100).toFixed(2)}%
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
