import type { Metadata } from "next"
import { getSupabase } from "@/lib/supabase-server"
import { calculateDue, type PlayerInfo } from "@/lib/payment-utils"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "Pagos | Admin – Torneo La Negrita 2025",
}

export default async function PaymentsPage() {
  const supabase = getSupabase()

  // Ajusta los nombres de las columnas si son distintos en tu tabla `players`
  const { data: playersData, error } = await supabase
    .from("players")
    .select("id, full_name, nationality, package_size, scratch, created_at, amount_paid")
    .order("created_at", { ascending: true })

  // Handle potential null data and errors
  const players = playersData || []

  if (error) {
    console.error("Error fetching players:", error)
  }

  return (
    <main className="p-6 max-w-screen-lg mx-auto">
      <h1 className="text-3xl font-semibold mb-4">Pagos de inscripción</h1>

      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium">Jugador</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Nacionalidad</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Paquete</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Scratch</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Monto a Pagar</th>
                <th className="px-4 py-2 text-left text-sm font-medium">Pagado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-sm">
              {players.map((p: PlayerInfo) => {
                const due = calculateDue(p)
                const paid = p.amount_paid ?? 0
                const formatter = new Intl.NumberFormat("es-CR", {
                  style: "currency",
                  currency: due.currency,
                  maximumFractionDigits: 0,
                })
                return (
                  <tr key={p.id}>
                    <td className="px-4 py-2">{p.full_name}</td>
                    <td className="px-4 py-2">{p.nationality === "CR" ? "Costa Rica" : "Extranjero"}</td>
                    <td className="px-4 py-2 text-center">{p.package_size}</td>
                    <td className="px-4 py-2 text-center">{p.scratch ? "Sí" : "—"}</td>
                    <td className="px-4 py-2 font-medium">{formatter.format(due.total)}</td>
                    <td className={`px-4 py-2 font-medium ${paid >= due.total ? "text-green-600" : "text-red-600"}`}>
                      {formatter.format(paid)}
                    </td>
                  </tr>
                )
              })}
              {players.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500 italic">
                    No hay jugadores registrados todavía.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>

      <Separator className="my-6" />

      <p className="text-sm text-gray-600">
        Para registrar pagos parciales o totales, añade la columna{" "}
        <code className="px-1 py-0.5 rounded bg-gray-100">amount_paid</code> a la tabla <strong>players</strong> y
        actualízala desde tu backend, Server Action o Supabase Dashboard.
      </p>
    </main>
  )
}
