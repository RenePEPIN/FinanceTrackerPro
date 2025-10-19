import type { ImportMessage } from '../types'
const colors = { info: 'text-blue-700', warn: 'text-amber-700', error: 'text-red-700' }
export default function ImportLog({ messages }: { messages: ImportMessage[] }) {
  if (!messages.length) return null
  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-2">Journal d’import</h3>
      <ul className="space-y-1">
        {messages.map((m, i) => (
          <li key={i} className={colors[m.level]}>
            <strong>{m.level.toUpperCase()}</strong> [{m.code}] — {m.details}
            {m.hint ? ` (Astuce: ${m.hint})` : ''}
          </li>
        ))}
      </ul>
    </div>
  )
}
