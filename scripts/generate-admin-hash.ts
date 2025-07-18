// Script para generar el hash de la contraseña del administrador
import bcrypt from "bcryptjs"

async function generateAdminHash() {
  const password = "TorneoLaNegrita2025!" // Cambiar por la contraseña deseada
  const saltRounds = 12

  const hash = await bcrypt.hash(password, saltRounds)

  console.log("=".repeat(50))
  console.log("ADMIN PASSWORD HASH GENERATOR")
  console.log("=".repeat(50))
  console.log(`Password: ${password}`)
  console.log(`Hash: ${hash}`)
  console.log("=".repeat(50))
  console.log("Add this to your .env file:")
  console.log(`ADMIN_PASSWORD_HASH=${hash}`)
  console.log("=".repeat(50))
}

generateAdminHash().catch(console.error)
