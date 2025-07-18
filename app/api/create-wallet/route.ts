import { type NextRequest, NextResponse } from "next/server"
import { WalletService } from "@/lib/wallet-service"

export async function POST(request: NextRequest) {
  try {
    const { playerId } = await request.json()

    if (!playerId) {
      return NextResponse.json({ success: false, error: "Player ID is required" }, { status: 400 })
    }

    const result = await WalletService.createWalletForPlayer(playerId)

    if (result.success) {
      return NextResponse.json({
        success: true,
        wallet: {
          address: result.wallet?.wallet_address,
          // No devolver private key ni mnemonic por seguridad
        },
        message: "Wallet created successfully",
      })
    }

    return NextResponse.json({ success: false, error: result.error }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ success: false, error: error?.message || "Unknown error" }, { status: 500 })
  }
}
