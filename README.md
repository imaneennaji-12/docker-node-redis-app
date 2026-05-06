# 🐳 Gestion des Employés — Docker + Node.js + Redis

Application web de gestion des employés avec compteur de visites, déployée via Docker.

---

## 🏗️ Architecture

**3 composants principaux :**

| Composant | Technologie | Rôle | Port |
|-----------|-------------|------|------|
| 🖥️ **Navigateur** | — | Vous consultez l'application | `localhost:8080` |
| 📦 **Conteneur Web** | Node.js + Express | Serveur web + API employés + compteur | `3000` (interne) |
| 📦 **Conteneur DB** | Redis | Stocke le compteur de visites (persistant) | `6379` (interne) |

**Comment ça communique :**

1. Vous ouvrez **http://localhost:8080** dans votre navigateur
2. Le port `8080` de votre PC redirige vers le port `3000` du conteneur Node.js
3. Node.js affiche la page et demande à Redis d'incrémenter le compteur
4. Redis stocke le compteur dans un volume persistant (surv aux redémarrages)

**Réseau interne Docker :**
- Node.js parle à Redis via l'URL `redis://redis-server:6379`
- Redis n'est pas accessible depuis l'extérieur (sécurisé)
- Docker Compose crée automatiquement ce réseau privé

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

&gt; **Prérequis :** [Docker](https://www.docker.com/get-started) installé.  
&gt; **Pas besoin d'installer Node.js ou Redis !**

```bash
# 1. Cloner le repo
git clone https://github.com/VOTRE_USERNAME/docker-node-redis-app.git
cd docker-node-redis-app

# 2. Construire et lancer (UNE SEULE COMMANDE)
docker-compose up --build
