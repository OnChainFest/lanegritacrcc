import { type NextRequest, NextResponse } from "next/server"

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    const tests = {
      providedUsername: username,
      expectedUsername: ADMIN_USERNAME,
      usernameMatch: username === ADMIN_USERNAME,
      providedPassword: password,
      expectedPassword: ADMIN_PASSWORD,
      passwordMatch: password === ADMIN_PASSWORD,
      hasPasswordHash: false,
    }

    const success = tests.usernameMatch && tests.passwordMatch

    return NextResponse.json({
      success,
      tests,
      message: success ? "Credenciales válidas" : "Credenciales inválidas",
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error.message,
      tests: null,
    })
  }
}
