"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /**
   * Texto opcional que se muestra a la derecha del interruptor.
   */
  label?: React.ReactNode
}

/**
 * Switch accesible sin dependencias externas.
 *
 *   <Switch checked={autoRefresh} onChange={e => setAutoRefresh(e.target.checked)} />
 */
export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(({ className, label, ...props }, ref) => {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
      <input type="checkbox" ref={ref} className="peer sr-only" {...props} />
      {/* Track */}
      <span
        className={cn(
          "w-10 h-6 rounded-full transition-colors",
          "peer-checked:bg-blue-600 peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-blue-500",
          "bg-gray-300 dark:bg-gray-600",
          className,
        )}
      >
        {/* Thumb */}
        <span
          className={cn(
            "block w-4 h-4 bg-white rounded-full shadow transition-transform translate-x-1 translate-y-1",
            "peer-checked:translate-x-5",
          )}
        />
      </span>
      {label && <span className="text-sm">{label}</span>}
    </label>
  )
})
Switch.displayName = "Switch"
