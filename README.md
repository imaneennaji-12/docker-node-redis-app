 Je vois le problème ! L'ASCII art est mal rendu sur GitHub. Voici un **README corrigé** avec un schéma qui s'affiche correctement sous forme de **code block** et une **liste explicative** :

```markdown
# 🐳 Gestion des Employés — Docker + Node.js + Redis

Application web de gestion des employés avec compteur de visites, déployée via Docker.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────┐
│              VOTRE ORDINATEUR               │
│                                             │
│   Navigateur → http://localhost:8080        │
│                      │                      │
│                      ▼                      │
│   ┌─────────────────────────────────────┐   │
│   │         Docker Compose              │   │
│   │         (orchestration)             │   │
│   │                                     │   │
│   │   ┌──────────┐    ┌──────────┐     │   │
│   │   │  Redis   │◄───│ Node.js  │     │   │
│   │   │(données) │    │(Express) │     │   │
│   │   │  :6379   │    │  :3000   │     │   │
│   │   └──────────┘    └──────────┘     │   │
│   │                                     │   │
│   └─────────────────────────────────────┘   │
│                                             │
│   Volume: redis-data (persistance)          │
└─────────────────────────────────────────────┘
```

**Flux de données :**
1. Vous ouvrez `http://localhost:8080` dans votre navigateur
2. Le port `8080` de votre PC redirige vers le port `3000` du conteneur Node.js
3. Node.js affiche la page et demande à Redis d'incrémenter le compteur
4. Redis stocke le compteur dans son volume persistant

---

## 📁 Rôle des fichiers

| Fichier | Rôle |
|---------|------|
| `server.js` | Application Express : page HTML + API employés + compteur Redis |
| `package.json` | Dépendances : Express et client Redis |
| `Dockerfile` | Recette Docker : "prends Node.js, copie le code, installe, lance" |
| `docker-compose.yml` | Orchestration : lance Redis + Node.js, les connecte, mappe le port 8080 |
| `.gitignore` | Ignore `node_modules/` et les fichiers inutiles |

---

## 🚀 Lancer le projet

> **Prérequis :** [Docker](https://www.docker.com/get-started) installé.  
> **Pas besoin d'installer Node.js ou Redis !**

```bash
# 1. Cloner le repo
git clone https://github.com/VOTRE_USERNAME/docker-node-redis-app.git
cd docker-node-redis-app

# 2. Construire et lancer (UNE SEULE COMMANDE)
docker-compose up --build
```

Puis ouvrez : **http://localhost:8080**

---

## 🛑 Arrêter

```bash
# Arrêter les conteneurs (garde les données Redis)
docker-compose down

# Arrêter + supprimer les données Redis
docker-compose down -v
```

---

## 🐳 Commandes Docker utiles

| Commande | Action |
|----------|--------|
| `docker-compose up --build` | Construit et lance tout |
| `docker-compose up -d --build` | Lance en arrière-plan |
| `docker-compose down` | Arrête les conteneurs |
| `docker ps` | Voir les conteneurs actifs |
| `docker-compose logs` | Voir les logs |
| `docker exec -it redis-db redis-cli GET visits` | Voir le compteur Redis |

---

## 🎯 Fonctionnalités

- ✅ Visualiser la liste des employés
- ✅ Ajouter un employé
- ✅ Modifier un employé
- ✅ Supprimer un employé
- ✅ Compteur de visites persistant (Redis)

---

## ⚡ Comment Docker fonctionne ici

1. **`docker-compose up --build`** lit `docker-compose.yml`
2. Il télécharge `redis:7-alpine` et construit votre image Node.js via le `Dockerfile`
3. Il crée un **réseau privé** où `redis-server` et `web` peuvent se parler
4. Il lance **Redis** (données sauvegardées dans le volume `redis-data`)
5. Il lance **votre app Node.js** (port 3000 du conteneur mappé sur le port 8080 de votre PC)
6. Vous accédez à l'app via `http://localhost:8080`

> Le `Dockerfile` optimise le cache en copiant d'abord `package.json`, puis le reste du code.

---

## 👨‍💻 Auteur

Projet de conteneurisation — Docker, Node.js, Redis.
```

---

## 🔧 Ce qui a changé (pour corriger le bug)

| Avant (bug) | Après (corrigé) |
|-------------|-----------------|
| ASCII art sans balises code | ASCII art **entre triples backticks** ``` |
| Texte sur une ligne | Texte bien structuré en lignes |
| `|` interprété comme tableau Markdown | `|` protégé dans un bloc de code |

---

## ✅ Comment copier-coller correctement

1. **Créez un fichier** `README.md` dans votre dossier projet
2. **Copiez** tout le texte ci-dessus (depuis `# 🐳` jusqu'à la fin)
3. **Collez** dans le fichier
4. **Poussez sur GitHub** :

```bash
git add README.md
git commit -m "Correction README avec schéma propre"
git push origin main
```

---

## 🎨 Alternative : Utiliser un schéma en liste (sans ASCII)

Si vous préférez éviter l'ASCII art, voici une version **100% compatible** :

```markdown
## 🏗️ Architecture

**Composants :**
- 🖥️ **Votre PC** — Vous ouvrez `http://localhost:8080`
- 🐳 **Docker Compose** — Orchestre les 2 services
- 📦 **Conteneur Redis** (`redis-server`) — Stocke le compteur de visites (port 6379, interne)
- 📦 **Conteneur Node.js** (`web`) — Serveur web Express (port 3000, mappé sur 8080)
- 💾 **Volume `redis-data`** — Persistance des données Redis

**Flux :**
```
Navigateur → localhost:8080 → Docker Compose → Node.js:3000 → Redis:6379
                                                          ↓
                                                   Volume redis-data
```

**Communication interne :**
- Node.js parle à Redis via `redis://redis-server:6379` (réseau privé Docker)
- Redis n'est pas accessible depuis l'extérieur (sécurisé)
```

---

Quelle version préférez-vous ? Je peux aussi vous générer une **image PNG** du schéma si vous voulez l'insérer directement dans le README !
