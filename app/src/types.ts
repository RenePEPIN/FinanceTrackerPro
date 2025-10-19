export type Transaction = {
  date: string
  description: string
  amount: number
  currency?: string
  _raw?: Record<string, string>
}
export type ColumnMap = { date?: string; description?: string; amount?: string; currency?: string }
export type ImportMessage = {
  level: 'info' | 'warn' | 'error'
  code: string
  details: string
  hint?: string
}
