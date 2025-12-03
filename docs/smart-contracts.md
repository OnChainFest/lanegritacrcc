# PadelFlow - Arquitectura de Smart Contracts

## 🎯 Visión General

Sistema de smart contracts para automatizar la gestión de prize pools en torneos de pádel en la blockchain de Base.

## 📐 Arquitectura Completa

```
┌─────────────────────────────────────────────────────────────┐
│                     PADELFLOW PLATFORM                       │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────┐
        │         TOURNAMENT CREATION         │
        │  (create-tournament.html + auth.html)│
        └─────────────────────────────────────┘
                              │
                              ▼ Pago exitoso (Stripe)
        ┌─────────────────────────────────────┐
        │    GNOSIS SAFE AUTO-CREATION        │
        │  (Backend creates Safe for organizer)│
        └─────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────┐
        │   SMART CONTRACT DEPLOYMENT         │
        │    TournamentPrizePool.sol          │
        └─────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────┐
        │     FUND PRIZE POOL (Escrow)        │
        │  Organizer → Safe → Contract        │
        └─────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────┐
        │      TOURNAMENT EXECUTION           │
        │   (Players compete - any format)    │
        └─────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────┐
        │    ORGANIZER SETS RESULTS           │
        │  (Via admin panel + wallet signature)│
        └─────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────┐
        │   AUTOMATIC PRIZE DISTRIBUTION      │
        │  Contract → Winners' Wallets        │
        └─────────────────────────────────────┘
                              │
                              ▼
        ┌─────────────────────────────────────┐
        │        TRANSACTION COMPLETE         │
        │   (Visible on Basescan explorer)    │
        └─────────────────────────────────────┘
```

## 🔐 Componentes del Sistema

### 1. Gnosis Safe (Organizador)

**Propósito:** Wallet multi-firma del organizador para máxima seguridad.

**Creación:**
- **Cuándo:** Automáticamente después del pago exitoso en `auth.html`
- **Cómo:** Backend llama a Gnosis Safe SDK
- **Owner inicial:** Wallet del organizador

**Implementación pendiente:**
```typescript
// lib/gnosis-safe-service.ts
import Safe, { EthersAdapter } from '@safe-global/protocol-kit';

export async function createOrganizerSafe(organizerAddress: string) {
  const adapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer
  });

  const safeAccountConfig = {
    owners: [organizerAddress],
    threshold: 1
  };

  const safeSdk = await Safe.create({
    ethAdapter: adapter,
    safeAccountConfig
  });

  const safeAddress = await safeSdk.getAddress();

  // Guardar en DB
  await supabase.from("tournaments").update({
    organizer_safe_address: safeAddress
  }).eq("organizer_wallet", organizerAddress);

  return safeAddress;
}
```

### 2. TournamentPrizePool Contract

**Propósito:** Escrow y distribución automatizada de premios.

**Características:**
- Recibe fondos del Gnosis Safe
- Almacena prize pool en escrow on-chain
- Permite al organizador setear ganadores
- Distribuye automáticamente según porcentajes

**Deployment:**
```typescript
// app/api/tournaments/[id]/deploy-contract/route.ts
export async function POST(req: Request) {
  const { tournamentId, name, format, safeAddress } = await req.json();

  // Deploy contract with Safe as owner
  const contract = await factory.deploy(
    tournamentId,
    name,
    format,
    safeAddress // ← El Safe es el owner
  );

  return { contractAddress: await contract.getAddress() };
}
```

### 3. Player Wallets (BASE SDK)

**Propósito:** Wallet para cada jugador para recibir premios.

**Opciones:**
1. **Conectar wallet existente** (WalletConnect, Coinbase Wallet)
2. **Auto-crear BASE Smart Wallet** (si no tienen)

**Implementación pendiente:**
```typescript
// components/wallet-connect.tsx
import { OnchainKitProvider, ConnectWallet } from '@coinbase/onchainkit';

export function PlayerWalletConnect() {
  return (
    <OnchainKitProvider apiKey={process.env.ONCHAINKIT_API_KEY}>
      <ConnectWallet>
        <button>Connect Wallet or Create New</button>
      </ConnectWallet>
    </OnchainKitProvider>
  );
}
```

## 🔄 Flujo Completo End-to-End

### Fase 1: Configuración del Torneo

**1.1 Usuario crea torneo**
```
create-tournament.html
 ↓ [Usuario completa wizard: Americano, 16 jugadores, €500 prize pool]
 ↓ [Click "Crear cuenta y activar torneo"]
auth.html
```

**1.2 Pago y autenticación**
```
auth.html
 ↓ [Usuario paga €29.99 con Stripe]
 ↓ [Pago exitoso]
Backend: POST /api/tournaments/create
 ↓ Crea torneo en DB
 ↓ Llama createOrganizerSafe()
 ↓ Guarda safe_address en tournaments table
```

**1.3 Deploy del smart contract**
```
Backend: POST /api/tournaments/:id/deploy-contract
 ↓ Deploy TournamentPrizePool.sol
 ↓ Owner = Gnosis Safe address
 ↓ Guarda contract_address en DB
```

### Fase 2: Funding del Prize Pool

**2.1 Organizador accede al admin panel**
```
dashboard.html → Ver torneo activo
 ↓ [Click "Manage Tournament"]
app/admin/tournaments/[id]
```

**2.2 Funding del escrow**
```
Admin Panel:
  [Smart Contract Management]
   ├─ Contract Address: 0xABC...
   ├─ Current Balance: 0 ETH
   ├─ Target Prize Pool: €500 (~0.15 ETH)
   └─ [Fund Escrow] button

Usuario click [Fund Escrow]
 ↓ Connect Gnosis Safe (wallet signature)
 ↓ Approve transaction from Safe → Contract
 ↓ contract.fundPrizePool({ value: 0.15 ETH })
 ↓ ✅ Funds locked in escrow
```

### Fase 3: Torneo y Resultados

**3.1 Jugadores se registran**
```
Invitation link: padelflow.com/t/123456
 ↓ Jugador abre link
 ↓ [Connect Wallet or Create New]
 ↓ Opción A: Connect existing (MetaMask, Coinbase)
 ↓ Opción B: Create BASE Smart Wallet (auto)
 ↓ wallet_address guardado en players table
```

**3.2 Torneo se juega**
```
[Días/semanas del torneo]
 ↓ Organizador carga resultados en dashboard
 ↓ Sistema calcula clasificación final
```

**3.3 Organizador setea ganadores**
```
Admin Panel:
  [Tournament Results]
   ├─ 1st: Juan Pérez (0xDEF...)
   ├─ 2nd: María García (0xGHI...)
   ├─ 3rd: Carlos López (0xJKL...)
   └─ [Submit Results to Blockchain]

Usuario click [Submit Results]
 ↓ Firma transacción con Safe
 ↓ contract.setWinners(0xDEF, 0xGHI, 0xJKL, [50, 30, 20])
 ↓ ✅ Winners set on-chain
```

### Fase 4: Distribución Automática

**4.1 Trigger distribution**
```
Admin Panel:
  [Prize Distribution]
   ├─ Total Pool: 0.15 ETH
   ├─ 1st (50%): 0.075 ETH → 0xDEF...
   ├─ 2nd (30%): 0.045 ETH → 0xGHI...
   ├─ 3rd (20%): 0.030 ETH → 0xJKL...
   └─ [Distribute Prizes] button

Usuario click [Distribute Prizes]
 ↓ Firma con Safe
 ↓ contract.distributePrizes()
 ↓ Smart contract ejecuta:
     - Transfer 0.075 ETH → 0xDEF (Juan)
     - Transfer 0.045 ETH → 0xGHI (María)
     - Transfer 0.030 ETH → 0xJKL (Carlos)
 ↓ ✅ Todos reciben premios automáticamente
```

**4.2 Confirmación**
```
[Basescan Events]
 ├─ PrizesDistributed event emitted
 ├─ TX hash: 0xABC123...
 └─ Visible públicamente

[Dashboard]
 ├─ Status: "Prizes Distributed ✅"
 ├─ Link to Basescan TX
 └─ Email notifications a ganadores
```

## 📊 Estructura de Datos

### Tournaments Table

```sql
CREATE TABLE tournaments (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  format TEXT NOT NULL, -- 'americano', 'round-robin', etc.
  organizer_wallet TEXT,
  organizer_safe_address TEXT, -- Gnosis Safe
  contract_address TEXT, -- TournamentPrizePool address
  contract_deployed_at TIMESTAMP,
  prize_pool_amount DECIMAL,
  prize_pool_currency TEXT,
  status TEXT, -- 'pending', 'active', 'completed', 'prizes_distributed'
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Player Wallets Table

```sql
CREATE TABLE player_wallets (
  id UUID PRIMARY KEY,
  player_id UUID REFERENCES players(id),
  wallet_address TEXT UNIQUE NOT NULL,
  wallet_type TEXT, -- 'connected', 'base_smart_wallet'
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🎨 UI Components Necesarios

### Admin Panel - Smart Contract Management

```typescript
// app/admin/tournaments/[id]/components/SmartContractPanel.tsx

export function SmartContractPanel({ tournament }) {
  const { contractAddress, safeAddress } = tournament;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Smart Contract Management</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Contract Info */}
        <div>
          <Label>Contract Address</Label>
          <div className="flex items-center gap-2">
            <Code>{contractAddress}</Code>
            <Link href={`https://basescan.org/address/${contractAddress}`}>
              View on Basescan
            </Link>
          </div>
        </div>

        {/* Gnosis Safe */}
        <div>
          <Label>Organizer Safe</Label>
          <div className="flex items-center gap-2">
            <Code>{safeAddress}</Code>
            <Link href={`https://app.safe.global/home?safe=base:${safeAddress}`}>
              Open Safe App
            </Link>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4">
          <Button onClick={handleFundEscrow}>
            Fund Prize Pool
          </Button>

          <Button onClick={handleSetWinners} disabled={!resultsFinalized}>
            Submit Results to Blockchain
          </Button>

          <Button onClick={handleDistribute} disabled={!winnersSet}>
            Distribute Prizes
          </Button>
        </div>

        {/* Status */}
        <ContractStatus
          balance={contractBalance}
          winnersSet={winnersSet}
          distributed={prizesDistributed}
        />
      </CardContent>
    </Card>
  );
}
```

## 🔧 Variables de Entorno Necesarias

```env
# Base Network
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASE_MAINNET_RPC_URL=https://mainnet.base.org

# Smart Contracts
DEPLOYER_PRIVATE_KEY=0x...
BASESCAN_API_KEY=...

# Gnosis Safe
GNOSIS_SAFE_SERVICE_URL=https://safe-transaction-base.safe.global

# Coinbase/BASE
ONCHAINKIT_API_KEY=...
COINBASE_WALLET_PROJECT_ID=...

# Existing
STRIPE_SECRET_KEY=...
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
```

## 📝 Siguientes Pasos

### Fase 1 - Smart Contract (✅ COMPLETADO)
- [x] TournamentPrizePool.sol creado
- [x] Tests unitarios
- [x] Scripts de deployment
- [x] Documentación

### Fase 2 - Gnosis Safe Integration (🔜 PENDIENTE)
- [ ] Instalar `@safe-global/protocol-kit`
- [ ] Crear `lib/gnosis-safe-service.ts`
- [ ] Endpoint `POST /api/safes/create`
- [ ] Trigger auto-creación post-pago

### Fase 3 - Contract Deployment API (🔜 PENDIENTE)
- [ ] Endpoint `POST /api/tournaments/[id]/deploy-contract`
- [ ] Almacenar contract_address en DB
- [ ] Admin UI para ver contract info

### Fase 4 - BASE Wallets (🔜 PENDIENTE)
- [ ] Instalar `@coinbase/onchainkit`
- [ ] Componente `<WalletConnect>`
- [ ] Auto-creación de Smart Wallets
- [ ] Almacenar wallet_address de jugadores

### Fase 5 - Admin Panel Integration (🔜 PENDIENTE)
- [ ] Smart Contract Management section
- [ ] Fund Escrow button
- [ ] Set Winners button
- [ ] Distribute Prizes button
- [ ] Transaction history

### Fase 6 - Testing End-to-End (🔜 PENDIENTE)
- [ ] Test completo en Base Sepolia
- [ ] Documentar gas costs reales
- [ ] Crear video demo

### Fase 7 - Auditoría y Mainnet (🔜 FUTURO)
- [ ] Auditoría profesional del smart contract
- [ ] Deploy a Base Mainnet
- [ ] Monitoreo y alertas

## 🚀 Deploy Rápido (Testnet)

```bash
# 1. Configurar env
cp .env.example .env
# Editar .env con tus keys

# 2. Compilar contrato
npm run compile

# 3. Deploy a Base Sepolia
npm run deploy:sepolia

# 4. Guardar contract address
# Output: ✅ Deployed to: 0xABC...

# 5. Actualizar DB
psql> UPDATE tournaments SET contract_address = '0xABC...' WHERE id = '...';

# 6. Testar en admin panel
# Abrir https://padelflow.com/admin/tournaments/[id]
```

## 📚 Referencias

- [Smart Contract Code](../contracts/TournamentPrizePool.sol)
- [Deployment Script](../scripts/deploy-tournament-pool.js)
- [Test Suite](../test/contracts/TournamentPrizePool.test.js)
- [Hardhat Config](../hardhat.config.js)
- [Gnosis Safe Docs](https://docs.safe.global)
- [BASE Network Docs](https://docs.base.org)
- [OnchainKit Docs](https://onchainkit.xyz)
