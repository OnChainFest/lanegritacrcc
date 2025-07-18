import { type NextRequest, NextResponse } from "next/server"
import { ResultsService } from "@/lib/results-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log(`🎯 API Player Profile: Starting request for player ${params.id}`)

    const playerProfile = await ResultsService.getPlayerProfile(params.id)

    console.log("🎯 API Player Profile: Successfully retrieved profile")

    return NextResponse.json({
      success: true,
      data: playerProfile,
      debug: `Profile retrieved for player ${params.id}`,
    })
  } catch (error) {
    console.error("🎯 API Player Profile: Error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch player profile",
        debug: "Error in player profile API",
      },
      { status: 500 },
    )
  }
}
