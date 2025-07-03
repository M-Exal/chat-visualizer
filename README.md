# 🦙 Llama Chat - Interface Web pour Ollama

Une interface de chat moderne et élégante pour interagir avec les modèles Llama via Ollama. Créez plusieurs conversations, gérez vos topics et profitez d'une expérience utilisateur fluide avec animations et notifications.

![Llama Chat Preview](https://img.shields.io/badge/React-18+-blue.svg)
![Ollama](https://img.shields.io/badge/Ollama-Compatible-green.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-blue.svg)

## ✨ Fonctionnalités

- 💬 **Chat en temps réel** avec streaming des réponses
- 📂 **Gestion de topics** multiples (créer, renommer, supprimer)
- 🎨 **Interface moderne** avec animations fluides
- 🔔 **Système de notifications** interactif
- 💾 **Sauvegarde automatique** dans le localStorage
- 📱 **Responsive design** pour mobile et desktop
- ⚡ **Performance optimisée** avec limitation de l'historique
- 🎯 **Support Markdown** pour le formatage des réponses

## 🚀 Installation

### Prérequis

- **Node.js** (version 18 ou supérieure)
- **npm** ou **yarn**
- **Ollama** installé et configuré

### 1. Installation d'Ollama

#### Sur macOS

```bash
# Télécharger et installer Ollama
curl -fsSL https://ollama.ai/install.sh | sh

# Ou via Homebrew
brew install ollama
```

#### Sur Linux

```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

#### Sur Windows

Téléchargez l'installateur depuis [ollama.ai](https://ollama.ai/download)

### 2. Installation du modèle Llama

```bash
# Télécharger et installer Llama 3.2 (recommandé)
ollama pull llama3.2

# Alternatives disponibles :
# ollama pull llama3.1
# ollama pull llama3.2:1b    # Version plus légère
# ollama pull llama3.2:3b    # Version intermédiaire
```

### 3. Démarrage d'Ollama

```bash
# Démarrer le serveur Ollama
ollama serve

# Le serveur sera disponible sur http://localhost:11434
```

### 4. Installation de l'application

```bash
# Cloner le projet
git clone <votre-repo>
cd llama3-chat

# Installer les dépendances
npm install

# Démarrer l'application en mode développement
npm run dev

# L'application sera disponible sur http://localhost:5173
```

## 🎯 Utilisation

### Interface principale

L'application est composée de deux parties principales :

1. **Sidebar gauche** : Gestion des topics de conversation
2. **Zone de chat** : Affichage des messages et zone de saisie

### Gestion des topics

- **➕ Créer un topic** : Cliquez sur "Nouveau topic" dans la sidebar
- **✏️ Renommer un topic** : Survolez un topic et cliquez sur l'icône crayon
- **🗑️ Supprimer un topic** : Survolez un topic et cliquez sur l'icône poubelle
- **🔄 Changer de topic** : Cliquez sur le nom d'un topic pour l'activer

### Envoi de messages

- **Saisie simple** : Tapez votre message et appuyez sur `Entrée`
- **Saisie multiligne** : Utilisez `Shift + Entrée` pour une nouvelle ligne
- **Envoi** : Cliquez sur le bouton "Envoyer 🚀" ou utilisez `Entrée`

### Raccourcis clavier

- `Entrée` : Envoyer le message
- `Shift + Entrée` : Nouvelle ligne dans le message
- `Échap` : Annuler l'édition d'un topic

## 🔧 Configuration

### Modèles supportés

L'application est configurée pour utiliser `llama3.2` par défaut. Pour changer de modèle, modifiez la ligne dans `src/App.jsx` :

```javascript
model: "llama3.2", // Changez ici le nom du modèle
```

Modèles disponibles :

- `llama3.2` (recommandé)
- `llama3.1`
- `llama3.2:1b` (version légère)
- `llama3.2:3b` (version intermédiaire)

### Paramètres de l'API

L'application communique avec Ollama via l'API REST sur `http://localhost:11434`. Si votre instance Ollama est sur un autre port ou serveur, modifiez l'URL dans `src/App.jsx` :

```javascript
const res = await fetch("http://localhost:11434/api/generate", {
  // Configuration...
});
```

### Limitation de l'historique

Par défaut, l'application limite l'historique à 10 messages par conversation pour optimiser les performances. Vous pouvez ajuster cette valeur dans `src/App.jsx` :

```javascript
// Limiter l'historique à 9 messages + le nouveau (donc max 10)
const limitedMessages =
  oldMessages.length >= 9 // Changez cette valeur
    ? oldMessages.slice(oldMessages.length - 9)
    : oldMessages;
```

## 🛠️ Développement

### Structure du projet

```
src/
├── components/
│   ├── ChatWindow.jsx          # Zone d'affichage des messages
│   ├── MessageInput.jsx        # Zone de saisie des messages
│   ├── NotificationSystem.jsx  # Système de notifications
│   ├── Sidebar.jsx            # Barre latérale des topics
│   └── TopicItem.jsx          # Élément individuel de topic
├── hooks/
│   └── useNotifications.js    # Hook pour les notifications
├── App.jsx                    # Composant principal
├── index.css                 # Styles globaux et animations
└── main.jsx                  # Point d'entrée React
```

### Scripts disponibles

```bash
# Développement
npm run dev

# Build de production
npm run build

# Prévisualisation du build
npm run preview

# Linting
npm run lint
```

### Technologies utilisées

- **React 19** - Framework frontend
- **Vite** - Build tool et serveur de développement
- **Tailwind CSS** - Framework CSS utilitaire
- **React Markdown** - Rendu du contenu Markdown
- **UUID** - Génération d'identifiants uniques

## 🐛 Dépannage

### Problèmes courants

#### Ollama n'est pas accessible

```bash
# Vérifiez que Ollama est démarré
ollama serve

# Vérifiez que le modèle est installé
ollama list

# Testez l'API directement
curl http://localhost:11434/api/tags
```

#### Le modèle n'est pas trouvé

```bash
# Vérifiez les modèles disponibles
ollama list

# Installez le modèle si nécessaire
ollama pull llama3.2
```

#### Erreur CORS

Si vous rencontrez des erreurs CORS, assurez-vous qu'Ollama autorise les requêtes depuis votre domaine. Ollama autorise généralement localhost par défaut.

#### Performance lente

- Utilisez un modèle plus léger (`llama3.2:1b`)
- Augmentez la RAM allouée à Ollama
- Réduisez la limite d'historique des messages

## 📝 Fonctionnalités à venir

- [ ] Mode sombre/clair
- [ ] Export des conversations
- [ ] Recherche dans l'historique
- [ ] Support de fichiers joints
- [ ] Paramètres configurables de l'IA
- [ ] Thèmes personnalisables

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
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)

---

**Développé avec ❤️ pour la communauté IA**
