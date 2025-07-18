import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs"

// Configuración de producción usando variables de entorno
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-in-production"
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "24h"
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin"
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH // Hash bcrypt de la contraseña

export interface AuthUser {
  id: string
  username: string
  role: "admin"
  loginTime: string
  ip?: string
  userAgent?: string
}

export interface LoginAttempt {
  ip: string
  username: string
  success: boolean
  timestamp: string
  userAgent?: string
}

export class ProductionAuthService {
  // Generar hash de contraseña (usar esto para crear ADMIN_PASSWORD_HASH)
  static async hashPassword(password: string): Promise<string> {
    const saltRounds = 12
    return await bcrypt.hash(password, saltRounds)
  }

  // Verificar contraseña
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash)
  }

  // Login con logging y rate limiting
  static async login(
    username: string,
    password: string,
    ip: string,
    userAgent?: string,
  ): Promise<{ success: boolean; error?: string; token?: string; user?: AuthUser }> {
    // Log del intento de login
    const loginAttempt: LoginAttempt = {
      ip,
      username,
      success: false,
      timestamp: new Date().toISOString(),
      userAgent,
    }

    try {
      // Verificar rate limiting (máximo 5 intentos por IP en 15 minutos)
      const recentAttempts = await this.getRecentLoginAttempts(ip)
      if (recentAttempts >= 5) {
        await this.logLoginAttempt({ ...loginAttempt, success: false })
        return { success: false, error: "Demasiados intentos. Intente más tarde." }
      }

      // Verificar credenciales
      if (username !== ADMIN_USERNAME) {
        await this.logLoginAttempt({ ...loginAttempt, success: false })
        return { success: false, error: "Credenciales inválidas" }
      }

      if (!ADMIN_PASSWORD_HASH) {
        console.error("ADMIN_PASSWORD_HASH not configured")
        return { success: false, error: "Error de configuración del servidor" }
      }

      const isValidPassword = await this.verifyPassword(password, ADMIN_PASSWORD_HASH)
      if (!isValidPassword) {
        await this.logLoginAttempt({ ...loginAttempt, success: false })
        return { success: false, error: "Credenciales inválidas" }
      }

      // Login exitoso
      const user: AuthUser = {
        id: "admin-001",
        username,
        role: "admin",
        loginTime: new Date().toISOString(),
        ip,
        userAgent,
      }

      const token = jwt.sign(
        {
          userId: user.id,
          username: user.username,
          role: user.role,
          ip: user.ip,
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN },
      )

      // Log login exitoso
      await this.logLoginAttempt({ ...loginAttempt, success: true })
      await this.logUserActivity(user.id, "LOGIN", { ip, userAgent })

      return { success: true, token, user }
    } catch (error) {
      console.error("Login error:", error)
      await this.logLoginAttempt({ ...loginAttempt, success: false })
      return { success: false, error: "Error interno del servidor" }
    }
  }

  // Verificar JWT token
  static async verifyToken(token: string, ip: string): Promise<{ valid: boolean; user?: AuthUser; error?: string }> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any

      // Verificar que la IP coincida (opcional, para mayor seguridad)
      if (decoded.ip && decoded.ip !== ip) {
        await this.logSecurityEvent("IP_MISMATCH", {
          originalIp: decoded.ip,
          currentIp: ip,
          username: decoded.username,
        })
        return { valid: false, error: "Sesión inválida" }
      }

      const user: AuthUser = {
        id: decoded.userId,
        username: decoded.username,
        role: decoded.role,
        loginTime: new Date(decoded.iat * 1000).toISOString(),
        ip: decoded.ip,
      }

      return { valid: true, user }
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return { valid: false, error: "Sesión expirada" }
      }
      return { valid: false, error: "Token inválido" }
    }
  }

  // Logout con logging
  static async logout(userId: string, ip: string): Promise<void> {
    await this.logUserActivity(userId, "LOGOUT", { ip })
  }

  // Rate limiting: obtener intentos recientes
  private static async getRecentLoginAttempts(ip: string): Promise<number> {
    // En producción, usar Redis o base de datos
    // Por ahora simulamos con memoria (no persistente)
    return 0 // Implementar con Redis/DB
  }

  // Logging de intentos de login
  private static async logLoginAttempt(attempt: LoginAttempt): Promise<void> {
    // En producción, guardar en base de datos o servicio de logging
    console.log("LOGIN_ATTEMPT:", JSON.stringify(attempt))

    // Ejemplo de inserción en Supabase:
    /*
    const { supabase } = await import('@/lib/supabase.js')
    await supabase.from('login_attempts').insert([attempt])
    */
  }

  // Logging de actividad de usuario
  private static async logUserActivity(userId: string, action: string, metadata: any): Promise<void> {
    const activity = {
      user_id: userId,
      action,
      metadata,
      timestamp: new Date().toISOString(),
    }

    console.log("USER_ACTIVITY:", JSON.stringify(activity))

    // En producción, guardar en base de datos
    /*
    const { supabase } = await import('@/lib/supabase.js')
    await supabase.from('user_activities').insert([activity])
    */
  }

  // Logging de eventos de seguridad
  private static async logSecurityEvent(event: string, metadata: any): Promise<void> {
    const securityEvent = {
      event,
      metadata,
      timestamp: new Date().toISOString(),
      severity: "HIGH",
    }

    console.log("SECURITY_EVENT:", JSON.stringify(securityEvent))

    // En producción, enviar alerta y guardar en base de datos
  }

  // Generar token de recuperación de contraseña
  static async generatePasswordResetToken(email: string): Promise<string> {
    const resetToken = jwt.sign(
      { email, type: "password_reset" },
      JWT_SECRET,
      { expiresIn: "1h" }, // Token válido por 1 hora
    )

    // En producción, enviar por email
    console.log(`Password reset token for ${email}: ${resetToken}`)

    return resetToken
  }

  // Verificar token de recuperación
  static async verifyPasswordResetToken(token: string): Promise<{ valid: boolean; email?: string }> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any

      if (decoded.type !== "password_reset") {
        return { valid: false }
      }

      return { valid: true, email: decoded.email }
    } catch {
      return { valid: false }
    }
  }
}
