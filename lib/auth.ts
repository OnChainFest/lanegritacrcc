// Credenciales de administrador (en producción deberían estar en variables de entorno)
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "PadelFlow2025!", // Contraseña segura
}

export interface AuthUser {
  username: string
  role: "admin"
  loginTime: string
}

export class AuthService {
  static async login(
    username: string,
    password: string,
  ): Promise<{ success: boolean; error?: string; user?: AuthUser }> {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      const user: AuthUser = {
        username,
        role: "admin",
        loginTime: new Date().toISOString(),
      }

      return { success: true, user }
    }

    return { success: false, error: "Credenciales inválidas" }
  }

  static async verifySession(token: string): Promise<{ valid: boolean; user?: AuthUser }> {
    try {
      // Decodificar el token simple (en producción usar JWT)
      const decoded = Buffer.from(token, "base64").toString("utf-8")
      const user: AuthUser = JSON.parse(decoded)

      // Verificar que la sesión no sea muy antigua (24 horas)
      const loginTime = new Date(user.loginTime)
      const now = new Date()
      const hoursDiff = (now.getTime() - loginTime.getTime()) / (1000 * 60 * 60)

      if (hoursDiff > 24) {
        return { valid: false }
      }

      return { valid: true, user }
    } catch {
      return { valid: false }
    }
  }

  static createToken(user: AuthUser): string {
    // Token simple (en producción usar JWT)
    return Buffer.from(JSON.stringify(user)).toString("base64")
  }
}
