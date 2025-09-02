import { getBankById, getAccountTypeOptions, accountTypes } from '@/app/lib/accounts'

describe('Account helpers', () => {
  it('retrieves bank by id', () => {
    expect(getBankById('bpi')?.name).toBe('Bank of the Philippine Islands (BPI)')
    expect(getBankById('unknown')).toBeUndefined()
  })

  it('returns all account types when no bank specified', () => {
    expect(getAccountTypeOptions()).toHaveLength(accountTypes.length)
  })

  it('filters account types based on bank', () => {
    const types = getAccountTypeOptions('bpi')
    const typeIds = types.map(t => t.id)
    expect(typeIds).toContain('savings')
    expect(typeIds).toContain('checking')
    expect(typeIds).not.toContain('digital-wallet')
  })

  it('falls back to all account types for unknown bank', () => {
    expect(getAccountTypeOptions('unknown')).toHaveLength(accountTypes.length)
  })
})
