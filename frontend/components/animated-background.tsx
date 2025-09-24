"use client"

import { useEffect, useState } from "react"
import { Eye, Shield, Scan, Zap, Lock, AlertTriangle, CheckCircle, Brain, Search, Target } from "lucide-react"

const symbols = [
  { Icon: Eye, delay: 0 },
  { Icon: Shield, delay: 0.5 },
  { Icon: Scan, delay: 1 },
  { Icon: Zap, delay: 1.5 },
  { Icon: Lock, delay: 2 },
  { Icon: AlertTriangle, delay: 2.5 },
  { Icon: CheckCircle, delay: 3 },
  { Icon: Brain, delay: 3.5 },
  { Icon: Search, delay: 4 },
  { Icon: Target, delay: 4.5 },
]

interface FloatingSymbol {
  id: number
  Icon: any
  x: number
  y: number
  size: number
  duration: number
  delay: number
}

export default function AnimatedBackground() {
  const [floatingSymbols, setFloatingSymbols] = useState<FloatingSymbol[]>([])

  useEffect(() => {
    const generateSymbols = () => {
      const newSymbols: FloatingSymbol[] = []

      // Generate 15 floating symbols
      for (let i = 0; i < 15; i++) {
        const symbolIndex = i % symbols.length
        newSymbols.push({
          id: i,
          Icon: symbols[symbolIndex].Icon,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 20 + 16, // 16-36px
          duration: Math.random() * 20 + 15, // 15-35s
          delay: Math.random() * 5,
        })
      }

      setFloatingSymbols(newSymbols)
    }

    generateSymbols()
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-blue-950/30 animate-gradient-shift" />

      {/* Floating symbols */}
      {floatingSymbols.map((symbol) => (
        <div
          key={symbol.id}
          className="absolute opacity-25 text-blue-400 animate-float drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]"
          style={{
            left: `${symbol.x}%`,
            top: `${symbol.y}%`,
            animationDuration: `${symbol.duration}s`,
            animationDelay: `${symbol.delay}s`,
          }}
        >
          <symbol.Icon size={symbol.size} />
        </div>
      ))}

      {/* Scanning lines */}
      <div className="absolute inset-0">
        <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent animate-scan-horizontal" />
        <div className="absolute w-px h-full bg-gradient-to-b from-transparent via-blue-500/40 to-transparent animate-scan-vertical" />
      </div>

      {/* Digital grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-grid-pattern animate-pulse" />
      </div>

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-pulse-slow" />
      <div
        className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-blue-400/25 rounded-full blur-xl animate-pulse-slow"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute top-2/3 left-1/3 w-20 h-20 bg-blue-600/20 rounded-full blur-xl animate-pulse-slow"
        style={{ animationDelay: "4s" }}
      />

      {/* Additional animated elements for more visual interest */}
      <div className="absolute inset-0">
        {/* Rotating rings */}
        <div className="absolute top-1/2 left-1/2 w-64 h-64 border border-blue-500/10 rounded-full animate-spin-slow -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 w-48 h-48 border border-blue-400/15 rounded-full animate-spin-reverse -translate-x-1/2 -translate-y-1/2" />

        {/* Pulsing dots */}
        <div className="absolute top-1/6 right-1/6 w-2 h-2 bg-blue-400 rounded-full animate-ping" />
        <div
          className="absolute bottom-1/4 left-1/6 w-1 h-1 bg-blue-300 rounded-full animate-ping"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-3/4 right-1/3 w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"
          style={{ animationDelay: "2s" }}
        />
      </div>
    </div>
  )
}
