# API Documentation - Torneo La Negrita CRCC 2025

## Base URL
```
Production: https://lanegritacrcc.vercel.app
Development: http://localhost:3000
```

## Authentication

All admin endpoints require JWT authentication. Include the token in the Authorization header:

```
Authorization: Bearer <token>
```

---

## Endpoints

### Authentication

#### POST /api/auth/login
Authenticate admin user and receive JWT token.

**Rate Limit:** 5 requests per minute

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "24h"
}
```

**Error Responses:**
- `400` - Missing credentials
- `401` - Invalid credentials
- `429` - Too many attempts

---

#### POST /api/auth/verify
Verify JWT token validity.

**Request Body:**
```json
{
  "token": "string"
}
```

**Success Response (200):**
```json
{
  "valid": true,
  "user": {
    "id": "string",
    "username": "string",
    "role": "admin"
  }
}
```

---

### Player Management

#### POST /api/register-player
Register a new player for the tournament.

**Rate Limit:** 3 requests per hour (per IP)

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "nationality": "CR | INTL",
  "league": "string",
  "emergency_contact_name": "string",
  "emergency_contact_phone": "string",
  "categories": {
    "handicap": boolean,
    "senior": boolean,
    "scratch": boolean,
    "reenganche": boolean,
    "marathon": boolean,
    "desperate": boolean
  },
  "package_size": 3 | 4 | 5 | 8,
  "payment_method": "string",
  "amount_paid": number,
  "currency": "CRC | USD"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "player": {
    "id": "uuid",
    "name": "string",
    "qr_code": "string"
  }
}
```

---

#### GET /api/players
Get all registered players (Admin only).

**Query Parameters:**
- `status` (optional): "verified" | "pending" | "all"

**Success Response (200):**
```json
{
  "players": [
    {
      "id": "uuid",
      "name": "string",
      "email": "string",
      "payment_status": "verified | pending | partial",
      "created_at": "ISO 8601"
    }
  ]
}
```

---

#### POST /api/update-payment
Update player payment status (Admin only).

**Request Body:**
```json
{
  "playerId": "uuid",
  "payment_status": "verified | pending | partial",
  "amount_paid": number,
  "currency": "CRC | USD"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Payment updated successfully"
}
```

---

### Tournament Brackets

#### GET /api/brackets
Get all tournament brackets.

**Success Response (200):**
```json
{
  "brackets": [
    {
      "id": "uuid",
      "name": "string",
      "status": "active | pending | completed",
      "players": []
    }
  ]
}
```

---

#### POST /api/brackets/create
Create a new tournament bracket (Admin only).

**Request Body:**
```json
{
  "name": "string",
  "category": "handicap | senior | scratch",
  "max_players": number
}
```

---

#### POST /api/brackets/add-player
Add player to bracket (Admin only).

**Request Body:**
```json
{
  "bracketId": "uuid",
  "playerId": "uuid",
  "position": number
}
```

---

### Results & Standings

#### POST /api/results/add-series
Add game series for a player (Admin only).

**Request Body:**
```json
{
  "playerId": "uuid",
  "roundNumber": number,
  "game1": number,
  "game2": number,
  "game3": number
}
```

**Success Response (200):**
```json
{
  "success": true,
  "totalScore": number
}
```

---

#### GET /api/results/standings
Get current tournament standings.

**Query Parameters:**
- `category` (optional): Filter by category

**Success Response (200):**
```json
{
  "standings": [
    {
      "position": number,
      "playerId": "uuid",
      "playerName": "string",
      "totalScore": number,
      "gamesPlayed": number,
      "average": number
    }
  ]
}
```

---

#### GET /api/results/player-profile/:id
Get individual player profile and stats.

**Success Response (200):**
```json
{
  "player": {
    "id": "uuid",
    "name": "string",
    "totalScore": number,
    "gamesPlayed": number,
    "average": number,
    "bestGame": number,
    "series": [
      {
        "round": number,
        "game1": number,
        "game2": number,
        "game3": number,
        "total": number
      }
    ]
  }
}
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "success": false,
  "error": "Error message"
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "error": "Unauthorized access"
}
```

### 429 Too Many Requests
```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "retryAfter": "ISO 8601 timestamp"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "error": "Internal server error"
}
```

---

## Rate Limiting

Different endpoints have different rate limits:

- **Authentication endpoints**: 5 requests per minute
- **Registration**: 3 requests per hour
- **Default API**: 60 requests per minute
- **Strict endpoints**: 10 requests per minute

Rate limit headers are included in responses:
- `X-RateLimit-Limit`: Maximum requests allowed
- `X-RateLimit-Remaining`: Remaining requests
- `X-RateLimit-Reset`: Timestamp when limit resets

---

## Webhooks (Future Implementation)

Planned webhook events:
- `player.registered` - When a new player registers
- `payment.verified` - When payment is verified
- `bracket.created` - When a new bracket is created
- `series.completed` - When a game series is completed

---

## SDKs & Examples

### JavaScript/TypeScript Example

```typescript
// Login
const loginResponse = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'admin',
    password: 'password'
  })
})

const { token } = await loginResponse.json()

// Get players with auth
const playersResponse = await fetch('/api/players', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})

const { players } = await playersResponse.json()
```

---

## Changelog

### Version 1.0.0 (2025-01-01)
- Initial API release
- Authentication endpoints
- Player registration
- Bracket management
- Results tracking

---

## Support

For API support, contact:
- Email: admin@lanegritacrcc.com
- Documentation: /docs
