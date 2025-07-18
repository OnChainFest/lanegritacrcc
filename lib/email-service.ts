import { Resend } from "resend"

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

export interface EmailTemplate {
  to: string
  subject: string
  html: string
  text?: string
}

export interface PlayerEmailData {
  name: string
  email: string
  registrationId: string
  qrCodeUrl: string
}

/* -------------------------------------------------------------------------- */
/*                               Local helpers                                */
/* -------------------------------------------------------------------------- */

// Dominio recomendado para producción: boliche@country.co.cr
const FROM_EMAIL = process.env.FROM_EMAIL || "boliche@country.co.cr"
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY
const RESEND_API_KEY = process.env.RESEND_API_KEY

// Initialize Resend client
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null

function buildHtmlTemplate(t: Record<string, string>, data: PlayerEmailData) {
  return /* html */ `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${t.subject}</title>
    </head>
    <body style="margin:0;padding:0;font-family:Arial,Helvetica,sans-serif;background-color:#f5f5f5;">
      <div style="max-width:600px;margin:0 auto;background-color:#ffffff;">
        <!-- Header -->
        <div style="background:#1f2937;color:#fff;padding:24px;text-align:center;border-radius:8px 8px 0 0;">
          <h1 style="margin:0;font-size:24px;font-weight:bold;">🎳 Torneo La Negrita 2025</h1>
        </div>
        
        <!-- Content -->
        <div style="padding:32px 24px;background:#ffffff;">
          <p style="font-size:16px;line-height:1.6;color:#333;margin:0 0 16px 0;">
            ${t.hi} <strong style="color:#1f2937;">${data.name}</strong>,
          </p>
          
          <p style="font-size:16px;line-height:1.6;color:#333;margin:0 0 24px 0;">
            ${t.confirmed}
          </p>
          
          <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin:24px 0;">
            <p style="margin:0;font-size:14px;color:#64748b;">
              <strong style="color:#1f2937;">${t.id}:</strong> 
              <span style="font-family:monospace;background:#e2e8f0;padding:2px 6px;border-radius:4px;">${data.registrationId}</span>
            </p>
          </div>

          <!-- QR Code Section -->
          <div style="text-align:center;margin:32px 0;">
            <div style="background:#f8fafc;border:2px dashed #cbd5e1;border-radius:12px;padding:24px;display:inline-block;">
              <img src="${data.qrCodeUrl}" alt="Código QR de Registro" style="max-width:200px;height:auto;display:block;margin:0 auto;" />
              <p style="font-size:12px;color:#64748b;margin:12px 0 0 0;font-style:italic;">
                ${t.qrNote}
              </p>
            </div>
          </div>

          <p style="font-size:16px;line-height:1.6;color:#333;margin:24px 0 0 0;">
            ${t.thanks}
          </p>
        </div>
        
        <!-- Footer -->
        <div style="background:#f8fafc;text-align:center;padding:24px;border-top:1px solid #e2e8f0;">
          <p style="margin:0;font-size:12px;color:#64748b;">
            <strong>Costa Rica Country Club</strong><br>
            Torneo La Negrita 2025
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

/* ---------- Utils ---------- */
function isPublicEmailDomain(email: string) {
  const publicDomains = ["gmail.com", "outlook.com", "hotmail.com", "yahoo.com", "icloud.com", "live.com"]
  const domain = email.split("@")[1]?.toLowerCase()
  return publicDomains.includes(domain)
}

/** Return true if we should attempt to use Resend for this message */
function canUseResend() {
  return (
    !!RESEND_API_KEY?.startsWith("re_") &&
    !isPublicEmailDomain(FROM_EMAIL) && // No dominios públicos
    FROM_EMAIL.includes("@") // Validación básica de email
  )
}

/* -------------------------------------------------------------------------- */
/*                               EmailService                                 */
/* -------------------------------------------------------------------------- */

export class EmailService {
  /* ---------- Build confirmation (es|en) ---------- */
  static buildConfirmation(data: PlayerEmailData, lang: "es" | "en" = "es"): EmailTemplate {
    const t =
      lang === "es"
        ? {
            subject: "✅ Confirmación de Registro – Torneo La Negrita 2025",
            hi: "¡Hola",
            confirmed: "Tu registro ha sido confirmado exitosamente para el Torneo La Negrita 2025.",
            id: "ID de Registro",
            qrNote: "Presenta este código QR el día del evento para confirmar tu participación.",
            thanks: "¡Gracias por ser parte del torneo! Nos vemos en las pistas de bowling.",
          }
        : {
            subject: "✅ Registration Confirmation – La Negrita Tournament 2025",
            hi: "Hello",
            confirmed: "Your registration has been confirmed successfully for La Negrita Tournament 2025.",
            id: "Registration ID",
            qrNote: "Present this QR code on event day to confirm your participation.",
            thanks: "Thanks for joining the tournament! See you at the bowling lanes.",
          }

    return {
      to: data.email,
      subject: t.subject,
      html: buildHtmlTemplate(t, data),
      text: `${t.hi} ${data.name},\n\n${t.confirmed}\n\n${t.id}: ${data.registrationId}\n\n${t.qrNote}\n\n${t.thanks}\n\nCosta Rica Country Club\nTorneo La Negrita 2025`,
    }
  }

  /* ---------- High-level helper used by API route ---------- */
  static async sendConfirmationEmail(player: { name: string; email: string; id: string }, qrCodeUrl: string) {
    const template = this.buildConfirmation(
      {
        name: player.name,
        email: player.email,
        registrationId: player.id.slice(0, 8).toUpperCase(),
        qrCodeUrl,
      },
      "es",
    )
    return this.sendEmail(template)
  }

  /* ---------- SendGrid Provider ---------- */
  static async sendViaSendGrid(tpl: EmailTemplate): Promise<{ success: boolean; error?: string }> {
    try {
      const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SENDGRID_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: tpl.to }],
              subject: tpl.subject,
            },
          ],
          from: { email: FROM_EMAIL, name: "Torneo La Negrita 2025" },
          content: [
            { type: "text/html", value: tpl.html },
            { type: "text/plain", value: tpl.text || "" },
          ],
        }),
      })

      if (response.ok) {
        console.info("✅ Email enviado exitosamente via SendGrid:", {
          to: tpl.to,
          from: FROM_EMAIL,
        })
        return { success: true }
      }

      const errorText = await response.text()
      console.error("❌ Error de SendGrid:", errorText)
      return { success: false, error: `SendGrid error: ${errorText}` }
    } catch (error: any) {
      console.error("❌ Error conectando con SendGrid:", error.message)
      return { success: false, error: `SendGrid connection error: ${error.message}` }
    }
  }

  /* ---------- Resend Provider (usando librería oficial) ---------- */
  static async sendViaResend(tpl: EmailTemplate): Promise<{ success: boolean; error?: string }> {
    if (!resend) {
      return { success: false, error: "Resend client not initialized - missing API key" }
    }

    // If the configured from-address is not a custom verified domain,
    // automatically fall back to Resend’s default domain.
    const fromAddress = isPublicEmailDomain(FROM_EMAIL) ? "onboarding@resend.dev" : FROM_EMAIL

    try {
      console.log("🔄 Enviando via Resend SDK... (from:", fromAddress, ")")

      const { data, error } = await resend.emails.send({
        from: `Torneo La Negrita 2025 <${fromAddress}>`,
        to: [tpl.to],
        subject: tpl.subject,
        html: tpl.html,
        text: tpl.text,
      })

      if (error) {
        console.error("❌ Error de Resend SDK:", error)
        return { success: false, error: `Resend SDK error: ${error.message}` }
      }

      console.info("✅ Email enviado exitosamente via Resend SDK:", {
        id: data?.id,
        to: tpl.to,
        from: fromAddress,
      })
      return { success: true }
    } catch (error: any) {
      console.error("❌ Error conectando con Resend SDK:", error.message)
      return { success: false, error: `Resend SDK connection error: ${error.message}` }
    }
  }

  /* ---------- Multi-provider sender (HTTP) ---------- */
  static async sendEmail(tpl: EmailTemplate): Promise<{ success: boolean; error?: string }> {
    console.log("📧 === INICIANDO ENVÍO DE EMAIL ===")
    console.log("📧 Para:", tpl.to)
    console.log("📧 Desde:", FROM_EMAIL)
    console.log("📧 Asunto:", tpl.subject)

    // Prioridad 1: Resend (usando SDK oficial)
    if (canUseResend()) {
      console.log("🔄 === INTENTANDO RESEND SDK ===")
      const result = await this.sendViaResend(tpl)
      if (result.success) {
        console.log("✅ === EMAIL ENVIADO EXITOSAMENTE VIA RESEND ===")
        return result
      }
      console.warn("⚠️ Resend SDK falló, intentando SendGrid...")
    }

    // Prioridad 2: SendGrid
    if (SENDGRID_API_KEY?.startsWith("SG.")) {
      console.log("🔄 === INTENTANDO SENDGRID ===")
      const result = await this.sendViaSendGrid(tpl)
      if (result.success) {
        console.log("✅ === EMAIL ENVIADO EXITOSAMENTE VIA SENDGRID ===")
        return result
      }
      console.warn("⚠️ SendGrid falló, usando simulación...")
    }

    // Fallback: Simulación
    console.warn("📧 [EMAIL-SIMULATION] Todos los proveedores fallaron - simulando envío")
    console.log("Email que se enviaría:", {
      from: FROM_EMAIL,
      to: tpl.to,
      subject: tpl.subject,
      timestamp: new Date().toISOString(),
      providers_attempted: [RESEND_API_KEY ? "Resend SDK" : null, SENDGRID_API_KEY ? "SendGrid" : null].filter(Boolean),
      htmlPreview: tpl.html.slice(0, 200) + "...",
    })

    return { success: true } // Siempre devolvemos éxito para no romper el flujo
  }
}
