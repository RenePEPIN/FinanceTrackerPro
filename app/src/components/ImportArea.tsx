import { useRef, useState } from 'react'
import { parseCsvText } from '../lib/parseCsv'
import type { ColumnMap, ImportMessage, Transaction } from '../types'

export default function ImportArea({
  onData,
}: {
  onData: (p: {
    rows: Transaction[]
    headers: string[]
    columnMap: ColumnMap
    messages: ImportMessage[]
  }) => void
}) {
  const [dragOver, setDragOver] = useState(false)
  const taRef = useRef<HTMLTextAreaElement>(null)
  const handleFiles = async (files: FileList | null) => {
    const f = files?.[0]
    if (!f) return
    onData(parseCsvText(await f.text()))
  }
  const handlePaste = () => {
    const text = taRef.current?.value ?? ''
    if (text.trim()) onData(parseCsvText(text))
  }
  return (
    <div
      className={`card ${dragOver ? 'ring-2 ring-blue-500' : ''}`}
      onDragOver={(e) => {
        e.preventDefault()
        setDragOver(true)
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault()
        setDragOver(false)
        handleFiles(e.dataTransfer.files)
      }}
    >
      <p className="mb-2">
        <strong>Coller</strong> du CSV ci-dessous ou <strong>déposer</strong> un fichier :
      </p>
      <div className="flex gap-2 items-start">
        <textarea
          ref={taRef}
          className="w-full h-32 border rounded-2xl p-2"
          placeholder="Collez votre CSV ici…"
        ></textarea>
        <div className="flex flex-col gap-2">
          <button className="btn" onClick={handlePaste}>
            Analyser
          </button>
          <label className="btn cursor-pointer">
            Importer un fichier
            <input
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </label>
        </div>
      </div>
    </div>
  )
}
