"use client"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import FileUpload from "@/components/file-upload"
import AnimatedBackground from "@/components/animated-background"
import ScrollAnimations from "@/components/scroll-animations"
import { Shield, Zap, Lock, CheckCircle } from "lucide-react"
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
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
