"use client"

import { useRouter } from "next/navigation"
import { CheckCircle, XCircle, ArrowLeft, AlertTriangle, Info, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AIResultSummary {
  verdict: "ai" | "human";
  ai: any;
  human: any;
}
interface DeepfakeData {
  is_detected: boolean;
  confidence: number;
  rois: Array<any>;
}
interface MetaData {
  width: number;
  height: number;
  format: string;
  size_bytes: number;
  md5: string;
  [key: string]: any;
}
interface NSFWData {
  is_detected: boolean;
}
interface QualityData {
  is_detected: boolean;
}

export interface AnalysisReportData {
  created_at: string;
  id: string;
  report: {
    ai_generated: AIResultSummary;
    deepfake: DeepfakeData;
    meta: MetaData;
    nsfw: NSFWData;
    quality: QualityData;
  };
}

interface ResultDisplayProps {
  result: AnalysisReportData;
  heatmap: any;
}

export default function ResultDisplay({ result, heatmap }: ResultDisplayProps) {
  const router = useRouter();

  console.log("This is the result", result)
  if (!result || !result.report) {
    return (
      <div className="text-center py-10">
        <div className="text-red-500 font-bold text-2xl mb-2">No Results Found</div>
        <Button onClick={() => router.push("/")} className="mt-4 w-auto">
          <ArrowLeft className="h-5 w-5 mr-2" />
          Go Back
        </Button>
      </div>
    )
  }

  // Parse main fields
  const {
    created_at,
    id,
    report: {
      ai_generated,
      deepfake,
      meta,
      nsfw,
      quality
    }
  } = result;

  // Calculate verdict (AI vs Human)
  const verdict = ai_generated?.verdict === "ai"
    ? { isAI: true, text: "AI-Generated", icon: <XCircle className="h-12 w-12 text-red-500" /> }
    : { isAI: false, text: "Human", icon: <CheckCircle className="h-12 w-12 text-green-500" /> };

  // Deepfake result line
  let deepfakeText = "";
  let deepfakeColor = "";
  let deepfakeIcon = null;
  if (typeof deepfake?.is_detected === "boolean") {
    if (deepfake.is_detected) {
      deepfakeText = `Deepfake detected (confidence: ${(deepfake.confidence * 100).toFixed(1)}%)`;
      deepfakeColor = "text-red-500";
      deepfakeIcon = <XCircle className="h-6 w-6 text-red-500 mr-2" />;
    } else {
      deepfakeText = `No deepfake detected (confidence: ${(deepfake.confidence * 100).toFixed(1)}%)`;
      deepfakeColor = "text-green-500";
      deepfakeIcon = <CheckCircle className="h-6 w-6 text-green-500 mr-2" />;
    }
  }

  // Prepare heatmap image src if available and valid
  let heatmapImgSrc: string | null = null;
  if (typeof heatmap === "string" && heatmap.length > 0 && heatmap !== undefined) {
    try {
      const parsed = JSON.parse(heatmap);
      if (typeof parsed === "string" && parsed.length > 0) {
        heatmapImgSrc = `data:image/jpeg;base64,${parsed}`;
      }
    } catch {
      heatmapImgSrc = `data:image/jpeg;base64,${heatmap}`;
    }
  }

  // File metadata details
  const fileFormat = meta?.format?.toUpperCase?.() || "N/A";
  const fileSizeKb = typeof meta?.size_bytes === "number"
    ? `${(meta.size_bytes / 1024).toFixed(1)} KB`
    : "N/A";
  const dims = (meta?.width && meta?.height) ? `${meta.width} x ${meta.height}` : "N/A";

  // NSFW Detection
  const nsfwDetected = nsfw?.is_detected === true;

  // Quality Analysis
  const qualityFlagged = quality?.is_detected === false;

  // Show ROIs overlays count if available
  const roisCount = Array.isArray(deepfake?.rois) ? deepfake.rois.length : 0;

  const handleBackToHome = () => {
    localStorage.removeItem("deepcheck-result");
    localStorage.removeItem("deepcheck-heatmap");
    router.push("/");
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Analysis Complete</h1>
        <p className="text-muted-foreground">
          Your file was scanned by our detection models (<span className="font-mono">{created_at?.slice(0, 19).replace("T", " ") || "N/A"}</span>).
        </p>
      </div>

      {/* Results Card */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-card/50 border border-border/40 rounded-lg p-8 backdrop-blur-sm">
          {/* AI/Human Result */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className={`p-4 rounded-full ${verdict.isAI ? "bg-red-500/10" : "bg-green-500/10"}`}>
                {verdict.icon}
              </div>
            </div>

            <h2 className={`text-3xl font-bold mb-2 ${verdict.isAI ? "text-red-500" : "text-green-500"}`}>
              {verdict.text}
            </h2>
            <p className="text-muted-foreground">
              This content appears to be <span className={verdict.isAI ? "text-red-500 font-medium" : "text-green-500 font-medium"}>{verdict.text}</span>
            </p>
          </div>

          {/* Deepfake Result */}
          <div className="flex items-center mb-2 justify-center">
            {deepfakeIcon}
            <span className={`font-semibold text-base ${deepfakeColor}`}>{deepfakeText}</span>
          </div>

          {/* File Info Section */}
          <div className="bg-accent/20 border border-border/40 rounded-lg p-4 mb-6 mt-4">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
              <div className="space-y-2 text-sm">
                <p className="font-medium">File Information:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• <span className="font-medium">Filetype:</span> {fileFormat}</li>
                  <li>• <span className="font-medium">Dimensions:</span> {dims}</li>
                  <li>• <span className="font-medium">Size:</span> {fileSizeKb}</li>
                  <li>• <span className="font-medium">MD5:</span> <span className="font-mono">{meta?.md5 || "N/A"}</span></li>
                  {roisCount > 0 && (
                    <li>• <span className="font-medium">Suspicious Regions:</span> {roisCount} region(s) detected</li>
                  )}
                  {nsfwDetected && (
                    <li className="text-orange-500">• NSFW content detected</li>
                  )}
                  {qualityFlagged && (
                    <li className="text-yellow-500">• Image/Video flagged for quality issues</li>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Heatmap Visualization (if present) */}
          {heatmapImgSrc && heatmap !== undefined && (
            <div className="mb-8">
              <div className="flex items-center mb-2">
                <Flame className="h-5 w-5 text-red-500 mr-2" />
                <span className="font-medium">Prediction Heatmap</span>
              </div>
              <div className="flex flex-col items-center">
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
                  These are model-identified regions of interest.
                </p>
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-yellow-500 mb-1">Important Disclaimer</p>
                <p className="text-muted-foreground">
                  This analysis is for informational purposes only. While our AI achieves high accuracy, no detection system is 100% perfect.
                  Always verify important content through multiple sources.
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
  );
}

