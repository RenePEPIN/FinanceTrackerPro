import { Link } from 'react-router-dom'

export default function App() {
  return (
    <main className="max-w-3xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">FinanceTracker Pro</h1>
        <nav className="space-x-4">
          <Link to="/" className="underline">Accueil</Link>
          <Link to="/demo" className="underline">Démo</Link>
          <Link to="/about" className="underline">À propos</Link>
        </nav>
      </header>

      <section className="card">
        <h2 className="text-xl font-semibold mb-2">Hors ligne par défaut</h2>
        <p>L’application fonctionne sans connexion : vos données restent sur votre appareil.</p>
      </section>

      <section className="card">
        <h2 className="text-xl font-semibold mb-2">Commencer</h2>
        <p>Allez sur l’onglet <strong>Démo</strong> pour charger un fichier d’exemple et vérifier l’aperçu.</p>
      </section>
    </main>
  )
}
