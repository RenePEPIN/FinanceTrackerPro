# FinanceTracker Pro — Sprint 0 (Préparation)

Objectif : disposer d’un dépôt prêt à l’emploi, d’un build reproductible, d’un service hors ligne (PWA), de politiques de sécurité appliquées et d’une démo embarquée.

## Pile technique
- **Frontend** : React + TypeScript + Vite + Tailwind + vite-plugin-pwa + vite-plugin-sri
- **Backend (placeholder)** : FastAPI (optionnel pour la suite)
- **Outillage** : Docker, docker-compose, Make, pre-commit, Ruff/Black, ESLint/Prettier
- **Cible** : WSL 2 (Ubuntu) ou Linux/macOS natif

## Démarrage rapide (WSL recommandé)
1. Activez WSL2 et installez Ubuntu depuis le Microsoft Store.
2. Dans Ubuntu : installez Node 20 et Python 3.11+.
3. Installez Docker Desktop (Windows) et activez l’intégration WSL.
4. Clonez ce dépôt puis exécutez :
   ```bash
   make setup       # installe les dépendances
   make dev         # lance le frontend (Vite) et l’API (FastAPI) en dev
   ```
5. Ouvrez http://localhost:5173

## Scripts Make utiles
- `make setup` : installation des dépendances Node et Python
- `make dev` : lancement en développement
- `make lint` : lint (Python + TypeScript)
- `make test` : exécution des tests
- `make build` : build production (frontend) et image Nginx avec en-têtes de sécurité
- `make up` / `make down` : lancer/arrêter l’environnement Docker
- `make clean` : nettoyage

## Démo embarquée
- Une page **Demo** permet de charger un fichier d’exemple CSV inclus (`sample_data/transactions_sample.csv`) pour vérifier l’aperçu et le hors‑ligne.

## Sécurité
- **CSP** stricte via Nginx (production).
- **SRI** activé sur les ressources bundlées.
- Pas de scripts inline, pas de ressources tierces par défaut.
