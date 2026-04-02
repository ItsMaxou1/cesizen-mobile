# CESIZen Mobile

Application mobile du projet CESIZen. Construite avec **React Native**, **Expo** et **TypeScript**.

## Prérequis

- [Node.js](https://nodejs.org/) v18+
- npm
- [Expo Go](https://expo.dev/go) installé sur ton téléphone (iOS ou Android)
- L'[API CESIZen](https://github.com/ItsMaxou1/cesizen-api) doit être lancée et accessible sur le réseau local

## Installation

```bash
# 1. Cloner le projet
git clone https://github.com/ItsMaxou1/cesizen-mobile.git
cd cesizen-mobile

# 2. Se mettre sur la branche develop
git checkout develop

# 3. Installer les dépendances
npm install
```

## Configuration

Modifier le fichier `src/config.js` avec l'adresse IP de ta machine où tourne l'API :

```js
export const API_URL = "http://TON_IP:3001";
```

> Utiliser l'IP locale de ta machine (ex: `192.168.1.X`), pas `localhost` (le téléphone ne peut pas y accéder).

Pour trouver ton IP :

- Windows : `ipconfig` dans le terminal → IPv4

## Lancer l'application

```bash
# Démarrer Expo
npm start
```

Puis scanner le QR code avec **Expo Go** sur ton téléphone.

```bash
# Lancer directement sur Android
npm run android

# Lancer directement sur iOS
npm run ios
```

## Structure du projet

```
app/
├── (tabs)/             # Navigation par onglets
│   ├── index.tsx       # Accueil — contenus informatifs
│   ├── exercices.tsx   # Liste des exercices
│   └── profil.tsx      # Profil utilisateur
├── contenu/[id].tsx    # Détail d'un contenu
├── exercice/[id].tsx   # Détail d'un exercice
├── exercice/lancer/[id].tsx  # Lancer un exercice (timer)
├── login.tsx           # Connexion
├── register.tsx        # Inscription
├── favoris.tsx         # Mes favoris
├── historique.tsx      # Mon historique
├── modifier-email.tsx
├── modifier-password.tsx
└── modifier-profil.tsx
src/
├── config.js           # URL de l'API
├── context/            # Contexte d'authentification
└── components/         # Composants réutilisables
```

## Fonctionnalités

- Inscription / Connexion
- Consulter les contenus informatifs
- Parcourir et lancer des exercices de respiration (timer guidé)
- Ajouter des exercices en favoris
- Historique des exercices réalisés
- Modifier son profil (email, mot de passe)
