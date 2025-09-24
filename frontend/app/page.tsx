"use client"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import FileUpload from "@/components/file-upload"
import AnimatedBackground from "@/components/animated-background"
import ScrollAnimations from "@/components/scroll-animations"
import { Shield, Zap, Lock, CheckCircle, MousePointerClick } from "lucide-react"
import { useEffect } from "react"
import { toast } from "sonner"

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <AnimatedBackground />
      <ScrollAnimations />

      <Navigation />

      {/* Hero Section */}
      <main className="flex-1 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-primary/10 rounded-full">
                <Shield className="h-12 w-12 text-primary" />
              </div>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-balance mb-6">
              Detect Deepfakes
              <span className="text-primary block">Instantly</span>
            </h1>

            <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto mb-12">
              Upload an image or video and find out if it's real or fake using our advanced AI detection technology.
            </p>
          </div>

          {/* Upload Section */}
          <div className="max-w-2xl mx-auto mb-16">
            <FileUpload />
          </div>

          {/* Extension Section */}
          <div className="max-w-2xl mx-auto mb-16">
            <div className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-lg bg-card/50 border border-border/40 backdrop-blur-sm hover-card shadow-lg">
              <div className="flex-shrink-0 flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4 md:mb-0">
                <MousePointerClick className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-lg font-semibold mb-2">Chrome Extension: Snip Images Instantly</h3>
                <p className="text-muted-foreground text-sm mb-3">
                  <span className="font-medium text-primary">New!</span> Use our browser extension to select and crop any image directly from any webpage—just like a snipping tool. No need to download or upload manually!
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center md:justify-start">
                  <a
                    href="https://chrome.google.com/webstore/detail/image-cropper-deepfake-detector" // TODO: Replace with actual link
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block px-4 py-2 rounded-md bg-primary text-white font-semibold shadow hover:bg-primary/90 transition"
                  >
                    Get the Extension
                  </a>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <MousePointerClick className="w-4 h-4" />
                    Drag to select any image!
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center p-6 rounded-lg bg-card/50 border border-border/40 backdrop-blur-sm hover-card">
              <div className="flex justify-center mb-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Lightning Fast</h3>
              <p className="text-muted-foreground text-sm">Get results in seconds with our optimized AI models</p>
            </div>

            <div className="text-center p-6 rounded-lg bg-card/50 border border-border/40 backdrop-blur-sm hover-card">
              <div className="flex justify-center mb-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure & Private</h3>
              <p className="text-muted-foreground text-sm">Your files are processed securely and never stored</p>
            </div>

            <div className="text-center p-6 rounded-lg bg-card/50 border border-border/40 backdrop-blur-sm hover-card">
              <div className="flex justify-center mb-4">
                <div className="p-2 bg-primary/10 rounded-full">
                  <CheckCircle className="h-6 w-6 text-primary" />
                </div>
              </div>
              <h3 className="text-lg font-semibold mb-2">High Accuracy</h3>
              <p className="text-muted-foreground text-sm">State-of-the-art detection with 95%+ accuracy rate</p>
            </div>
          </div>

          {/* Instructions */}
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-semibold mb-4">How it works</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>1. Upload an image or video file, or paste a video URL</p>
              <p>2. Our AI analyzes the content for deepfake indicators</p>
              <p>3. Get instant results with confidence scores</p>
              <p className="mt-4 text-sm text-primary">
                Or use the extension to snip any image from the web!
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
