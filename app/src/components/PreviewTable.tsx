import type { Transaction } from '../types'
export default function PreviewTable({ rows }: { rows: Transaction[] }) {
  const first = rows.slice(0, 500)
  return (
    <div className="card overflow-auto">
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
          {first.map((r, i) => (
            <tr key={i} className="border-b last:border-none">
              <td className="py-1">{r.date}</td>
              <td>{r.description}</td>
              <td className="text-right">
                {Number.isFinite(r.amount) ? r.amount.toFixed(2) : '—'}
              </td>
              <td>{r.currency ?? ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length > 500 && (
        <p className="mt-2 text-xs text-gray-500">Affichage partiel (500 / {rows.length}).</p>
      )}
    </div>
  )
}
