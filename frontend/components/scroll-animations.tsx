"use client"

import { useEffect, useState } from "react"

export default function ScrollAnimations() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Parallax floating particles */}
      <div
        className="absolute w-full h-full"
        style={{ transform: `translateY(${scrollY * 0.1}px)` }}
      >
        {/* Stars */}
        <div className="absolute top-10 left-10 w-2 h-2 bg-blue-300 rounded-full animate-ping opacity-70" />
        <div className="absolute top-1/3 right-16 w-3 h-3 bg-cyan-400 rounded-full animate-bounce opacity-60" />
        <div className="absolute top-2/3 left-1/4 w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse opacity-80" />
        <div className="absolute top-1/2 left-2/3 w-2 h-2 bg-indigo-400 rounded-full animate-pulse opacity-50" />
      </div>

      {/* Rotating glowing orbs */}
      <div
        className="absolute w-64 h-64 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 opacity-20 blur-3xl animate-spin-slow"
        style={{ top: "20%", left: "10%" }}
      />
      <div
        className="absolute w-80 h-80 rounded-full bg-gradient-to-r from-indigo-600 to-blue-400 opacity-20 blur-2xl animate-spin-reverse-slow"
        style={{ bottom: "15%", right: "15%" }}
      />

      {/* Scroll-triggered wave effect */}
      <div
        className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-blue-900/30 to-transparent animate-wave"
        style={{
          transform: `translateY(${Math.min(scrollY * 0.2, 120)}px)`,
          opacity: Math.min(scrollY / 250, 0.9),
        }}
      />

      {/* Dynamic grid that moves slightly on scroll */}
      <div
        className="absolute inset-0 opacity-10"
        style={{ transform: `translateY(${scrollY * -0.08}px)` }}
      >
        <div className="w-full h-full bg-grid-pattern animate-grid-fade" />
      </div>
    </div>
  )
}
