# 📋 Guide de restauration - KAMI-EXTENSION

## 🚀 Démarrage du serveur de développement

```bash
cd /home/z/my-project
bun run dev
```

Le serveur sera accessible via le **Preview Panel** à droite.

---

## 🎯 Comment accéder aux Paramètres

### ✅ Méthode correcte (Navigation par état)
1. Ouvrez l'application dans le Preview Panel
2. Cliquez sur le bouton **Menu** (icône hamburger ☰)
3. Cliquez sur **Paramètres**
4. Vous verrez la page de paramètres avec :
   - 🎨 **Apparence** : Mode sombre/clair
   - ℹ️ **Barre Flash Info** : Gestion des messages défilants
   - ⚡ **Performance** : Paramètres de performance
   - 🛡️ **Sécurité** : Paramètres de sécurité

### ❌ Ce qu'il ne faut PAS faire
- **N'essayez pas d'accéder à** `http://localhost:3000/settings` directement dans l'URL
- L'application utilise une navigation par **état client-side**, pas par routes URL
- Si vous tapez `/settings` dans l'URL, vous aurez une erreur **404 - This page could not be found.**

---

## 🔧 En cas d'erreur 404

Si vous voyez l'erreur "404 This page could not be found." :

1. **Allez sur la page d'accueil** :
   - Dans le menu, cliquez sur **Accueil** ou
   - Rafraîchissez la page (F5)

2. **Utilisez le menu** pour naviguer :
   - Cliquez sur Menu
   - Sélectionnez Paramètres

3. **Le bouton Paramètres fonctionne** via l'état `currentScreen` dans React, pas via l'URL.

---

## 📦 Sauvegardes disponibles

Les fichiers sont sauvegardés automatiquement dans `/home/z/my-project/backups/` :

- `flash-info-band.tsx.backup-YYYYMMDD-HHMMSS`
- `ModernSideMenu.tsx.backup-YYYYMMDD-HHMMSS`
- `page.tsx.backup-YYYYMMDD-HHMMSS`

### Restaurer un fichier

```bash
# Exemple : restaurer flash-info-band
cp /home/z/my-project/backups/flash-info-band.tsx.backup-YYYYMMDD-HHMMSS /home/z/my-project/src/components/flash-info-band.tsx

# Exemple : restaurer ModernSideMenu
cp /home/z/my-project/backups/ModernSideMenu.tsx.backup-YYYYMMDD-HHMMSS /home/z/my-project/src/components/kami/ModernSideMenu.tsx

# Exemple : restaurer page.tsx
cp /home/z/my-project/backups/page.tsx.backup-YYYYMMDD-HHMMSS /home/z/my-project/src/app/page.tsx
```

---

## 📂 Structure de l'application

### Routes disponibles
- `/` (page principale avec navigation par état)

### États de navigation disponibles (`currentScreen`)
- `home` - Page d'accueil
- `map` - Plan des lots
- `dashboard` - Mes réservations
- `profile` - Mon profil
- `rules` - Règlement intérieur
- `login-screen` - Connexion
- `register` - Inscription
- `auth-choice` - Choix d'authentification
- `admin` - Administration
- `admin-flash-infos` - Administration Flash Info
- **`settings`** - Paramètres globaux ← C'est ici que le bouton navigue !

### APIs disponibles
- `/api/flash-info` - Gestion des flash infos
- `/api/flash-info/settings` - Paramètres globaux de la barre
- `/api/flash-info-presets` - Préréglages de configuration
- `/api/color-favorites` - Couleurs favorites
- `/api/lots` - Liste des lots
- `/api/reservations` - Réservations
- `/api/auth/login` - Authentification
- `/api/admin/stats` - Statistiques admin
- `/api/admin/users` - Gestion utilisateurs admin
- `/api/admin/payments` - Gestion paiements admin
- `/api/admin-files` - Fichiers admin
- `/api/logo` - Logo admin

---

## 🎨 Fonctionnalités Flash Info Admin

Le composant `FlashInfoAdmin` (accessible via Paramètres > Barre Flash Info) permet :

1. **✨ Ajouter des flash infos**
   - Texte du message
   - Icône (9 icônes disponibles)
   - Couleur du texte avec presets
   - Couleur de fond
   - Marquer comme urgent

2. **🔄 Déplacer par priorité**
   - Boutons monter/descendre
   - Réorganiser l'ordre d'affichage

3. **🎨 Gérer les couleurs**
   - Sélecteur de couleur intégré
   - Presets de couleurs
   - **Favoris de couleurs** : Sauvegarder et réutiliser vos couleurs préférées

4. **😀 Ajouter des émoticônes**
   - Bibliothèque d'emojis rapides (15 emojis)
   - Ajouter des emojis personnalisés

5. **⚙️ Paramètres globaux de la barre**
   - Vitesse de défilement
   - Couleur de fond
   - Couleur de texte par défaut
   - Aperçu en temps réel

6. **💾 Préréglages**
   - Sauvegarder des configurations complètes
   - Appliquer rapidement un préréglage
   - Gérer les préréglages (créer/supprimer)

---

## 🔍 Dépannage

### Le bouton Paramètres ne fonctionne pas

Vérifiez que :
1. Le serveur de développement tourne : `bun run dev`
2. Vous cliquez sur le bouton dans le menu, pas sur une URL
3. Le composant `SettingsPage` est bien importé dans `page.tsx`

### Erreur 404 sur `/settings`

C'est normal ! L'application n'a PAS de route `/settings`. Utilisez le menu pour naviguer.

### Le serveur ne démarre pas

```bash
# Vérifier si le port 3000 est occupé
lsof -i:3000

# Tuer le processus occupant le port
kill -9 <PID>

# Redémarrer
bun run dev
```

---

## 📝 Résumé rapide

- ✅ Bouton **Paramètres** dans le menu → Ouvre la page de paramètres
- ✅ Page de paramètres → Contient Apparence, Flash Info, Performance, Sécurité
- ✅ Flash Info → Ouvre l'admin des flash infos avec toutes les fonctionnalités
- ❌ **N'allez PAS sur l'URL `/settings`** → Cela provoque un 404
- ✅ Naviguez toujours via le menu, pas via l'URL

---

## 💾 Last update
- 31/05/2025 - Création du guide de restauration
- Bug 404 : Explication sur la navigation par état vs navigation par URL