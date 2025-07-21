"use client"
import { QrCode } from "lucide-react"
import { QRShareModal } from "./qr-share-modal"

export function FloatingQRButton() {
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <QRShareModal language="es">
        <button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white p-4 rounded-full shadow-2xl hover:shadow-red-500/25 transition-all duration-300 hover:scale-110 border-2 border-white/20 backdrop-blur-sm">
          <QrCode className="w-8 h-8" />
        </button>
      </QRShareModal>
    </div>
  )
}
