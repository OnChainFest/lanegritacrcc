import { AuthService, AuthUser } from '../auth'

describe('AuthService', () => {
  describe('login', () => {
    it('should successfully login with correct credentials', async () => {
      const result = await AuthService.login('admin', 'TorneoLaNegrita2025!')

      expect(result.success).toBe(true)
      expect(result.user).toBeDefined()
      expect(result.user?.username).toBe('admin')
      expect(result.user?.role).toBe('admin')
      expect(result.error).toBeUndefined()
    })

    it('should fail login with incorrect username', async () => {
      const result = await AuthService.login('wronguser', 'TorneoLaNegrita2025!')

      expect(result.success).toBe(false)
      expect(result.user).toBeUndefined()
      expect(result.error).toBe('Credenciales inválidas')
    })

    it('should fail login with incorrect password', async () => {
      const result = await AuthService.login('admin', 'wrongpassword')

      expect(result.success).toBe(false)
      expect(result.user).toBeUndefined()
      expect(result.error).toBe('Credenciales inválidas')
    })

    it('should fail login with empty credentials', async () => {
      const result = await AuthService.login('', '')

      expect(result.success).toBe(false)
      expect(result.error).toBe('Credenciales inválidas')
    })
  })

  describe('createToken', () => {
    it('should create a valid token from user', () => {
      const user: AuthUser = {
        username: 'admin',
        role: 'admin',
        loginTime: new Date().toISOString(),
      }

      const token = AuthService.createToken(user)

      expect(token).toBeDefined()
      expect(typeof token).toBe('string')
      expect(token.length).toBeGreaterThan(0)
    })

    it('should create different tokens for different login times', () => {
      const user1: AuthUser = {
        username: 'admin',
        role: 'admin',
        loginTime: new Date('2025-01-01').toISOString(),
      }

      const user2: AuthUser = {
        username: 'admin',
        role: 'admin',
        loginTime: new Date('2025-01-02').toISOString(),
      }

      const token1 = AuthService.createToken(user1)
      const token2 = AuthService.createToken(user2)

      expect(token1).not.toBe(token2)
    })
  })

  describe('verifySession', () => {
    it('should verify a valid recent token', async () => {
      const user: AuthUser = {
        username: 'admin',
        role: 'admin',
        loginTime: new Date().toISOString(),
      }

      const token = AuthService.createToken(user)
      const result = await AuthService.verifySession(token)

      expect(result.valid).toBe(true)
      expect(result.user).toBeDefined()
      expect(result.user?.username).toBe('admin')
    })

    it('should reject an expired token (>24 hours)', async () => {
      const oldDate = new Date()
      oldDate.setHours(oldDate.getHours() - 25) // 25 hours ago

      const user: AuthUser = {
        username: 'admin',
        role: 'admin',
        loginTime: oldDate.toISOString(),
      }

      const token = AuthService.createToken(user)
      const result = await AuthService.verifySession(token)

      expect(result.valid).toBe(false)
      expect(result.user).toBeUndefined()
    })

    it('should reject an invalid token', async () => {
      const result = await AuthService.verifySession('invalid-token-format')

      expect(result.valid).toBe(false)
      expect(result.user).toBeUndefined()
    })

    it('should reject an empty token', async () => {
      const result = await AuthService.verifySession('')

      expect(result.valid).toBe(false)
      expect(result.user).toBeUndefined()
    })

    it('should accept a token that is exactly 24 hours old', async () => {
      const exactDate = new Date()
      exactDate.setHours(exactDate.getHours() - 24)

      const user: AuthUser = {
        username: 'admin',
        role: 'admin',
        loginTime: exactDate.toISOString(),
      }

      const token = AuthService.createToken(user)
      const result = await AuthService.verifySession(token)

      expect(result.valid).toBe(true)
    })
  })
})
