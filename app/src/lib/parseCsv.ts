import Papa from 'papaparse'
import { z } from 'zod'
import type { Transaction, ColumnMap, ImportMessage } from '../types'

const amountLike = (s: string) => /^-?\s*\d+([,\.]\d+)?\s*$/.test(s)
const dateLike = (s: string) => /^\d{4}-\d{2}-\d{2}$|^\d{2}[\/\-]\d{2}[\/\-]\d{4}$/.test(s)
const RowSchema = z.record(z.string(), z.string())

export function autoDetectColumns(headers: string[]): ColumnMap {
  const norm = (h: string) => h.trim().toLowerCase().replace(/\s+/g, '')
  const n = headers.map(norm)
  const find = (cands: string[]) => {
    for (const c of cands) {
      const i = n.indexOf(c)
      if (i >= 0) return headers[i]
    }
  }
  return {
    date: find(['date', 'transactiondate', 'datedeoperation']),
    description: find(['description', 'libelle', 'label', 'memo']),
    amount: find(['amount', 'montant', 'debit', 'credit', 'valeur']),
    currency: find(['currency', 'devise', 'curr']),
  }
}

export function parseCsvText(text: string) {
  const messages: ImportMessage[] = []
  const result = Papa.parse(text, { header: true, skipEmptyLines: true, dynamicTyping: false })
  if (result.errors?.length)
    messages.push({
      level: 'warn',
      code: 'CSV_PARSE_WARN',
      details: `${result.errors.length} avertissements lors du parsing`,
    })
  const headers = (result.meta?.fields ?? []) as string[]
  if (!headers.length)
    messages.push({ level: 'error', code: 'CSV_NO_HEADERS', details: 'Aucune en-tête détectée' })
  const map = autoDetectColumns(headers)

  const rows: Transaction[] = []
  for (const r of result.data as unknown[]) {
    const row = RowSchema.safeParse(r)
    if (!row.success) continue
    const rec = row.data
    const d = (map.date ? rec[map.date] : '')?.trim?.() ?? ''
    const desc = (map.description ? rec[map.description] : '')?.trim?.() ?? ''
    let amtStr = (map.amount ? rec[map.amount] : '0')?.toString?.() ?? '0'
    amtStr = amtStr.replace(/\s/g, '').replace(',', '.')
    const amt = amountLike(amtStr) ? Number(amtStr) : NaN
    const tx: Transaction = {
      date: d,
      description: desc,
      amount: isNaN(amt) ? 0 : amt,
      currency: map.currency ? rec[map.currency] : undefined,
      _raw: rec,
    }
    if (!dateLike(d))
      messages.push({
        level: 'warn',
        code: 'DATE_FORMAT',
        details: `Date suspecte: "${d}"`,
        hint: 'AAAA-MM-JJ ou JJ/MM/AAAA',
      })
    if (isNaN(amt))
      messages.push({
        level: 'warn',
        code: 'AMOUNT_FORMAT',
        details: `Montant invalide: "${amtStr}"`,
        hint: 'Utiliser . ou , comme séparateur décimal',
      })
    rows.push(tx)
  }

  messages.unshift({ level: 'info', code: 'CSV_SUMMARY', details: `Lignes lues: ${rows.length}` })
  return { rows, headers, columnMap: map, messages }
}
