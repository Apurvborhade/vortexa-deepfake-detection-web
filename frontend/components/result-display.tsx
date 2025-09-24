"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, XCircle, ArrowLeft, AlertTriangle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import Image from "next/image"

interface AnalysisResult {
  type: "file" | "url"
  name: string
  prediction: "real" | "fake"
  confidence: number
  fileUrl: string
}

interface ResultDisplayProps {
  result: AnalysisResult
}

export default function ResultDisplay({ result }: ResultDisplayProps) {
  const router = useRouter()
  const [imageError, setImageError] = useState(false)

  const isReal = result.prediction === "real"
  const isVideo =
    result.name.toLowerCase().includes(".mp4") ||
    result.name.toLowerCase().includes(".mov") ||
    result.name.toLowerCase().includes(".avi") ||
    result.type === "url"

  const handleBackToHome = () => {
    localStorage.removeItem("deepcheck-result")
    router.push("/")
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Analysis Complete</h1>
        <p className="text-muted-foreground">
          Results for: <span className="font-medium">{result.name}</span>
        </p>
      </div>

      {/* Media Display */}
      <div className="flex justify-center">
        <div className="max-w-md w-full">
          <div className="aspect-video bg-card/50 border border-border/40 rounded-lg overflow-hidden">
            {isVideo ? (
              <video
                src={result.fileUrl}
                controls
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              >
                Your browser does not support the video tag.
              </video>
            ) : !imageError ? (
              <Image
                src={result.fileUrl || "/placeholder.svg"}
                alt="Uploaded content"
                width={400}
                height={300}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2" />
                  <p>Unable to display media</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results Card */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-card/50 border border-border/40 rounded-lg p-8 backdrop-blur-sm">
          {/* Prediction Result */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className={`p-4 rounded-full ${isReal ? "bg-green-500/10" : "bg-red-500/10"}`}>
                {isReal ? (
                  <CheckCircle className="h-12 w-12 text-green-500" />
                ) : (
                  <XCircle className="h-12 w-12 text-red-500" />
                )}
              </div>
            </div>

            <h2 className="text-3xl font-bold mb-2">
              <span className={isReal ? "text-green-500" : "text-red-500"}>{isReal ? "REAL" : "FAKE"}</span>
            </h2>

            <p className="text-muted-foreground">
              This content appears to be {isReal ? "authentic" : "artificially generated"}
            </p>
          </div>

          {/* Confidence Score */}
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center">
              <span className="font-medium">Confidence Score</span>
              <span className="text-2xl font-bold">{result.confidence}%</span>
            </div>

            <Progress value={result.confidence} className="h-3" />

            <p className="text-sm text-muted-foreground">
              Our AI model is {result.confidence}% confident in this prediction
            </p>
          </div>

          {/* Additional Info */}
          <div className="bg-accent/20 border border-border/40 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="space-y-2 text-sm">
                <p className="font-medium">Analysis Details:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Facial inconsistency detection</li>
                  <li>• Temporal artifact analysis</li>
                  <li>• Compression pattern examination</li>
                  <li>• Neural network verification</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-yellow-500 mb-1">Important Disclaimer</p>
                <p className="text-muted-foreground">
                  This analysis is for informational purposes only. While our AI achieves high accuracy, no detection
                  system is 100% perfect. Always verify important content through multiple sources.
                </p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button onClick={handleBackToHome} className="w-full h-12 text-lg font-medium" size="lg">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Analyze Another File
          </Button>
        </div>
      </div>
    </div>
  )
}
