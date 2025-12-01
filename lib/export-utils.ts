/**
 * Data export utilities for CSV and Excel formats
 */

export interface ExportColumn {
  key: string
  header: string
  format?: (value: unknown) => string
}

/**
 * Convert array of objects to CSV string
 */
export function arrayToCSV<T extends Record<string, unknown>>(
  data: T[],
  columns: ExportColumn[]
): string {
  if (!data || data.length === 0) {
    return ''
  }

  // Create header row
  const headers = columns.map(col => escapeCSVValue(col.header)).join(',')

  // Create data rows
  const rows = data.map(row => {
    return columns
      .map(col => {
        const value = row[col.key]
        const formatted = col.format ? col.format(value) : String(value ?? '')
        return escapeCSVValue(formatted)
      })
      .join(',')
  })

  return [headers, ...rows].join('\n')
}

/**
 * Escape special characters in CSV values
 */
function escapeCSVValue(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

/**
 * Download CSV file in browser
 */
export function downloadCSV(filename: string, csvContent: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')

  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }
}

/**
 * Format date for export
 */
export function formatExportDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('es-CR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Format currency for export
 */
export function formatExportCurrency(amount: number, currency: string): string {
  return `${currency} ${amount.toLocaleString('es-CR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

/**
 * Player export columns definition
 */
export const PLAYER_EXPORT_COLUMNS: ExportColumn[] = [
  { key: 'id', header: 'ID' },
  { key: 'name', header: 'Nombre' },
  { key: 'email', header: 'Email' },
  { key: 'phone', header: 'Teléfono' },
  { key: 'nationality', header: 'Nacionalidad' },
  { key: 'league', header: 'Liga' },
  { key: 'payment_status', header: 'Estado de Pago' },
  {
    key: 'amount_paid',
    header: 'Monto Pagado',
    format: (value) => {
      const num = Number(value)
      return isNaN(num) ? '0' : num.toFixed(2)
    },
  },
  { key: 'currency', header: 'Moneda' },
  { key: 'payment_method', header: 'Método de Pago' },
  {
    key: 'created_at',
    header: 'Fecha de Registro',
    format: (value) => formatExportDate(String(value)),
  },
  { key: 'emergency_contact_name', header: 'Contacto de Emergencia' },
  { key: 'emergency_contact_phone', header: 'Teléfono de Emergencia' },
]

/**
 * Results export columns definition
 */
export const RESULTS_EXPORT_COLUMNS: ExportColumn[] = [
  { key: 'player_name', header: 'Jugador' },
  { key: 'round_number', header: 'Ronda' },
  { key: 'game_1', header: 'Juego 1' },
  { key: 'game_2', header: 'Juego 2' },
  { key: 'game_3', header: 'Juego 3' },
  { key: 'total_score', header: 'Total' },
  {
    key: 'created_at',
    header: 'Fecha',
    format: (value) => formatExportDate(String(value)),
  },
]

/**
 * Standings export columns definition
 */
export const STANDINGS_EXPORT_COLUMNS: ExportColumn[] = [
  { key: 'position', header: 'Posición' },
  { key: 'player_name', header: 'Jugador' },
  { key: 'total_score', header: 'Puntaje Total' },
  { key: 'games_played', header: 'Juegos Jugados' },
  {
    key: 'average',
    header: 'Promedio',
    format: (value) => {
      const num = Number(value)
      return isNaN(num) ? '0.0' : num.toFixed(2)
    },
  },
  { key: 'best_game', header: 'Mejor Juego' },
]
