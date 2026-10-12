# THÉO.exe — portfolio terminal

Portfolio de **Théo Nussbaum** (IT Systems & Operations · étudiant ES en informatique, systèmes et exploitation).
Le site entier est **une fenêtre de terminal** : le visiteur tape des commandes (ou clique dessus) et le contenu
s'affiche directement dans le terminal.

Stack : Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind CSS 4 · Lucide.
Aucun service externe requis (les polices sont auto-hébergées au build par `next/font`).

---

## Lancer le projet

Prérequis : Node.js ≥ 20.9.

```bash
npm install
```

```bash
npm run dev
```

Puis ouvrir http://localhost:3000.

| Script              | Rôle                                  |
| ------------------- | ------------------------------------- |
| `npm run dev`       | serveur de développement              |
| `npm run build`     | build de production (page statique)   |
| `npm run start`     | sert le build de production           |
| `npm run lint`      | ESLint                                |
| `npm run typecheck` | vérification TypeScript               |

---

## Commandes

| Commande | Effet |
| --- | --- |
| `help` | liste des commandes (cliquables) |
| `whoami` | présentation |
| `about` | parcours, approche, centres d'intérêt |
| `projects [mot-clé]` | liste des projets, ou recherche (nom, techno, compétence) |
| `project <nom>` | fiche complète d'un projet |
| `skills` | compétences par domaine |
| `homelab` (`lab`) | hyperviseur, plan d'adressage, machines, environnements, expériences |
| `experience` (`xp`) | chronologie formation / expériences |
| `certifications` (`certs`) | certifications et formations |
| `contact` | e-mail (avec copie), LinkedIn, GitHub |
| `cv` | téléchargement du CV (si publié) |
| `status` | tableau de bord synthétique |
| `neofetch` | profil façon neofetch (aucune donnée matérielle réelle) |
| `date` | date et heure locales |
| `ls` / `cat <fichier>` | fichiers du portfolio (`cat about`, `cat projects/`…) |
| `history` / `clear` | historique / effacer |

Raccourcis : **Entrée** exécuter · **↑/↓** historique · **Tab** complétion · **→** accepter la suggestion grisée
(façon fish shell) · **Ctrl+L** effacer · **Ctrl+C** annuler la saisie · **Ctrl+K** ou **/** revenir à la saisie.
Une barre de commandes cliquables en bas de la fenêtre permet de naviguer sans rien taper.

**Sécurité** : rien n'est exécuté dans un shell. La saisie est découpée en mots et comparée au registre
`lib/commands.tsx` ; seule une commande déclarée produit une sortie. Tout le rendu passe par React (texte échappé,
aucun `dangerouslySetInnerHTML`). Saisie limitée à 200 caractères.

Au chargement : `Initializing portfolio...` → `System ready.` → `whoami` → `help` (~1,5 s, interrompu dès la première
saisie, instantané si `prefers-reduced-motion` est activé).

Pour ajouter une commande : ajouter une entrée dans le tableau `commands` de `lib/commands.tsx` et, si besoin, un
composant de sortie dans `components/terminal/outputs.tsx`.

---

## Personnalisation

Toutes les données sont dans `data/` :

| Fichier | Contenu |
| --- | --- |
| `data/profile.ts` | nom, rôle, accroche, présentation, textes *about*, disponibilité, centres d'intérêt, date de mise à jour, URL du site |
| `data/contact.ts` | e-mail, LinkedIn, GitHub, chemin du CV |
| `data/projects.ts` | projets (problématique, objectifs, architecture, étapes, sécurité, résultat, captures, difficultés, compétences) |
| `data/skills.ts` | compétences par catégorie, niveau optionnel, lien vers un projet |
| `data/homelab.ts` | hyperviseur, segments réseau, machines, environnements, expériences, captures, documentation |
| `data/experience.ts` | chronologie |
| `data/certifications.ts` | certifications et formations complémentaires |

Conventions :

- `example: true` → étiquette **EXEMPLE** ; `placeholder: true` → **À COMPLÉTER**. Passer à `false` une fois le contenu réel.
- Une certification n'est affichée comme obtenue que si `status: "obtenue"` **et** `verified: true`.
- `level` des compétences n'est affiché que s'il est renseigné.
- Coordonnées vides → « non configuré », jamais de lien cassé.
- `skillsNeedReview` et `about.draft` affichent une note tant que les textes ne sont pas validés.

**CV** : déposer le PDF dans `public/cv/theo-nussbaum-cv.pdf` (ou modifier `cvPath`). Sa présence est détectée au
build et la commande `cv` propose alors le téléchargement.

**Images** : les placer dans `public/projects/<slug>/` et les référencer dans `media` ; elles apparaissent comme
liens `[img]` dans la fiche du projet.

**Couleurs** : jetons dans `app/globals.css` (`@theme`). Polices dans `app/layout.tsx`.

---

## Déploiement

Le site est statique.

**Vercel** : importer le dépôt ; définir `NEXT_PUBLIC_SITE_URL` (ex. `https://theo-nussbaum.ch`) pour les URL
Open Graph et le sitemap.

**Serveur Node** : `npm ci`, `npm run build`, `npm run start` (port 3000, derrière un reverse proxy HTTPS).

---

## Structure

```
app/                  page unique (terminal), layout, 404, OG image, favicon, sitemap, robots, manifest
components/terminal/  état (historique, boot, raccourcis), fenêtre, sorties des commandes
components/shell/     barre de fenêtre et horloge
components/dashboard/ tableau de bord de `status`
lib/                  registre des commandes, statistiques, utilitaires, types
data/                 contenu personnalisable
```

---

## Informations restant à compléter

- [ ] `data/contact.ts` : adresse e-mail, URL LinkedIn (et GitHub si souhaité).
- [ ] `public/cv/theo-nussbaum-cv.pdf` : CV.
- [ ] `data/profile.ts` : relire les textes *about* (3ᵉ paragraphe à écrire), disponibilité, `siteUrl` ; puis `about.draft: false`.
- [ ] `data/experience.ts` : école, année de début, expériences, formation précédente.
- [ ] `data/projects.ts` : compléter *Windows 11 Hardening* puis `example: false` ; ajouter d'autres projets.
- [ ] `data/skills.ts` : valider la liste, ajouter des exemples (`evidence`) ; puis `skillsNeedReview = false`.
- [ ] `data/homelab.ts` : remplacer les données fictives (sans IP privées ni noms internes) ; `example: false`.
- [ ] `data/certifications.ts` : remplacer ou supprimer les entrées d'exemple.
