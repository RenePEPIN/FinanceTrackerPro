import { describe, it, expect } from 'vitest'
import { parseCsvText } from './parseCsv'
describe('parseCsvText', () => {
  it('parse un csv simple et détecte les colonnes', () => {
    const txt = 'date,description,amount,currency\n2025-01-03,Café,-2.80,EUR\n'
    const r = parseCsvText(txt)
    expect(r.rows.length).toBe(1)
    expect(r.columnMap.date).toBe('date')
    expect(r.rows[0].amount).toBeCloseTo(-2.8)
  })
})
