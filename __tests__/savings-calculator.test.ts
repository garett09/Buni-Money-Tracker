import { SavingsCalculator, DepositHistory, SavingsTimeline } from '@/app/lib/savingsCalculator'

describe('SavingsCalculator', () => {
  beforeAll(() => {
    jest.useFakeTimers()
    jest.setSystemTime(new Date('2023-01-10'))
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('calculateTimeline', () => {
    it('returns immediate success when goal already achieved', () => {
      const timeline = SavingsCalculator.calculateTimeline(1000, 1000, [], 'g1')
      expect(timeline.days).toBe(0)
      expect(timeline.isAchievable).toBe(true)
      expect(timeline.message).toMatch(/Goal already achieved/)
    })

    it('returns no timeline when there is no deposit history', () => {
      const timeline = SavingsCalculator.calculateTimeline(500, 100, [], 'g1')
      expect(timeline.days).toBe(Infinity)
      expect(timeline.isAchievable).toBe(false)
      expect(timeline.message).toMatch(/No deposit history yet/)
    })

    it('calculates remaining timeline based on deposits', () => {
      const deposits: DepositHistory[] = [
        { amount: 100, date: '2023-01-01T00:00:00.000Z', goalId: 'g1' },
        { amount: 100, date: '2023-01-05T00:00:00.000Z', goalId: 'g1' },
        { amount: 100, date: '2023-01-03T00:00:00.000Z', goalId: 'other' }
      ]

      const timeline = SavingsCalculator.calculateTimeline(500, 200, deposits, 'g1')

      expect(timeline.days).toBe(14)
      expect(timeline.weeks).toBe(2)
      expect(timeline.months).toBe(1)
      expect(timeline.isAchievable).toBe(true)
      expect(timeline.message).toMatch(/Almost there/)
    })
  })

  describe('deposit history helpers', () => {
    it('reads deposit history from localStorage', () => {
      const history: DepositHistory[] = [
        { amount: 50, date: '2023-01-01T00:00:00.000Z', goalId: 'g1' }
      ]
      ;(localStorage.getItem as jest.Mock).mockReturnValueOnce(JSON.stringify(history))
      expect(SavingsCalculator.getDepositHistory()).toEqual(history)
    })

    it('adds a deposit to history', () => {
      ;(localStorage.getItem as jest.Mock).mockReturnValueOnce('[]')
      SavingsCalculator.addDepositToHistory(25, 'g2')
      expect(localStorage.setItem).toHaveBeenCalledTimes(1)
      const [key, value] = (localStorage.setItem as jest.Mock).mock.calls[0]
      expect(key).toBe('depositHistory')
      const stored = JSON.parse(value)
      expect(stored).toHaveLength(1)
      expect(stored[0]).toMatchObject({ amount: 25, goalId: 'g2' })
    })
  })

  describe('formatTimeline', () => {
    const base: SavingsTimeline = {
      days: 0,
      weeks: 0,
      months: 0,
      averageDailyDeposit: 0,
      averageWeeklyDeposit: 0,
      averageMonthlyDeposit: 0,
      isAchievable: true,
      message: ''
    }

    it('formats special cases', () => {
      expect(SavingsCalculator.formatTimeline({ ...base, days: 0 })).toBe('Goal achieved! 🎉')
      expect(SavingsCalculator.formatTimeline({ ...base, days: Infinity })).toBe('No timeline available')
    })

    it('formats days, weeks, months and years appropriately', () => {
      expect(SavingsCalculator.formatTimeline({ ...base, days: 3 })).toBe('3 days')
      expect(SavingsCalculator.formatTimeline({ ...base, days: 14, weeks: 2 })).toBe('2 weeks')
      expect(SavingsCalculator.formatTimeline({ ...base, days: 60, months: 2 })).toBe('2 months')
      expect(SavingsCalculator.formatTimeline({ ...base, days: 730 })).toBe('2 years')
    })
  })
})
