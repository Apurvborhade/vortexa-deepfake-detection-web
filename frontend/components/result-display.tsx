"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle, XCircle, ArrowLeft, AlertTriangle, Info, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface AnalysisResult {
  prediction: "real" | "fake"
  confidence: number
  realism: number
  deepfake: number
}

interface ResultDisplayProps {
  result: AnalysisResult,
  heatmap: any
}

export default function ResultDisplay({ result, heatmap }: ResultDisplayProps) {
  const router = useRouter()

  const isReal = result.prediction === "real"
  
  console.log(heatmap)
  const handleBackToHome = () => {
    localStorage.removeItem("deepcheck-result")
    localStorage.removeItem("deepcheck-heatmap")
    router.push("/")
  }

  // Prepare heatmap image src if available and valid
  let heatmapImgSrc: string | null = null
  // Try to robustly parse the heatmap value, which may be a JSON string or base64 string
  if (typeof heatmap === "string" && heatmap.length > 0 && heatmap != undefined) {
    // Try to parse if it's a JSON string (from localStorage)
    try {
      const parsed = JSON.parse(heatmap)
      if (typeof parsed === "string" && parsed.length > 0) {
        heatmapImgSrc = `data:image/jpeg;base64,${parsed}`
      }
    } catch {
      // Not JSON, assume it's already base64
      heatmapImgSrc = `data:image/jpeg;base64,${heatmap}`
    }
  }
  console.log(heatmapImgSrc)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Analysis Complete</h1>
        <p className="text-muted-foreground">
          Your file has been analyzed by our AI model.
        </p>
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

          {/* Realism/Deepfake Probabilities */}
          <div className="space-y-2 mb-8">
            <div className="flex justify-between items-center">
              <span className="font-medium">Realism Probability</span>
              <span className="font-mono">{(result.realism * 100).toFixed(1)}%</span>
            </div>
            <Progress value={result.realism * 100} className="h-2 bg-green-500/10" />
            <div className="flex justify-between items-center">
              <span className="font-medium">Deepfake Probability</span>
              <span className="font-mono">{(result.deepfake * 100).toFixed(1)}%</span>
            </div>
            <Progress value={result.deepfake * 100} className="h-2 bg-red-500/10" />
          </div>

          {/* Heatmap Visualization */}
          {heatmapImgSrc && heatmap != undefined && (
            <div className="mb-8">
              <div className="flex items-center mb-2">
                <Flame className="h-5 w-5 text-red-500 mr-2" />
                <span className="font-medium">Prediction Heatmap</span>
              </div>
              <div className="flex flex-col items-center">
                {/* Add onError fallback for debugging */}
                <img
                  src={heatmapImgSrc}
                  alt="Prediction Heatmap"
                  className="rounded-lg border border-border shadow-md max-w-xs w-full"
                  style={{ background: "#222" }}
                  onError={e => {
                    (e.target as HTMLImageElement).style.display = "none"
                  }}
                />
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  <span className="text-red-500 font-semibold">Red zones</span> highlight the areas that most influenced the AI's prediction.<br />
                  These regions are where the model detected features most indicative of deepfakes or authenticity.
                </p>
              </div>
            </div>
          )}

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
