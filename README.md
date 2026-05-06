# 🐳 Gestion des Employés — Docker + Node.js + Redis

Application web de gestion des employés avec compteur de visites, déployée via Docker.

---

## 🏗️ Architecture
┌─────────────────────────────────────────┐
│         VOTRE ORDINATEUR                │
│                                         │
│  Navigateur → http://localhost:8080     │
│                    ↓                    │
│  ┌─────────────────────────────────┐    │
│  │  Docker Compose (orchestration) │    │
│  │                                 │    │
│  │  ┌──────────┐   ┌──────────┐   │    │
│  │  │  Redis   │   │ Node.js  │   │    │
│  │  │(données) │◄──│(Express) │   │    │
│  │  │  :6379   │   │  :3000   │   │    │
│  │  └──────────┘   └──────────┘   │    │
│  └─────────────────────────────────┘    │
│                                         │
│  Volume : redis-data (persistance)      │
└─────────────────────────────────────────┘

- **Redis** stocke le compteur de visites (persistant même après redémarrage).
- **Node.js + Express** sert la page web et gère les employés (CRUD).
- **Docker Compose** lance les deux services ensemble sur un réseau privé.

---

## 📁 Rôle des fichiers

| Fichier | Rôle |
|---------|------|
| `server.js` | Application Express : page HTML + API employés + compteur Redis |
| `package.json` | Dépendances : Express et client Redis |
| `Dockerfile` | Recette Docker : "prends Node.js, copie le code, installe, lance" |
| `docker-compose.yml` | Orchestration : lance Redis + Node.js, les connecte, mappe le port 8080 |

---

## 🚀 Lancer le projet

> **Prérequis :** [Docker](https://www.docker.com/get-started) installé.  
> **Pas besoin d'installer Node.js ou Redis !**
# 1. Cloner le repo
git clone https://github.com/VOTRE_USERNAME/docker-node-redis-app.git
cd docker-node-redis-app

# 2. Construire et lancer (UNE SEULE COMMANDE)
docker-compose up --build
Puis ouvrez : http://localhost:8080
🛑 Arrêter
# Arrêter les conteneurs (garde les données Redis)
docker-compose down

# Arrêter + supprimer les données Redis
docker-compose down -v
🐳 Commandes Docker utiles
Table
Commande	Action
docker-compose up --build	Construit et lance tout
docker-compose up -d --build	Lance en arrière-plan
docker-compose down	Arrête les conteneurs
docker ps	Voir les conteneurs actifs
docker-compose logs	Voir les logs
docker exec -it redis-db redis-cli GET visits	Voir le compteur Redis
🎯 Fonctionnalités
✅ Visualiser la liste des employés
✅ Ajouter un employé
✅ Modifier un employé
✅ Supprimer un employé
✅ Compteur de visites persistant (Redis)
⚡ Comment Docker fonctionne ici
docker-compose up --build lit docker-compose.yml
Il télécharge redis:7-alpine et construit votre image Node.js via le Dockerfile
Il crée un réseau privé où redis-server et web peuvent se parler
Il lance Redis (données sauvegardées dans le volume redis-data)
Il lance votre app Node.js (port 3000 du conteneur mappé sur le port 8080 de votre PC)
Vous accédez à l'app via http://localhost:8080
Le Dockerfile optimise le cache en copiant d'abord package.json, puis le reste du code.
👨‍💻 Auteur
Projet de conteneurisation — Docker, Node.js, Redis.

---
