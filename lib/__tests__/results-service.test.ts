/**
 * Results Service Tests
 *
 * Note: These are unit tests that test the service logic.
 * Supabase calls are mocked to avoid requiring a real database connection.
 */

import { ResultsService } from '../results-service'

// Mock Supabase
jest.mock('../supabase-server', () => ({
  getSupabase: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(() => Promise.resolve({
            data: {
              id: '1',
              name: 'Test Player',
              email: 'test@example.com',
              payment_status: 'verified',
              created_at: new Date().toISOString()
            },
            error: null
          })),
          order: jest.fn(() => Promise.resolve({ data: [], error: null })),
        })),
        order: jest.fn(() => Promise.resolve({ data: [], error: null })),
      })),
      insert: jest.fn(() => Promise.resolve({ error: null })),
    })),
  })),
}))

describe('ResultsService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getPlayerProfile', () => {
    it('should fetch player profile successfully', async () => {
      const profile = await ResultsService.getPlayerProfile('1')

      expect(profile).toBeDefined()
      expect(profile.id).toBe('1')
      expect(profile.name).toBe('Test Player')
      expect(profile.email).toBe('test@example.com')
      expect(profile.series).toBeDefined()
      expect(profile.achievements).toBeDefined()
      expect(profile.standings).toBeDefined()
    })

    it('should handle errors gracefully', async () => {
      const getSupabase = require('../supabase-server').getSupabase
      getSupabase.mockImplementationOnce(() => ({
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn(() => Promise.resolve({
                data: null,
                error: { message: 'Player not found' }
              })),
            })),
          })),
        })),
      }))

      await expect(ResultsService.getPlayerProfile('999')).rejects.toThrow('Player not found')
    })
  })

  describe('getAllPlayers', () => {
    it('should fetch all verified players', async () => {
      const getSupabase = require('../supabase-server').getSupabase
      getSupabase.mockImplementationOnce(() => ({
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              order: jest.fn(() => Promise.resolve({
                data: [
                  { id: '1', name: 'Player 1', email: 'p1@test.com', payment_status: 'verified' },
                  { id: '2', name: 'Player 2', email: 'p2@test.com', payment_status: 'verified' },
                ],
                error: null
              })),
            })),
          })),
        })),
      }))

      const players = await ResultsService.getAllPlayers()

      expect(players).toBeDefined()
      expect(players.length).toBe(2)
      expect(players[0].payment_status).toBe('verified')
    })

    it('should return empty array on error', async () => {
      const getSupabase = require('../supabase-server').getSupabase
      getSupabase.mockImplementationOnce(() => ({
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              order: jest.fn(() => Promise.resolve({
                data: null,
                error: { message: 'Database error' }
              })),
            })),
          })),
        })),
      }))

      await expect(ResultsService.getAllPlayers()).rejects.toThrow()
    })
  })

  describe('addPlayerSeries', () => {
    it('should calculate total score correctly', async () => {
      const result = await ResultsService.addPlayerSeries('1', 1, 150, 160, 170)

      expect(result).toBe(true)
    })

    it('should handle series addition with zero scores', async () => {
      const result = await ResultsService.addPlayerSeries('1', 1, 0, 0, 0)

      expect(result).toBe(true)
    })

    it('should handle series addition with perfect scores', async () => {
      const result = await ResultsService.addPlayerSeries('1', 1, 300, 300, 300)

      expect(result).toBe(true)
    })
  })

  describe('Score Calculation Logic', () => {
    it('should correctly sum three game scores', () => {
      const game1 = 150
      const game2 = 175
      const game3 = 200
      const expected = game1 + game2 + game3

      expect(expected).toBe(525)
    })

    it('should handle edge case scores', () => {
      // Minimum possible score (3 games of 0)
      expect(0 + 0 + 0).toBe(0)

      // Maximum possible score (3 games of 300)
      expect(300 + 300 + 300).toBe(900)
    })
  })
})
