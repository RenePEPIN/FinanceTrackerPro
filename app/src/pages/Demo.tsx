import { useCallback, useMemo, useState } from 'react'
import ImportArea from '../components/ImportArea'
import PreviewTable from '../components/PreviewTable'
import ImportLog from '../components/ImportLog'
import type { Transaction, ColumnMap, ImportMessage } from '../types'
import { parseCsvText } from '../lib/parseCsv'

export default function Demo() {
  const [rows, setRows] = useState<Transaction[]>([])
  const [headers, setHeaders] = useState<string[]>([])
  const [map, setMap] = useState<ColumnMap>({})
  const [messages, setMessages] = useState<ImportMessage[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const resetAll = useCallback(() => {
    setRows([])
    setHeaders([])
    setMap({})
    setMessages([])
    setError(null)
  }, [])

  const onParsed = useCallback(
    (p: {
      rows: Transaction[]
      headers: string[]
      columnMap: ColumnMap
      messages: ImportMessage[]
    }) => {
      setRows(p.rows)
      setHeaders(p.headers)
      setMap(p.columnMap)
      setMessages(p.messages)
      setError(null)
    },
    [],
  )

  const loadSample = useCallback(async () => {
    try {
      setBusy(true)
      setError(null)
      const resp = await fetch('/sample_data/transactions_sample.csv')
      if (!resp.ok) throw new Error(`Statut HTTP ${resp.status}`)
      const text = await resp.text()
      const parsed = parseCsvText(text)
      onParsed(parsed)
    } catch (e: unknown) {
      setError('Impossible de charger le fichier d’exemple.')
    } finally {
      setBusy(false)
    }
  }, [onParsed])

  // Résumé : messages & somme des montants
  const { infoCount, warnCount, errorCount, amountSum } = useMemo(() => {
    const infoCount = messages.filter((m) => m.level === 'info').length
    const warnCount = messages.filter((m) => m.level === 'warn').length
    const errorCount = messages.filter((m) => m.level === 'error').length
    const amountSum = rows.reduce((acc, r) => acc + (Number.isFinite(r.amount) ? r.amount : 0), 0)
    return { infoCount, warnCount, errorCount, amountSum }
  }, [messages, rows])

  return (
    <main className="max-w-5xl mx-auto p-6 space-y-4">
      <header className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Démo — Import et aperçu</h1>
          <p className="text-gray-600">
            Chargez un exemple, collez ou déposez un fichier de valeurs séparées par des virgules.
            Tout se fait <strong>localement</strong> dans votre navigateur.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="btn disabled:opacity-50" onClick={loadSample} disabled={busy}>
            {busy ? 'Chargement…' : 'Charger l’exemple'}
          </button>
          <button className="btn" onClick={resetAll}>
            Réinitialiser
          </button>
        </div>
      </header>

      {/* Zone collage/dépôt */}
      <ImportArea onData={onParsed} />

      {/* Messages d’erreur haut niveau (ex: fetch) */}
      {error && <p className="text-red-700">{error}</p>}

      {/* Journal d'import (info/warn/error) */}
      <ImportLog messages={messages} />

      {/* Résumé (compteurs + somme) */}
      {(rows.length > 0 || messages.length > 0) && (
        <section className="card grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <h3 className="font-semibold mb-1">Aperçu</h3>
            <p className="text-sm text-gray-700">
              Lignes: <strong>{rows.length}</strong>
              {rows.length > 500 && <span> — affichage initial limité à 500 pour la fluidité</span>}
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Journal</h3>
            <p className="text-sm text-gray-700">
              Infos: <strong>{infoCount}</strong> • Avertissements: <strong>{warnCount}</strong> •
              Erreurs: <strong>{errorCount}</strong>
            </p>
          </div>
          <div className="sm:col-span-2">
            <h3 className="font-semibold mb-1">Somme des montants</h3>
            <p className="text-sm text-gray-700">
              Total (naïf): <strong>{amountSum.toFixed(2)}</strong>
              <span className="text-gray-500">
                {' '}
                — sera affiné lors de la normalisation (Sprint 2)
              </span>
            </p>
          </div>
        </section>
      )}

      {/* Tableau d’aperçu (500 premières) */}
      {rows.length > 0 && <PreviewTable rows={rows} />}

      {/* Mappage détecté */}
      {headers.length > 0 && (
        <section className="card">
          <h3 className="text-lg font-semibold mb-2">Mappage détecté</h3>
          <div className="grid gap-2 text-sm">
            <div>
              <span className="font-medium">Date :</span>{' '}
              {map.date ?? <em className="text-gray-500">non détecté</em>}
            </div>
            <div>
              <span className="font-medium">Description :</span>{' '}
              {map.description ?? <em className="text-gray-500">non détecté</em>}
            </div>
            <div>
              <span className="font-medium">Montant :</span>{' '}
              {map.amount ?? <em className="text-gray-500">non détecté</em>}
            </div>
            <div>
              <span className="font-medium">Devise :</span>{' '}
              {map.currency ?? <em className="text-gray-500">non détecté</em>}
            </div>
          </div>
          <details className="mt-3">
            <summary className="cursor-pointer underline">Voir le mappage brut</summary>
            <pre className="text-xs bg-gray-50 p-2 rounded-2xl overflow-auto mt-2">
              {JSON.stringify(map, null, 2)}
            </pre>
          </details>
          <p className="text-xs text-gray-500 mt-2">
            Le mappage deviendra <strong>éditable</strong> au Sprint 2.
          </p>
        </section>
      )}
    </main>
  )
}
