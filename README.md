
# 🦙 Llama Chat - Interface Web pour Ollama

Une interface de chat moderne et élégante pour interagir avec les modèles Llama via Ollama. Créez plusieurs conversations, gérez vos topics et profitez d'une expérience utilisateur fluide avec animations et notifications.

![Llama Chat Preview](https://img.shields.io/badge/Next.js-13+-black.svg)
![Ollama](https://img.shields.io/badge/Ollama-Compatible-green.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-blue.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg)
![Docker](https://img.shields.io/badge/Docker-Compose-blue.svg)

---

## 🚀 Démarrage rapide avec Docker

### 1. Cloner le dépôt

```bash
git clone <votre-repo>
cd chat-visualizer
```

### 2. Démarrer les services Docker

> 📦 **Prérequis** : Assurez-vous d'avoir Docker et Docker Compose installés sur votre machine

```bash
docker-compose up --build
```

Cela va construire et démarrer les deux conteneurs nécessaires :
- **Ollama** : Serveur local pour les modèles LLM (accessible sur [http://localhost:11434](http://localhost:11434))
- **PostgreSQL** : Base de données pour stocker les conversations et topics (accessible sur [http://localhost:5432](http://localhost:5432))

> 🔄 **Note importante** : Lors du premier démarrage, **le modèle `llama3` est téléchargé automatiquement** via `ollama pull llama3`.  
> Ce téléchargement peut prendre plusieurs minutes (~4 à 8 Go selon la version du modèle).  
>  
> 📺 Pour suivre l'avancée, ouvrez un autre terminal et utilisez la commande suivante :

```bash
docker-compose logs -f ollama
```

Cela vous montrera la progression du téléchargement ligne par ligne.

### 3. Lancer l'application Next.js

Dans un nouveau terminal :

```bash
cd webapp
npm install
npx prisma generate     # Génère les types Prisma
npx prisma db push      # Pousse le schéma à la base PostgreSQL
npm run dev             # Démarrage en mode développement
```

> 💡 L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

---

## 🛠️ Architecture du projet

```
chat-visualizer/
├── docker-compose.yml        # Configuration des conteneurs
├── README.md                 # Documentation principale
└── webapp/                   # Application Next.js
    ├── prisma/               # Schéma Prisma + client DB
    ├── public/               # Fichiers statiques
    ├── src/                  # Source de l'app Next.js
    ├── package.json
    ├── next.config.ts
    └── ...
```

---

## 🔧 Scripts disponibles (`webapp/package.json`)

```json
"scripts": {
  "dev": "next dev",                    // Démarrage en mode développement
  "build": "next build",                // Build pour la production
  "start": "next start",                // Démarrage en production
  "lint": "next lint",                  // Analyse de code
  "resetdb": "prisma migrate reset --force",    // Réinitialisation de la base (⚠ destructif)
  "updatedb": "npx prisma migrate dev --name",  // Générer une migration Prisma
  "showdb": "npx prisma studio"        // Ouvre Prisma Studio dans le navigateur
}
```

Les scripts sont à utiliser dans le répertoire `webapp` :

```bash
cd webapp
npm run dev          # Démarrer l'application
npm run build        # Construire pour la production
npm run start        # Démarrer en mode production
npm run lint         # Linter le code
npm run resetdb      # Réinitialiser la base de données (attention, cela supprime toutes les données !)
npm run updatedb     # Mettre à jour la base de données avec les dernières migrations
npm run showdb       # Ouvrir Prisma Studio pour visualiser la base de données
```

Le script 'updatedb' est à utiliser pour générer une migration après avoir modifié le schéma Prisma. Il prend un argument pour nommer la migration, par exemple :

```bash
npm run updatedb -- --name "ajout_colonne_exemple"
```

Le script 'resetdb' est destructif et supprime toutes les données de la base. Utilisez-le avec précaution, surtout en production.

Le script 'showdb' ouvre Prisma Studio, une interface graphique pour interagir avec la base de données. C'est très utile pour visualiser et modifier les données directement depuis le navigateur.

---

## 🧪 Technologies utilisées

- **Next.js 13+** – Framework fullstack React
- **React 18+**
- **Tailwind CSS** – Design responsive et moderne
- **Prisma ORM** – Mapping PostgreSQL
- **Ollama API** – Serveur local de LLMs
- **Docker Compose** – Orchestration locale des services

---

## 🐛 Dépannage

### 📦 Le modèle `llama3` n'est pas encore prêt ?

- Soyez patient lors du premier lancement.
- Suivez les logs de téléchargement via :

```bash
docker-compose logs -f ollama
```

- Le modèle sera prêt lorsque vous verrez quelque chose comme :

```
✓ llama3 pulled successfully
```

Si jamais le téléchargement échoue, essayez de relancer la commande :

```bash
docker-compose up --build
```

Ou bien essayez de télécharger manuellement le modèle avec :

```bash
docker exec -it ollama ollama pull llama3
```

---

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🔗 Liens utiles

- [Documentation Ollama](https://ollama.ai/docs)
- [Modèles Llama disponibles](https://ollama.ai/library)
- [API Ollama](https://github.com/ollama/ollama/blob/main/docs/api.md)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com)

---

**Développé avec ❤️ pour la communauté IA**