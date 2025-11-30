import {
  calculateDue,
  isEarly,
  determinePackageFromAmount,
  getExpectedPackageCost,
  formatCurrency,
  PlayerInfo,
  EARLY_DEADLINE,
  CRC_SCRATCH_FEE,
  USD_SCRATCH_FEE,
} from '../payment-utils'

describe('Payment Utils', () => {
  describe('isEarly', () => {
    it('should return true for dates before deadline', () => {
      const earlyDate = new Date('2025-07-20').toISOString()
      expect(isEarly(earlyDate)).toBe(true)
    })

    it('should return false for dates after deadline', () => {
      const lateDate = new Date('2025-07-25').toISOString()
      expect(isEarly(lateDate)).toBe(false)
    })

    it('should return true for date exactly at deadline', () => {
      const exactDate = EARLY_DEADLINE.toISOString()
      expect(isEarly(exactDate)).toBe(true)
    })
  })

  describe('calculateDue', () => {
    describe('Costa Rica (CR) players', () => {
      it('should calculate early bird price for 3-game package without scratch', () => {
        const player: PlayerInfo = {
          id: '1',
          full_name: 'Test Player',
          nationality: 'CR',
          package_size: 3,
          scratch: false,
          created_at: new Date('2025-07-20').toISOString(),
        }

        const result = calculateDue(player)

        expect(result.currency).toBe('CRC')
        expect(result.total).toBe(65000)
      })

      it('should calculate early bird price for 3-game package with scratch', () => {
        const player: PlayerInfo = {
          id: '1',
          full_name: 'Test Player',
          nationality: 'CR',
          package_size: 3,
          scratch: true,
          created_at: new Date('2025-07-20').toISOString(),
        }

        const result = calculateDue(player)

        expect(result.currency).toBe('CRC')
        expect(result.total).toBe(65000 + CRC_SCRATCH_FEE)
      })

      it('should calculate late price for 4-game package without scratch', () => {
        const player: PlayerInfo = {
          id: '1',
          full_name: 'Test Player',
          nationality: 'CR',
          package_size: 4,
          scratch: false,
          created_at: new Date('2025-07-25').toISOString(),
        }

        const result = calculateDue(player)

        expect(result.currency).toBe('CRC')
        expect(result.total).toBe(78000)
      })

      it('should calculate late price for 4-game package with scratch', () => {
        const player: PlayerInfo = {
          id: '1',
          full_name: 'Test Player',
          nationality: 'CR',
          package_size: 4,
          scratch: true,
          created_at: new Date('2025-07-25').toISOString(),
        }

        const result = calculateDue(player)

        expect(result.currency).toBe('CRC')
        expect(result.total).toBe(78000 + CRC_SCRATCH_FEE)
      })
    })

    describe('International (INTL) players', () => {
      it('should calculate early bird price for 3-game package in USD', () => {
        const player: PlayerInfo = {
          id: '1',
          full_name: 'Test Player',
          nationality: 'INTL',
          package_size: 3,
          scratch: false,
          created_at: new Date('2025-07-20').toISOString(),
        }

        const result = calculateDue(player)

        expect(result.currency).toBe('USD')
        expect(result.total).toBe(122)
      })

      it('should calculate early bird price for 5-game package with scratch', () => {
        const player: PlayerInfo = {
          id: '1',
          full_name: 'Test Player',
          nationality: 'INTL',
          package_size: 5,
          scratch: true,
          created_at: new Date('2025-07-20').toISOString(),
        }

        const result = calculateDue(player)

        expect(result.currency).toBe('USD')
        expect(result.total).toBe(153 + USD_SCRATCH_FEE)
      })

      it('should calculate late price for 8-game package', () => {
        const player: PlayerInfo = {
          id: '1',
          full_name: 'Test Player',
          nationality: 'INTL',
          package_size: 8,
          scratch: false,
          created_at: new Date('2025-07-25').toISOString(),
        }

        const result = calculateDue(player)

        expect(result.currency).toBe('USD')
        expect(result.total).toBe(210)
      })
    })
  })

  describe('determinePackageFromAmount', () => {
    it('should return "Sin Pago" for zero amount', () => {
      const result = determinePackageFromAmount(0, 'USD', true, new Date().toISOString())

      expect(result.type).toBe('none')
      expect(result.name).toBe('Sin Pago')
    })

    it('should identify package 3 for national player with correct amount', () => {
      const result = determinePackageFromAmount(125, 'USD', true, new Date('2025-07-20').toISOString())

      expect(result.type).toBe('package3')
      expect(result.scratch).toBe(false)
    })

    it('should identify package 3 + scratch for national player', () => {
      const result = determinePackageFromAmount(135, 'USD', true, new Date('2025-07-20').toISOString())

      expect(result.type).toBe('package3')
      expect(result.scratch).toBe(true)
    })

    it('should identify package 8 for international player', () => {
      const result = determinePackageFromAmount(205, 'USD', false, new Date('2025-07-20').toISOString())

      expect(result.type).toBe('package8')
      expect(result.scratch).toBe(false)
    })

    it('should return custom package for non-standard amounts', () => {
      const result = determinePackageFromAmount(50, 'USD', true, new Date().toISOString())

      expect(result.type).toBe('custom')
      expect(result.name).toContain('50')
    })
  })

  describe('getExpectedPackageCost', () => {
    it('should return correct cost for national package3 early bird without scratch', () => {
      const cost = getExpectedPackageCost('package3', true, false, true)
      expect(cost).toBe(125)
    })

    it('should return correct cost for national package3 early bird with scratch', () => {
      const cost = getExpectedPackageCost('package3', true, true, true)
      expect(cost).toBe(125 + 22)
    })

    it('should return correct cost for international package8 late without scratch', () => {
      const cost = getExpectedPackageCost('package8', false, false, false)
      expect(cost).toBe(210)
    })

    it('should return correct cost for international package5 early with scratch', () => {
      const cost = getExpectedPackageCost('package5', false, true, true)
      expect(cost).toBe(153 + 22)
    })
  })

  describe('formatCurrency', () => {
    it('should format currency with dollar sign and 2 decimals', () => {
      const formatted = formatCurrency(125.5)
      expect(formatted).toBe('$125.50')
    })

    it('should format zero correctly', () => {
      const formatted = formatCurrency(0)
      expect(formatted).toBe('$0.00')
    })

    it('should format large amounts with commas', () => {
      const formatted = formatCurrency(1234.56)
      expect(formatted).toBe('$1,234.56')
    })

    it('should round to 2 decimal places', () => {
      const formatted = formatCurrency(125.999)
      expect(formatted).toBe('$126.00')
    })
  })
})
