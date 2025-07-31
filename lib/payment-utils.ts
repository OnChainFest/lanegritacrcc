import { differenceInMilliseconds } from "date-fns"

export type Nationality = "CR" | "INTL"

export interface PlayerInfo {
  id: string
  full_name: string
  nationality: Nationality
  package_size: number // 3|4|5|8
  scratch: boolean
  created_at: string // ISO date
  amount_paid?: number | null
  currency?: string
}

export interface PackageInfo {
  type: string
  name: string
  scratch: boolean
  description?: string
}

/*  Fechas  ----------------------------------------------------------------- */
export const EARLY_DEADLINE = new Date("2025-07-22T23:59:59.999Z")

/*  Tarifas  ----------------------------------------------------------------- */
const CRC_EARLY = { 3: 65000, 4: 72000 } as const
const CRC_LATE = { 3: 71000, 4: 78000 } as const
const USD_EARLY = { 3: 122, 5: 153, 8: 201 } as const
const USD_LATE = { 3: 132, 5: 163, 8: 210 } as const

export const CRC_SCRATCH_FEE = 11000
export const USD_SCRATCH_FEE = 22

/*  Helpers  ----------------------------------------------------------------- */
export function isEarly(date: string) {
  return differenceInMilliseconds(new Date(date), EARLY_DEADLINE) <= 0
}

export function calculateDue(player: PlayerInfo) {
  const early = isEarly(player.created_at)

  if (player.nationality === "CR") {
    const base = (early ? CRC_EARLY : CRC_LATE)[player.package_size as 3 | 4] ?? 0
    const total = base + (player.scratch ? CRC_SCRATCH_FEE : 0)
    return { currency: "CRC", total }
  }

  // Internacional
  const base = (early ? USD_EARLY : USD_LATE)[player.package_size as 3 | 5 | 8] ?? 0
  const total = base + (player.scratch ? USD_SCRATCH_FEE : 0)
  return { currency: "USD", total }
}

export function determinePackageFromAmount(
  amount: number,
  currency: string,
  isNational: boolean,
  registrationDate: string,
): PackageInfo {
  if (amount === 0) {
    return { type: "none", name: "Sin Pago", scratch: false }
  }

  const regDate = new Date(registrationDate)
  const earlyBirdDeadline = new Date("2025-07-22T23:59:59.999Z")
  const isEarlyBird = regDate <= earlyBirdDeadline

  // All amounts are in USD
  if (isNational) {
    // National players - amounts in USD equivalent
    if (amount >= 150 && amount <= 160) {
      return {
        type: "package4",
        name: "4 Reenganches + Scratch",
        scratch: true,
        description: `Paquete con 4 reenganches + Scratch (${isEarlyBird ? "Early Bird" : "Regular"})`,
      }
    } else if (amount >= 140 && amount < 150) {
      return {
        type: "package4",
        name: "4 Reenganches",
        scratch: false,
        description: `Paquete con 4 reenganches (${isEarlyBird ? "Early Bird" : "Regular"})`,
      }
    } else if (amount >= 130 && amount < 140) {
      return {
        type: "package3",
        name: "3 Reenganches + Scratch",
        scratch: true,
        description: `Paquete con 3 reenganches + Scratch (${isEarlyBird ? "Early Bird" : "Regular"})`,
      }
    } else if (amount >= 120 && amount < 130) {
      return {
        type: "package3",
        name: "3 Reenganches",
        scratch: false,
        description: `Paquete con 3 reenganches (${isEarlyBird ? "Early Bird" : "Regular"})`,
      }
    } else if (amount >= 110 && amount < 120) {
      return {
        type: "basic",
        name: "Básico + Scratch",
        scratch: true,
        description: `Paquete básico + Scratch (${isEarlyBird ? "Early Bird" : "Regular"})`,
      }
    } else if (amount >= 100 && amount < 110) {
      return {
        type: "basic",
        name: "Básico Nacional",
        scratch: false,
        description: `Paquete básico (${isEarlyBird ? "Early Bird" : "Regular"})`,
      }
    }
  } else {
    // International players - amounts in USD
    if (amount >= 220 && amount <= 240) {
      return {
        type: "package8",
        name: "8 Reenganches + Scratch",
        scratch: true,
        description: `Paquete Desesperado + Scratch (${isEarlyBird ? "Early Bird" : "Regular"})`,
      }
    } else if (amount >= 200 && amount < 220) {
      return {
        type: "package8",
        name: "8 Reenganches",
        scratch: false,
        description: `Paquete Desesperado (${isEarlyBird ? "Early Bird" : "Regular"})`,
      }
    } else if (amount >= 170 && amount < 200) {
      return {
        type: "package5",
        name: "5 Reenganches + Scratch",
        scratch: true,
        description: `Paquete con 5 reenganches + Scratch (${isEarlyBird ? "Early Bird" : "Regular"})`,
      }
    } else if (amount >= 150 && amount < 170) {
      return {
        type: "package5",
        name: "5 Reenganches",
        scratch: false,
        description: `Paquete con 5 reenganches (${isEarlyBird ? "Early Bird" : "Regular"})`,
      }
    } else if (amount >= 140 && amount < 150) {
      return {
        type: "package3",
        name: "3 Reenganches + Scratch",
        scratch: true,
        description: `Paquete con 3 reenganches + Scratch (${isEarlyBird ? "Early Bird" : "Regular"})`,
      }
    } else if (amount >= 120 && amount < 140) {
      return {
        type: "package3",
        name: "3 Reenganches",
        scratch: false,
        description: `Paquete con 3 reenganches (${isEarlyBird ? "Early Bird" : "Regular"})`,
      }
    } else if (amount >= 110 && amount < 120) {
      return {
        type: "basic",
        name: "Básico + Scratch",
        scratch: true,
        description: `Paquete básico + Scratch (${isEarlyBird ? "Early Bird" : "Regular"})`,
      }
    } else if (amount >= 100 && amount < 110) {
      return {
        type: "basic",
        name: "Básico Internacional",
        scratch: false,
        description: `Paquete básico (${isEarlyBird ? "Early Bird" : "Regular"})`,
      }
    }
  }

  // Default case for amounts that don't match expected ranges
  return {
    type: "custom",
    name: `Pago Personalizado ($${amount})`,
    scratch: false,
    description: "Monto no estándar",
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function getExpectedPackageCost(
  packageType: string,
  isNational: boolean,
  hasScratch: boolean,
  isEarlyBird: boolean,
): number {
  let baseCost = 0

  if (isNational) {
    // National packages in USD equivalent
    switch (packageType) {
      case "package4":
        baseCost = isEarlyBird ? 140 : 150
        break
      case "package3":
        baseCost = isEarlyBird ? 125 : 135
        break
      default:
        baseCost = isEarlyBird ? 125 : 135
    }
  } else {
    // International packages in USD
    switch (packageType) {
      case "package8":
        baseCost = isEarlyBird ? 201 : 210
        break
      case "package5":
        baseCost = isEarlyBird ? 153 : 163
        break
      case "package3":
        baseCost = isEarlyBird ? 122 : 132
        break
      default:
        baseCost = isEarlyBird ? 122 : 132
    }
  }

  // Add scratch cost
  if (hasScratch) {
    baseCost += isNational ? 22 : 22 // Scratch cost in USD
  }

  return baseCost
}
