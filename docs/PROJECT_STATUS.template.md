# PROJECT_STATUS.template.md — FinanceTracker Pro

> **Ce fichier est un _modèle versionné_**. Ne le remplissez pas directement.
>
> - **Copiez-le** en `docs/PROJECT_STATUS.md` (ce fichier est **ignoré** par Git) puis complétez-le.
> - Mettez à jour ce **template** seulement pour faire évoluer la structure/canevas.

---

## Métadonnées

```yaml
title: Project Status — FinanceTracker Pro
cycle: <Sprint/Release> # ex: Sprint 2 (S2)
status: <alpha|beta|rc|stable> # ex: alpha
last_update: <YYYY-MM-DD> # ex: 2025-10-19
owner: <Nom @handle> # ex: @RenePEPIN
reviewers: [<handle1>, <handle2>] # ex: [@reviewer1]
repo: https://github.com/RenePEPIN/FinanceTrackerPro
ci: <URL GitHub Actions> # ex: https://github.com/.../actions
board: <URL board/kanban> # optionnel
env:
  node: ">=20"
  python: ">=3.11"
  docker: ">=27"
  os: "WSL2 Ubuntu 24.04 (recommandé)"
```

---

## 1) Résumé exécutif — état actuel

- **Statut global** : <ex: Préversion (alpha)>.
- **Objectif du cycle** : <en 1–2 phrases>.
- **Portée livrée** : <modules/fonctions majeures>.
- **Contraintes/risques notables** : <top 3>.
- **Prochain jalon** : <nom + date cible>.

---

## 2) Portée du cycle (Sprint/Release)

- **User stories incluses** :
  - [ ] <US-ID> — <intitulé> — <critères d’acceptation clés>
- **Hors portée** (explicitement non traité) :
  - <élément 1>, <élément 2>…
- **Hypothèses** :
  - <hypothèse 1>, <hypothèse 2>…

---

## 3) Architecture & piles techniques (snapshot)

- **Front-end** : React, TypeScript, Vite, TailwindCSS, PWA.
- **Back-end** : FastAPI (placeholder / endpoints : /health).
- **Infra / outillage** : Makefile, Docker (Nginx prod), WSL2 (Windows).
- **Sécurité** : CSP stricte en prod, pas de SRI en dev, SRI _post-build_ en prod (plan).

**Évolutions depuis le dernier statut :**

- <ex: Suppression plugin SRI instable en dev ; ajout PWA ; lockfile npm ajouté>.

---

## 4) Démarrage rapide

### Dev (local)

```bash
make setup
make dev
# UI:   http://localhost:5173
# API:  http://127.0.0.1:8000/health
```

- **Démo** : `/demo` → Charger l’exemple ou Coller/Déposer un CSV.

### Prod (conteneur)

```bash
make build
docker run --rm -p 8080:80 financetrackerpro:web
# UI: http://localhost:8080
# Vérif sécurité : curl -I http://localhost:8080 | grep -E "Content-Security-Policy|X-Frame-Options|X-Content-Type-Options|Permissions-Policy"
```

> **Note WSL** : cloner et travailler dans `/home/<user>` (fs Linux) pour de meilleures perfs.

---

## 5) Structure du dépôt (résumé)

```
financetrackerpro/
├─ app/                 # React + TS + Vite + Tailwind
│  ├─ src/components/   # ImportArea, PreviewTable, ImportLog, MapEditor
│  ├─ src/lib/          # parseCsv.ts, normalize.ts
│  ├─ src/pages/        # App.tsx, About.tsx, Demo.tsx
│  └─ public/           # sample_data/..., PWA assets
├─ api/                 # FastAPI (health)
├─ nginx/               # nginx.conf (CSP & headers)
├─ Dockerfile.web
├─ Makefile
└─ README.md
```

> Mettre à jour ce plan si l’arbo change.

---

## 6) Réalisations (depuis le dernier statut)

> **Inclure tous les correctifs, sans exception** (tableau recommandé).

| Type        | Élément / Module             | Description courte                                | PR/Commit |
| ----------- | ---------------------------- | ------------------------------------------------- | --------- |
| feat        | Import CSV (coller/déposer)  | Détection en-têtes + aperçu 500 lignes            | <lien>    |
| feat        | Mappage (auto + éditable)    | Override par sélecteurs, re-parse `forcedMap`     | <lien>    |
| feat        | Normalisation dates/montants | ISO `YYYY-MM-DD`, parenthèses=neg, virgule/points | <lien>    |
| fix         | Ports occupés (dev)          | Procédure `fuser -k`/`pkill` documentée           | <lien>    |
| chore/build | Lockfile npm                 | Reproductibilité CI                               | <lien>    |
| docs        | README / Project Status      | Mise à jour doc                                   | <lien>    |

**Détails complémentaires :**

- **Journal d’import** : messages `info` (`CSV_SUMMARY`, `NORM_STATS`, `MAP_OVERRIDE`), `warn` (`CSV_PARSE_WARN`, `DATE_FORMAT`, `AMOUNT_FORMAT`), `error` (`CSV_NO_HEADERS`).
- **PWA** : SW, offline-ready, fallback navigation.
- **Sécurité prod** : CSP stricte via Nginx.

---

## 7) Tâches restantes & risques

### À faire (prochaines étapes)

- [ ] <tâche 1> — <résultat attendu> — <priorité / blocage ?>
- [ ] <tâche 2> — …

### Risques / blocages

- <risque 1> — **Impact**: <…> — **Mitigation**: <…>
- <risque 2> — **Impact**: <…> — **Mitigation**: <…>

---

## 8) Qualité, sécurité & conformité

- **Qualité code** : ESLint/Prettier (front), Ruff/Black (API).
- **CI/CD** : <CI front/api en place ? CodeQL ? Dependabot ?>
- **Tests** : unitaires <nb> / E2E <nb> / couverture <x %> / perf <x s @10k lignes>.
- **Sécurité** : vulnérabilités connues (npm/pip) : <x> — plan d’upgrade : <…>.
- **Conformité** : données traitées **localement**, pas d’upload serveur.

---

## 9) Tests & résultats

- **Unitaires** :
  - Parser CSV : <résumé, cas nominal/erreurs>.
  - Normalisation : <cas dates/montants>.
- **E2E (si existants)** : <scénarios & statut>.
- **Perf** : Aperçu 10k lignes < <seuil> s ; 50k lignes (pré-étude) : <…>.

---

## 10) Observabilité / Prod readiness

- **Endpoints santé** : `/health` (API), `/` (UI).
- **Sécurité HTTP** (prod) : CSP, XFO, XCTO, Permissions-Policy, COOP/COEP.
- **SRI** : <script post-build en place ? statut ?>.
- **Procédure QA manuelle** : <checklist courte>.

---

## 11) Décisions (ADR-lite)

| Date         | Décision                        | Contexte / Alternatives                           |
| ------------ | ------------------------------- | ------------------------------------------------- |
| <YYYY-MM-DD> | Parsing côté client (PapaParse) | Simplicité, perf, privacy — évite backend inutile |
| <YYYY-MM-DD> | SRI prod post-build, pas en dev | Stabilité dev + intégrité prod                    |
| <YYYY-MM-DD> | Aperçu limité 500 lignes        | UX fluide sur gros fichiers                       |

---

## 12) Changelog court (depuis version précédente)

- <YYYY-MM-DD> — <version/tag> — <3–5 bullet points marquants>.

---

## 13) Annexes

### A. Onboarding (développeur·se)

- [ ] WSL2 + Docker Desktop (WSL integration)
- [ ] `make setup` OK ; `make dev` OK
- [ ] UI `/demo` → **Charger l’exemple** → aperçu + journal
- [ ] Règles de branche/PR + CI lues

### B. Fin de sprint (Definition of Done)

- [ ] Stories et critères d’acceptation validés
- [ ] Tests verts (unitaires + éventuels E2E)
- [ ] README & Project Status **à jour**
- [ ] Changelog mis à jour

---

**Dernière mise à jour** : <YYYY-MM-DD>  
**Contact technique** : <@handle> — Ouvrir une Issue GitHub si besoin.
