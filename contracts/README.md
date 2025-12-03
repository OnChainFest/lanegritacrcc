# PadelFlow Smart Contracts

Sistema de smart contracts para gestión automatizada de prize pools en torneos de pádel.

## 📋 Contenido

- `TournamentPrizePool.sol` - Contrato principal para escrow y distribución de premios

## 🏗️ Arquitectura

### TournamentPrizePool.sol

Contrato diseñado para manejar el prize pool de cualquier formato de torneo de PadelFlow.

**Características:**
- ✅ Escrow seguro de fondos del prize pool
- ✅ Distribución automática a top 3 ganadores
- ✅ Soporta distribuciones flexibles (50-30-20, 60-30-10, custom)
- ✅ Compatible con todos los formatos (Americano, Round Robin, Eliminación, Liga)
- ✅ Emergency withdrawal para el organizador
- ✅ Eventos on-chain para transparencia
- ✅ Protección contra reentrancy attacks
- ✅ Ownership control con OpenZeppelin

**Flujo de uso:**

```
1. Deploy contract → Tournament created
2. fundPrizePool() → Organizer adds funds
3. [Tournament plays out]
4. setWinners() → Organizer sets results
5. distributePrizes() → Automatic distribution
```

## 🚀 Setup

### 1. Instalar dependencias

```bash
npm install
```

**Nota sobre Hardhat:** El proyecto usa Hardhat 3.x que requiere Node.js ESM. Si encuentras errores de configuración:

**Opción A - Usar Hardhat 2.x (Recomendado para compatibilidad):**
```bash
npm uninstall hardhat
npm install --save-dev hardhat@^2.22.0 --force
```

**Opción B - Configurar para ESM (Hardhat 3.x):**
```bash
# Asegúrate de que package.json tenga:
# "type": "module"

# Y todos los archivos .js usen import/export en vez de require
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# RPC URLs
BASE_SEPOLIA_RPC_URL=https://sepolia.base.org
BASE_MAINNET_RPC_URL=https://mainnet.base.org

# Private key del deployer (⚠️ NUNCA commitear esto)
DEPLOYER_PRIVATE_KEY=tu_private_key_aqui

# API key para verificación en Basescan
BASESCAN_API_KEY=tu_basescan_api_key
```

**⚠️ IMPORTANTE:** Nunca commitear el `.env` con claves reales. Usa un wallet de testeo.

### 3. Compilar contratos

```bash
npm run compile
```

Esto genera los artifacts en `artifacts/` y los typings en `typechain-types/`.

## 📝 Scripts disponibles

```json
{
  "compile": "hardhat compile",
  "test:contracts": "hardhat test",
  "deploy:local": "hardhat run scripts/deploy-tournament-pool.js --network hardhat",
  "deploy:sepolia": "hardhat run scripts/deploy-tournament-pool.js --network baseSepolia",
  "deploy:base": "hardhat run scripts/deploy-tournament-pool.js --network base"
}
```

## 🧪 Testing

### Ejecutar tests

```bash
npm run test:contracts
```

### Coverage

```bash
npx hardhat coverage
```

## 🚢 Deployment

### Testnet (Base Sepolia)

```bash
# 1. Asegúrate de tener ETH en Base Sepolia
# Faucet: https://www.coinbase.com/faucets/base-ethereum-goerli-faucet

# 2. Deploy
npm run deploy:sepolia

# 3. El script automáticamente verificará el contrato en Basescan
```

### Mainnet (Base)

```bash
# ⚠️ SOLO para producción con fondos reales
npm run deploy:base
```

### Output esperado

```
🚀 Starting TournamentPrizePool deployment...

📝 Deploying with account: 0x...
💰 Account balance: 0.5 ETH

🎾 Tournament Details:
   ID: 1733193600000
   Name: Demo Tournament - Verano 2025
   Format: americano
   Organizer: 0x...

⏳ Deploying TournamentPrizePool contract...
✅ TournamentPrizePool deployed to: 0xABC...

🔗 View on Block Explorer:
https://sepolia.basescan.org/address/0xABC...
```

## 💡 Uso del contrato

### 1. Fund Prize Pool

```javascript
const tx = await contract.fundPrizePool({
  value: ethers.parseEther("10.0") // 10 ETH
});
await tx.wait();
```

### 2. Set Winners

```javascript
const winner1 = "0x..."; // 1st place wallet
const winner2 = "0x..."; // 2nd place wallet
const winner3 = "0x..."; // 3rd place wallet

// Distribution: 50% - 30% - 20%
const distribution = [50, 30, 20];

const tx = await contract.setWinners(
  winner1,
  winner2,
  winner3,
  distribution
);
await tx.wait();
```

### 3. Distribute Prizes

```javascript
const tx = await contract.distributePrizes();
await tx.wait();

// ✅ Prizes sent automatically!
// 1st: 5 ETH
// 2nd: 3 ETH
// 3rd: 2 ETH
```

## 🔗 Integración con Backend

### Crear contrato después del pago

```typescript
// app/api/tournaments/[id]/deploy-contract/route.ts

import { ethers } from "ethers";
import TournamentPrizePoolArtifact from "@/artifacts/contracts/TournamentPrizePool.sol/TournamentPrizePool.json";

export async function POST(req: Request) {
  const { tournamentId, name, format, organizerAddress } = await req.json();

  const provider = new ethers.JsonRpcProvider(process.env.BASE_SEPOLIA_RPC_URL);
  const wallet = new ethers.Wallet(process.env.DEPLOYER_PRIVATE_KEY!, provider);

  const factory = new ethers.ContractFactory(
    TournamentPrizePoolArtifact.abi,
    TournamentPrizePoolArtifact.bytecode,
    wallet
  );

  const contract = await factory.deploy(
    tournamentId,
    name,
    format,
    organizerAddress
  );

  await contract.waitForDeployment();
  const address = await contract.getAddress();

  // Guardar en DB
  await supabase.from("tournaments").update({
    contract_address: address,
    contract_deployed_at: new Date().toISOString()
  }).eq("id", tournamentId);

  return Response.json({ contractAddress: address });
}
```

### Listener de eventos

```typescript
// Monitor prize distribution events
contract.on("PrizesDistributed", (first, firstAmount, second, secondAmount, third, thirdAmount) => {
  console.log(`Prizes distributed!`);
  console.log(`1st: ${ethers.formatEther(firstAmount)} ETH to ${first}`);
  console.log(`2nd: ${ethers.formatEther(secondAmount)} ETH to ${second}`);
  console.log(`3rd: ${ethers.formatEther(thirdAmount)} ETH to ${third}`);

  // Actualizar DB
  updateTournamentStatus(tournamentId, "prizes_distributed");
});
```

## 🔐 Seguridad

### Auditoría

**Estado:** Contrato NO auditado. Usar solo en testnet hasta auditoría profesional.

**Consideraciones de seguridad:**
- ✅ Usa OpenZeppelin Ownable para control de acceso
- ✅ Usa ReentrancyGuard para prevenir ataques
- ✅ Checks-Effects-Interactions pattern
- ✅ Input validation completa
- ⚠️ Requiere auditoría antes de mainnet con fondos reales

### Best Practices

1. **Nunca commitear private keys**
2. **Usar Gnosis Safe** como owner en producción (multi-sig)
3. **Testing exhaustivo** antes de deploy a mainnet
4. **Monitorear eventos** on-chain
5. **Emergency withdrawal** solo para casos extremos

## 📊 Gas Costs (Estimados en Base Sepolia)

| Operación | Gas estimado | Costo (~1 gwei) |
|-----------|--------------|-----------------|
| Deploy | ~2,000,000 | ~0.002 ETH |
| fundPrizePool | ~50,000 | ~0.00005 ETH |
| setWinners | ~100,000 | ~0.0001 ETH |
| distributePrizes | ~150,000 | ~0.00015 ETH |

## 🛠️ Troubleshooting

### Error: "Module not found"
```bash
# Limpiar cache y reinstalar
rm -rf node_modules artifacts cache typechain-types
npm install
npm run compile
```

### Error: "Network not found"
Verificar que `hardhat.config.js` tenga la red configurada y `.env` tenga las URLs correctas.

### Error: "Insufficient funds"
Obtener ETH de testnet del faucet de Base Sepolia.

## 📚 Recursos

- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [Base Network Docs](https://docs.base.org)
- [Basescan](https://basescan.org) - Block explorer
- [Base Sepolia Faucet](https://www.coinbase.com/faucets/base-ethereum-goerli-faucet)

## 🤝 Contribuir

1. Fork el proyecto
2. Crear feature branch (`git checkout -b feature/amazing-feature`)
3. Commit cambios (`git commit -m 'Add amazing feature'`)
4. Push a branch (`git push origin feature/amazing-feature`)
5. Abrir Pull Request

## 📄 Licencia

MIT License - Ver `LICENSE` file para detalles.

## ⚠️ Disclaimer

Este smart contract es para propósitos educativos y de demostración. **NO ha sido auditado** y no debe usarse en producción con fondos reales sin una auditoría profesional completa.
