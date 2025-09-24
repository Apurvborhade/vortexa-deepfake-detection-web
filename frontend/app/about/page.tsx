import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import { Shield, Brain, Eye, AlertTriangle, CheckCircle, XCircle } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-primary/10 rounded-full">
              <Shield className="h-12 w-12 text-primary" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-balance mb-6">
            About <span className="text-primary">DeepCheck</span>
          </h1>

          <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
            Advanced AI-powered deepfake detection to help you verify the authenticity of digital media.
          </p>
        </div>

        {/* What are Deepfakes Section */}
        <section className="mb-16">
          <div className="bg-card/50 border border-border/40 rounded-lg p-8 backdrop-blur-sm hover-card">
            <div className="flex items-center space-x-3 mb-6">
              <Brain className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">What are Deepfakes?</h2>
            </div>

            <div className="space-y-4 text-muted-foreground">
              <p>
                Deepfakes are synthetic media created using artificial intelligence, where a person appears to say or do
                things they never actually did. These AI-generated videos and images can be incredibly realistic, making
                them difficult to detect with the naked eye.
              </p>

              <p>
                While deepfake technology has legitimate uses in entertainment and education, it can also be misused for
                misinformation, fraud, and other harmful purposes. That's where DeepCheck comes in.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="mb-16">
          <div className="bg-card/50 border border-border/40 rounded-lg p-8 backdrop-blur-sm">
            <div className="flex items-center space-x-3 mb-6">
              <Eye className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-bold">How DeepCheck Works</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-3">Detection Methods</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Facial inconsistency analysis</li>
                  <li>• Temporal artifact detection</li>
                  <li>• Compression pattern examination</li>
                  <li>• Neural network verification</li>
                  <li>• Pixel-level anomaly detection</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">AI Technology</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Convolutional Neural Networks</li>
                  <li>• Transformer architectures</li>
                  <li>• Ensemble learning methods</li>
                  <li>• Real-time processing</li>
                  <li>• Continuous model updates</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Accuracy & Limitations */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <h3 className="text-lg font-semibold">Our Strengths</h3>
              </div>

              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• 95%+ accuracy on standard datasets</li>
                <li>• Fast processing (under 10 seconds)</li>
                <li>• Supports multiple file formats</li>
                <li>• Regular model improvements</li>
                <li>• Privacy-focused processing</li>
              </ul>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-yellow-500" />
                <h3 className="text-lg font-semibold">Limitations</h3>
              </div>

              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• No detection system is 100% accurate</li>
                <li>• New deepfake methods may evade detection</li>
                <li>• Quality of input affects accuracy</li>
                <li>• False positives/negatives can occur</li>
                <li>• Not a substitute for human verification</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Important Disclaimer */}
        <section className="mb-16">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-8">
            <div className="flex items-start space-x-3">
              <XCircle className="h-6 w-6 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-semibold text-red-500 mb-3">Important Disclaimer</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    <strong>DeepCheck is a detection tool, not a guarantee.</strong> While our AI achieves high accuracy
                    rates, no automated system can provide 100% certainty about media authenticity.
                  </p>

                  <p>
                    <strong>Always verify important content through multiple sources.</strong> For critical decisions,
                    consult with experts and use additional verification methods.
                  </p>

                  <p>
                    <strong>This tool is for informational purposes only.</strong> We are not responsible for decisions
                    made based on our analysis results.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy & Security */}
        <section>
          <div className="bg-card/50 border border-border/40 rounded-lg p-8 backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-6">Privacy & Security</h2>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-3">Data Protection</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Files are processed securely</li>
                  <li>• No permanent storage of uploads</li>
                  <li>• Encrypted data transmission</li>
                  <li>• Automatic deletion after analysis</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Your Rights</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Complete control over your data</li>
                  <li>• No tracking or profiling</li>
                  <li>• Open source detection methods</li>
                  <li>• Transparent processing</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
