'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, Download, Home } from 'lucide-react'

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [loading, setLoading] = useState(true)
  const [sessionData, setSessionData] = useState<any>(null)

  useEffect(() => {
    if (sessionId) {
      // Optionally verify session with your backend
      setLoading(false)
    } else {
      setLoading(false)
    }
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando pago...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
            <CheckCircle2 className="h-12 w-12 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Pago Exitoso!
          </h1>

          <p className="text-gray-600 mb-8">
            Tu registro para el Torneo La Negrita 2025 ha sido confirmado.
          </p>

          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h2 className="font-semibold text-gray-900 mb-3">
              ¿Qué sigue?
            </h2>
            <ul className="text-left text-sm text-gray-700 space-y-2">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span>Recibirás un email de confirmación con tu código QR</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span>Podrás ver los brackets del torneo próximamente</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                <span>Mantente atento a las actualizaciones del evento</span>
              </li>
            </ul>
          </div>

          {sessionId && (
            <div className="text-xs text-gray-500 mb-6">
              ID de sesión: {sessionId.substring(0, 20)}...
            </div>
          )}

          <div className="space-y-3">
            <Link
              href="/brackets"
              className="flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4 mr-2" />
              Ver Brackets
            </Link>

            <Link
              href="/"
              className="flex items-center justify-center w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Home className="w-4 h-4 mr-2" />
              Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
