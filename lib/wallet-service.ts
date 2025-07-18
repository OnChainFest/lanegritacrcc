import { createClient } from "@supabase/supabase-js"
import { ethers } from "ethers"

// Los wallets son carteras digitales de criptomonedas que se pueden crear para cada jugador
// Esto permite:
// 1. Crear una dirección única de Ethereum para cada participante
// 2. Recibir premios en criptomonedas directamente
// 3. Participar en eventos blockchain o NFTs del torneo
// 4. Crear un ecosistema digital alrededor del torneo

export interface PlayerWallet {
  id: string
  player_id: string
  wallet_address: string
  private_key: string // En producción debe estar encriptado
  mnemonic: string // En producción debe estar encriptado
  is_active: boolean
  network: string
  balance: number
}

export class WalletService {
  private static getSupabaseClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase environment variables")
    }

    return createClient(supabaseUrl, supabaseKey)
  }

  // Crear wallet para un jugador
  static async createPlayerWallet(
    playerId: string,
  ): Promise<{ success: boolean; wallet?: PlayerWallet; error?: string }> {
    try {
      // Generar wallet usando ethers.js
      const wallet = ethers.Wallet.createRandom()

      const walletData = {
        player_id: playerId,
        wallet_address: wallet.address,
        private_key: wallet.privateKey, // ⚠️ En producción: encriptar
        mnemonic: wallet.mnemonic?.phrase || "", // ⚠️ En producción: encriptar
        is_active: true,
        network: "ethereum",
        balance: 0,
      }

      const supabase = this.getSupabaseClient()
      const { data, error } = await supabase.from("player_wallets").insert([walletData]).select().single()

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, wallet: data }
    } catch (error) {
      return { success: false, error: `Error creating wallet: ${error}` }
    }
  }

  // Obtener wallet de un jugador
  static async getPlayerWallet(playerId: string): Promise<PlayerWallet | null> {
    try {
      const supabase = this.getSupabaseClient()
      const { data, error } = await supabase
        .from("player_wallets")
        .select("*")
        .eq("player_id", playerId)
        .eq("is_active", true)
        .single()

      if (error || !data) {
        return null
      }

      return data
    } catch (error) {
      console.error("Error fetching wallet:", error)
      return null
    }
  }

  // Crear wallet automáticamente cuando un jugador es verificado
  static async createWalletOnVerification(playerId: string): Promise<void> {
    try {
      // Verificar si ya tiene wallet
      const existingWallet = await this.getPlayerWallet(playerId)
      if (existingWallet) {
        console.log(`Player ${playerId} already has a wallet`)
        return
      }

      // Crear nuevo wallet
      const result = await this.createPlayerWallet(playerId)
      if (result.success) {
        console.log(`Wallet created for player ${playerId}: ${result.wallet?.wallet_address}`)
      } else {
        console.error(`Failed to create wallet for player ${playerId}:`, result.error)
      }
    } catch (error) {
      console.error("Error in createWalletOnVerification:", error)
    }
  }

  // Obtener balance de un wallet (requiere conexión a blockchain)
  static async getWalletBalance(walletAddress: string): Promise<number> {
    try {
      // En producción, conectar a un proveedor de Ethereum
      // const provider = new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/YOUR_KEY')
      // const balance = await provider.getBalance(walletAddress)
      // return parseFloat(ethers.formatEther(balance))

      // Por ahora retornamos 0
      return 0
    } catch (error) {
      console.error("Error getting balance:", error)
      return 0
    }
  }
}

// Casos de uso para los wallets en el torneo:
// 1. Premios en criptomonedas: Enviar premios directamente a los ganadores
// 2. NFTs de participación: Crear tokens únicos para cada participante
// 3. Tokens de torneo: Crear una moneda propia del evento
// 4. Patrocinios blockchain: Integrar con sponsors que usen crypto
// 5. Merchandising digital: Vender productos digitales del torneo
