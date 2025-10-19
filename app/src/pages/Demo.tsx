import { useState } from 'react'

type Row = { date: string; description: string; amount: number; currency?: string }

export default function Demo() {
  const [rows, setRows] = useState<Row[]>([])
  const [error, setError] = useState<string | null>(null)

  const loadSample = async () => {
    try {
      const resp = await fetch('/sample_data/transactions_sample.csv')
      const text = await resp.text()
      const parsed = parseCsv(text)
      setRows(parsed)
      setError(null)
    } catch (e) {
      setError('Impossible de charger le fichier d’exemple.')
    }
  }

  const onFile = async (file: File) => {
    const text = await file.text()
    setRows(parseCsv(text))
  }

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Démo — Aperçu des opérations</h1>
      <div className="card space-y-3">
        <div className="flex gap-3">
          <button className="btn" onClick={loadSample}>Charger l’exemple</button>
          <label className="btn cursor-pointer">
            Importer un fichier CSV
            <input type="file" accept=".csv,text/csv" className="hidden" onChange={e => {
              const f = e.target.files?.[0]; if (f) onFile(f)
            }}/>
          </label>
        </div>
        {error && <p className="text-red-600">{error}</p>}
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Date</th>
              <th>Description</th>
              <th className="text-right">Montant</th>
              <th>Devise</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i} className="border-b last:border-none">
                <td className="py-1">{r.date}</td>
                <td>{r.description}</td>
                <td className="text-right">{r.amount.toFixed(2)}</td>
                <td>{r.currency ?? ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}

function parseCsv(text: string): Row[] {
  const lines = text.split(/\r?\n/).filter(Boolean)
  if (lines.length <= 1) return []
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
  const idx = {
    date: headers.indexOf('date'),
    description: headers.indexOf('description'),
    amount: headers.indexOf('amount'),
    currency: headers.indexOf('currency'),
  }
  return lines.slice(1).map(l => {
    const c = l.split(',')
    return {
      date: c[idx.date] ?? '',
      description: c[idx.description] ?? '',
      amount: Number((c[idx.amount] ?? '0').replace(',', '.')) || 0,
      currency: c[idx.currency] ?? undefined
    }
  })
}
