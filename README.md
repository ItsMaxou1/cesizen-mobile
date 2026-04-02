# CESIZen Mobile

Application mobile du projet **CESIZen**, une application de gestion du stress et du bien-être mental destinée aux étudiants CESI.

Construite avec **React Native**, **Expo** et **TypeScript**.

---

## Présentation du projet

CESIZen est composé de 3 projets :

| Projet | Description | Lien |
|--------|-------------|------|
| **cesizen-api** | Backend REST | [Repo](https://github.com/ItsMaxou1/cesizen-api) |
| **cesizen-web** | Interface admin (React) | [Repo](https://github.com/ItsMaxou1/cesizen-web) |
| **cesizen-mobile** (ce repo) | Application mobile (Expo) | - |

> L'API doit être lancée avant de démarrer l'application mobile.

---

## Prérequis

- [Node.js](https://nodejs.org/) v18+
- npm
- [Expo Go](https://expo.dev/go) installé sur ton téléphone (iOS ou Android)
- L'[API CESIZen](https://github.com/ItsMaxou1/cesizen-api) lancée et accessible sur le réseau local

## Installation

```bash
git clone https://github.com/ItsMaxou1/cesizen-mobile.git
cd cesizen-mobile
git checkout develop
npm install
```

## Configuration

Modifier le fichier `src/config.js` avec l'adresse IP de ta machine :

```js
export const API_URL = "http://TON_IP:3001";
```

> Ne pas utiliser `localhost` — le téléphone ne peut pas l'atteindre.  
> Utiliser l'IP locale de ta machine sur le réseau (ex: `192.168.1.42`).

Pour trouver ton IP locale :
- Windows : taper `ipconfig` dans le terminal → chercher **Adresse IPv4**
- Mac/Linux : taper `ifconfig` → chercher `inet`

Le téléphone et l'ordinateur doivent être sur le **même réseau Wi-Fi**.

## Lancer l'application

```bash
# Démarrer Expo (affiche un QR code)
npm start
```

Scanner le QR code avec **Expo Go** sur ton téléphone.

```bash
# Lancer sur émulateur Android
npm run android

# Lancer sur émulateur iOS (Mac uniquement)
npm run ios
```

## Structure du projet

```
cesizen-mobile/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx         # Accueil — contenus informatifs
│   │   ├── exercices.tsx     # Liste des exercices de respiration
│   │   ├── profil.tsx        # Profil utilisateur
│   │   └── _layout.tsx       # Configuration de la barre de navigation
│   ├── contenu/[id].tsx      # Détail d'un contenu informatif
│   ├── exercice/[id].tsx     # Détail d'un exercice
│   ├── exercice/lancer/[id].tsx  # Timer guidé pour réaliser un exercice
│   ├── login.tsx             # Connexion
│   ├── register.tsx          # Inscription
│   ├── favoris.tsx           # Liste de mes favoris
│   ├── historique.tsx        # Historique des exercices réalisés
│   ├── modifier-email.tsx
│   ├── modifier-password.tsx
│   └── modifier-profil.tsx
├── src/
│   ├── config.js             # URL de l'API (à configurer)
│   ├── context/              # Contexte d'authentification (AuthContext)
│   └── components/           # Composants réutilisables
└── app.json                  # Configuration Expo
```

## Fonctionnalités

- Inscription et connexion (authentification JWT)
- Accueil avec les contenus informatifs sur la gestion du stress
- Parcourir les exercices de respiration par catégorie
- Lancer un exercice avec un timer guidé (inspiration, apnée, expiration)
- Ajouter / retirer des exercices en favoris
- Historique des exercices réalisés
- Modifier son profil (email, mot de passe)

## Dépannage

**Impossible de se connecter à l'API :** vérifier l'IP dans `src/config.js` et que le téléphone est sur le même Wi-Fi  
**QR code non détecté :** utiliser le mode `Tunnel` (`npm start` → appuyer sur `t`)  
**Expo Go plante au démarrage :** lancer `npm start -- --clear` pour vider le cache