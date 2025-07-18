"use client"

import { useState, useEffect } from "react"
import { QRShareModal } from "./qr-share-modal"

interface FloatingQRButtonProps {
  language: "es" | "en"
}

export function FloatingQRButton({ language }: FloatingQRButtonProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isNearFooter, setIsNearFooter] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      const scrollY = window.pageYOffset
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight

      // Show button after scrolling past hero section (around 100vh)
      const heroHeight = windowHeight

      // Check if near footer (within 200px of bottom)
      const distanceFromBottom = documentHeight - (scrollY + windowHeight)
      const nearFooter = distanceFromBottom < 200

      if (scrollY > heroHeight * 0.3) {
        setIsVisible(true)
      } else {
        setIsExpanded(false)
      }

      setIsNearFooter(nearFooter)
    }

    window.addEventListener("scroll", toggleVisibility)
    window.addEventListener("resize", toggleVisibility)

    // Initial check
    toggleVisibility()

    return () => {
      window.removeEventListener("scroll", toggleVisibility)
      window.removeEventListener("resize", toggleVisibility)
    }
  }, [])

  const content = {
    es: {
      share: "Compartir",
      tournament: "Torneo",
    },
    en: {
      share: "Share",
      tournament: "Tournament",
    },
  }

  const t = content[language]

  if (!isVisible) return null

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ${
        isNearFooter
          ? "bottom-32 right-6" // Move up when near footer
          : "bottom-6 right-6" // Normal position
      }`}
    >
      <div className="relative">
        {/* Main Floating Button */}
        <div
          className={`
            transition-all duration-300 ease-in-out
            ${isExpanded ? "scale-110" : "scale-100 hover:scale-105"}
          `}
        >
          <QRShareModal language={language}>
            <button
              className="
                group relative
                bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900
                hover:from-slate-600 hover:via-slate-700 hover:to-slate-800
                text-white
                rounded-full
                shadow-2xl hover:shadow-slate-500/25
                transition-all duration-300
                border-2 border-slate-500/30
                backdrop-blur-sm
                p-4
                flex items-center gap-3
                font-semibold
                overflow-hidden
              "
              onMouseEnter={() => setIsExpanded(true)}
              onMouseLeave={() => setIsExpanded(false)}
            >
              {/* Background Animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-400/20 to-slate-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Bowling Ball Icon */}
              <div className="relative z-10">
                <div className="w-6 h-6 bg-white rounded-full relative shadow-lg">
                  {/* Bowling ball holes */}
                  <div className="absolute top-1 left-1.5 w-1 h-1 bg-slate-800 rounded-full"></div>
                  <div className="absolute top-2.5 left-1 w-0.5 h-0.5 bg-slate-800 rounded-full"></div>
                  <div className="absolute top-2.5 right-1 w-0.5 h-0.5 bg-slate-800 rounded-full"></div>
                </div>
              </div>

              {/* Expandable Text */}
              <div
                className={`
                  relative z-10 overflow-hidden transition-all duration-300 ease-in-out
                  ${isExpanded ? "max-w-32 opacity-100" : "max-w-0 opacity-0"}
                `}
              >
                <span className="whitespace-nowrap text-sm">
                  {t.share} {t.tournament}
                </span>
              </div>

              {/* Pulse Animation */}
              <div className="absolute inset-0 rounded-full bg-slate-500/30 animate-ping opacity-20" />
            </button>
          </QRShareModal>
        </div>

        {/* Tooltip */}
        <div
          className={`
            absolute bottom-full right-0 mb-2
            bg-black/80 text-white text-xs
            px-3 py-2 rounded-lg
            backdrop-blur-sm
            transition-all duration-200
            ${isExpanded ? "opacity-0 translate-y-1" : "opacity-0 group-hover:opacity-100 translate-y-0"}
            pointer-events-none
            whitespace-nowrap
          `}
        >
          🎳 {t.share} Torneo La Negrita
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80" />
        </div>
      </div>
    </div>
  )
}
