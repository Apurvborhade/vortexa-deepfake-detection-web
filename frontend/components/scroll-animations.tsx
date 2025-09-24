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
    <div className="fixed inset-0 pointer-events-none z-0">
      {/* Parallax moving elements based on scroll */}
      <div className="absolute w-full h-full" style={{ transform: `translateY(${scrollY * 0.1}px)` }}>
        {/* Floating particles that move with scroll */}
        <div className="absolute top-20 left-10 w-1 h-1 bg-blue-400 rounded-full opacity-60 animate-pulse" />
        <div className="absolute top-40 right-20 w-2 h-2 bg-blue-300 rounded-full opacity-40 animate-pulse" />
        <div className="absolute top-60 left-1/3 w-1.5 h-1.5 bg-blue-500 rounded-full opacity-50 animate-pulse" />
      </div>

      {/* Scroll-triggered wave effect */}
      <div
        className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-blue-950/20 to-transparent"
        style={{
          transform: `translateY(${Math.min(scrollY * 0.2, 100)}px)`,
          opacity: Math.min(scrollY / 300, 0.8),
        }}
      />

      {/* Dynamic grid that responds to scroll */}
      <div className="absolute inset-0 opacity-5" style={{ transform: `translateY(${scrollY * -0.05}px)` }}>
        <div className="w-full h-full bg-grid-pattern" />
      </div>

    </div>
  )
}
