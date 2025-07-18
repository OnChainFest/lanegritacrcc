export async function GET() {
  try {
    return new Response(
      JSON.stringify({
        success: true,
        message: "Direct Response works",
        env: typeof process !== "undefined" ? "server" : "client",
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
