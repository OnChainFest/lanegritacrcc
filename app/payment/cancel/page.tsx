'use client'

import Link from 'next/link'
import { XCircle, ArrowLeft, CreditCard } from 'lucide-react'

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-6">
            <XCircle className="h-12 w-12 text-red-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pago Cancelado
          </h1>

          <p className="text-gray-600 mb-8">
            Tu pago fue cancelado. No se realizó ningún cargo a tu tarjeta.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-gray-700">
              Si experimentaste algún problema durante el proceso de pago o tienes preguntas, por favor contáctanos.
            </p>
          </div>

          <div className="space-y-3">
            <Link
              href="/register"
              className="flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Intentar Nuevamente
            </Link>

            <Link
              href="/"
              className="flex items-center justify-center w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver al Inicio
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              ¿Necesitas ayuda?{' '}
              <a href="mailto:admin@lanegritacrcc.com" className="text-blue-600 hover:underline">
                Contáctanos
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
