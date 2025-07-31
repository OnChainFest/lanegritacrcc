"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { DollarSign, X, Loader2 } from "lucide-react"

interface Player {
  id: string
  name: string
  email: string
  nationality?: string
  country?: string
  amount_paid: number
  currency: string
  package_details: string
  category_details?: string
}

interface PaymentModalProps {
  player: Player
  isOpen: boolean
  onClose: () => void
  onPaymentUpdated: () => void
}

export function PaymentModal({ player, isOpen, onClose, onPaymentUpdated }: PaymentModalProps) {
  const [amountPaid, setAmountPaid] = useState(player.amount_paid?.toString() || "0")
  const [paymentMethod, setPaymentMethod] = useState("")
  const [paymentNotes, setPaymentNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch("/api/update-payment-amount", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerId: player.id,
          amountPaid: Number.parseFloat(amountPaid) || 0,
          paymentMethod,
          paymentNotes,
        }),
      })

      const result = await response.json()

      if (result.success) {
        toast({
          title: "✅ Pago actualizado",
          description: `Pago de ${result.playerName} actualizado correctamente`,
        })
        onPaymentUpdated()
        onClose()
      } else {
        toast({
          title: "❌ Error",
          description: result.error || "No se pudo actualizar el pago",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating payment:", error)
      toast({
        title: "🔌 Error de conexión",
        description: "Verifica tu internet e intenta de nuevo",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount: number) => {
    if (player.currency === "CRC") {
      return new Intl.NumberFormat("es-CR", {
        style: "currency",
        currency: "CRC",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount)
    } else {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-slate-800/95 backdrop-blur-md border-slate-700">
        <CardHeader className="bg-gradient-to-r from-slate-700/95 to-slate-800/95 text-white border-b border-slate-600">
          <div className="flex justify-between items-center">
            <CardTitle className="font-heading flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Registrar Pago
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-slate-300 hover:text-white hover:bg-slate-600"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-6">
          <div className="space-y-2">
            <Label className="font-heading font-semibold text-slate-300">Jugador</Label>
            <p className="text-white font-body">{player.name}</p>
            <p className="text-sm text-slate-400">{player.email}</p>
          </div>

          <div className="space-y-2">
            <Label className="font-heading font-semibold text-slate-300">Paquete</Label>
            <p className="text-sm text-slate-300">{player.package_details}</p>
          </div>

          {player.category_details && (
            <div className="space-y-2">
              <Label className="font-heading font-semibold text-slate-300">Categorías</Label>
              <p className="text-sm text-slate-300">{player.category_details}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label className="font-heading font-semibold text-slate-300">Pagado Actual</Label>
            <p className="text-white font-body">{formatCurrency(player.amount_paid || 0)}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amountPaid" className="font-heading font-semibold text-slate-300">
                Monto Pagado * ({player.currency})
              </Label>
              <Input
                id="amountPaid"
                type="number"
                step="0.01"
                min="0"
                value={amountPaid}
                onChange={(e) => setAmountPaid(e.target.value)}
                className="bg-slate-700/80 backdrop-blur-sm border-slate-600 text-white"
                placeholder="0.00"
                required
              />
              <p className="text-xs text-slate-400">
                Formato: {player.currency === "CRC" ? "₡10,000.00" : "$10,000.00"}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod" className="font-heading font-semibold text-slate-300">
                Método de Pago
              </Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="bg-slate-700/80 backdrop-blur-sm border-slate-600 text-white">
                  <SelectValue placeholder="Seleccionar método" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transferencia">Transferencia Bancaria</SelectItem>
                  <SelectItem value="deposito">Depósito Bancario</SelectItem>
                  <SelectItem value="efectivo">Efectivo</SelectItem>
                  <SelectItem value="tarjeta">Tarjeta de Crédito/Débito</SelectItem>
                  <SelectItem value="sinpe">SINPE Móvil</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentNotes" className="font-heading font-semibold text-slate-300">
                Notas del Pago
              </Label>
              <Textarea
                id="paymentNotes"
                value={paymentNotes}
                onChange={(e) => setPaymentNotes(e.target.value)}
                className="bg-slate-700/80 backdrop-blur-sm border-slate-600 text-white"
                placeholder="Número de referencia, observaciones, etc."
                rows={3}
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 bg-slate-700/80 hover:bg-slate-600 border-slate-600 text-slate-300 hover:text-white"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="flex-1 bg-green-700/80 hover:bg-green-600 text-white">
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <DollarSign className="w-4 h-4 mr-2" />
                    Guardar Pago
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
