"use client"

import { useState, useEffect, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { QrCode, Share2, Copy, Facebook, Twitter, Mail, MessageCircle, X, Send, CheckCircle } from "lucide-react"
import Image from "next/image"

interface QRShareModalProps {
  language?: "es" | "en"
  children?: ReactNode
}

export function QRShareModal({ language = "es", children }: QRShareModalProps) {
  const [open, setOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [qrCodeUrl, setQrCodeUrl] = useState("")

  const content = {
    es: {
      title: "Compartir PadelFlow",
      copyLink: "Copiar Enlace",
      shareVia: "Compartir por:",
      qrDescription: "Escanea este código QR para acceder directamente al torneo",
      linkCopied: "¡Enlace copiado!",
      close: "Cerrar",
    },
    en: {
      title: "Share PadelFlow",
      copyLink: "Copy Link",
      shareVia: "Share via:",
      qrDescription: "Scan this QR code to access the tournament directly",
      linkCopied: "Link copied!",
      close: "Close",
    },
  }

  // Safe language fallback
  const lang = language === "en" ? "en" : "es"
  const t = content[lang]
  const currentUrl = typeof window !== "undefined" ? window.location.href : "https://padelflow.vercel.app"

  // Generate QR code URL using QR Server API
  useEffect(() => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(currentUrl)}&bgcolor=FFFFFF&color=000000&margin=10&format=png&ecc=M`
    setQrCodeUrl(qrUrl)
  }, [currentUrl])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000) // Mostrar por 3 segundos
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const shareOptions = [
    {
      name: "WhatsApp",
      icon: MessageCircle,
      url: `https://wa.me/?text=${encodeURIComponent(`🎾 ¡Mira esta plataforma increíble para torneos de pádel! PadelFlow - Gestión Profesional de Torneos\n\n${currentUrl}`)}`,
      color: "bg-green-600/90 hover:bg-green-700/90 backdrop-blur-sm",
    },
    {
      name: "Facebook",
      icon: Facebook,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodeURIComponent("🎾 PadelFlow - Plataforma profesional para gestión de torneos de pádel")}`,
      color: "bg-blue-600/90 hover:bg-blue-700/90 backdrop-blur-sm",
    },
    {
      name: "Twitter",
      icon: Twitter,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent("🎾 PadelFlow - La plataforma profesional para gestión de torneos de pádel. Gestiona inscripciones, brackets y resultados en tiempo real.")}&hashtags=PadelFlow,Padel,Torneos`,
      color: "bg-sky-500/90 hover:bg-sky-600/90 backdrop-blur-sm",
    },
    {
      name: "Email",
      icon: Mail,
      url: `mailto:?subject=${encodeURIComponent("🎾 PadelFlow - Plataforma de Torneos")}&body=${encodeURIComponent(`Hola,\n\nTe invito a conocer PadelFlow, la plataforma profesional para gestión de torneos de pádel.\n\n✨ Gestión completa de torneos\n🎾 Brackets en tiempo real\n📊 Estadísticas avanzadas\n\nMás información: ${currentUrl}\n\n¡Espero que te sea útil!\n\nSaludos`)}`,
      color: "bg-gray-600/90 hover:bg-gray-700/90 backdrop-blur-sm",
    },
    {
      name: "Telegram",
      icon: Send,
      url: `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent("🎾 PadelFlow - Plataforma profesional para gestión de torneos de pádel. Gestiona todo tu torneo en un solo lugar.")}`,
      color: "bg-blue-500/90 hover:bg-blue-600/90 backdrop-blur-sm",
    },
    {
      name: copied ? t.linkCopied : "Copiar",
      icon: copied ? CheckCircle : Copy,
      action: copyToClipboard,
      color: copied
        ? "bg-green-600/90 hover:bg-green-700/90 backdrop-blur-sm"
        : "bg-purple-600/90 hover:bg-purple-700/90 backdrop-blur-sm",
    },
  ]

  const triggerElement = children || (
    <Button
      variant="ghost"
      size="lg"
      className="text-gray-300 hover:text-white hover:bg-white/20 backdrop-blur-sm border border-gray-600/50 px-4 py-3 rounded-xl transition-all duration-300 hover:scale-105"
    >
      <QrCode className="w-8 h-8 mr-2" />
      <span className="font-semibold">Compartir QR</span>
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerElement}</DialogTrigger>
      <DialogContent className="max-w-lg w-full mx-4 relative overflow-hidden border-0 p-0 font-sans fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image src="/images/bowling-qr-bg.png" alt="Bowling Background" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/80 backdrop-blur-[2px]" />
        </div>

        {/* Close Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setOpen(false)}
          className="absolute top-4 right-4 z-20 text-white hover:text-white hover:bg-red-500/80 bg-black/40 rounded-full p-3 backdrop-blur-sm border border-white/20 shadow-lg transition-all duration-200 hover:scale-110"
        >
          <X className="w-6 h-6 stroke-2" />
        </Button>

        <div className="relative z-10 p-6">
          <DialogHeader className="text-center text-white mb-6">
            <DialogTitle className="flex items-center justify-center gap-3 text-2xl font-bold tracking-tight">
              <Share2 className="w-7 h-7" />
              {t.title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* QR Code Section */}
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-white/95 p-4 rounded-2xl shadow-2xl border-4 border-white/30 backdrop-blur-sm">
                {qrCodeUrl ? (
                  <Image
                    src={qrCodeUrl || "/placeholder.svg"}
                    alt="QR Code para PadelFlow"
                    width={250}
                    height={250}
                    className="rounded-lg"
                    priority
                    onError={() => {
                      console.error("Error loading QR code")
                      setQrCodeUrl("")
                    }}
                  />
                ) : (
                  <div className="w-[250px] h-[250px] bg-gray-100/90 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <div className="text-center">
                      <QrCode className="w-16 h-16 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">Generando QR...</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-200/90 max-w-xs leading-relaxed font-medium">{t.qrDescription}</p>
              </div>
            </div>

            {/* Share Options */}
            <div className="space-y-4">
              <p className="text-sm text-gray-200/90 text-center font-semibold">{t.shareVia}</p>
              <div className="grid grid-cols-3 gap-3">
                {shareOptions.map((option) => (
                  <Button
                    key={option.name}
                    onClick={() => {
                      if (option.action) {
                        option.action()
                      } else if (option.url) {
                        window.open(option.url, "_blank", "noopener,noreferrer")
                      }
                    }}
                    className={`${option.color} text-white flex flex-col items-center justify-center gap-1 py-4 font-semibold transition-all duration-200 hover:scale-105 border border-white/20`}
                  >
                    <option.icon className="w-5 h-5" />
                    <span className="text-xs">{option.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
