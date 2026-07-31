# KAMI-EXTENSION - Déploiement sur Vercel avec MongoDB

## Guide de Déploiement

### Prérequis

1. **Compte Vercel** - https://vercel.com (gratuit)
2. **Compte MongoDB Atlas** - https://www.mongodb.com/cloud/atlas (gratuit)
3. **Compte GitHub** (optionnel, pour intégration Git)

---

## Étape 1: Configuration MongoDB

Voir `MONGODB_SETUP.md` pour les instructions détaillées.

### Résumé rapide:

1. Créer un compte MongoDB Atlas
2. Créer un cluster (M0 gratuit)
3. Créer un utilisateur de base de données
4. Configurer l'accès réseau (0.0.0.0/0)
5. Copier la chaîne de connexion

Format de la chaîne de connexion:
```
mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
```

---

## Étape 2: Préparation du Code

### 1. Variables d'environnement locales

Créez un fichier `.env.local` à la racine du projet:

```bash
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority

# Environment
NODE_ENV=development
```

⚠️ **IMPORTANT**: Ne commitez JAMAIS le fichier `.env.local` dans Git!

### 2. Test local

```bash
# Installer les dépendances
bun install

# Lancer le serveur de développement
bun run dev
```

Vérifiez que tout fonctionne correctement en local.

---

## Étape 3: Déploiement sur Vercel

### Option A: Via GitHub (Recommandé)

1. **Pousser le code sur GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/VOTRE_USERNAME/kami-extension.git
git push -u origin main
```

2. **Connecter Vercel à GitHub**
   - Allez sur https://vercel.com/new
   - Connectez votre compte GitHub
   - Sélectionnez le dépôt `kami-extension`
   - Cliquez sur "Import"

3. **Configuration du projet**
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (laissez vide)
   - **Build Command**: `bun run build` (détection automatique)
   - **Output Directory**: `.next` (détection automatique)

4. **Variables d'environnement**
   - Dans la section "Environment Variables"
   - Ajoutez:
     - Name: `MONGODB_URI`
     - Value: Votre chaîne de connexion MongoDB
     - Environments: ✅ Production, ✅ Preview, ✅ Development

5. **Déployer**
   - Cliquez sur "Deploy"
   - Attendez le déploiement (~2-3 minutes)

### Option B: Via Vercel CLI

1. **Installer Vercel CLI**
```bash
bun add -g vercel
```

2. **Connecter à Vercel**
```bash
vercel login
```

3. **Déployer**
```bash
vercel
# Suivez les instructions:
# - Set up and deploy: Yes
# - Link to existing project: No
# - Project name: kami-extension
# - Link to different account: No
# - Override settings: No
```

4. **Ajouter les variables d'environnement**
```bash
vercel env add MONGODB_URI production
# Collez votre chaîne de connexion MongoDB
```

---

## Étape 4: Vérification du déploiement

1. **Accéder à votre application**
   - Vercel vous fournira une URL: `https://kami-extension-xxx.vercel.app`

2. **Tester toutes les fonctionnalités**
   - Inscription d'un utilisateur
   - Connexion
   - Visualisation des lots
   - Réservation d'un lot
   - Paiement
   - Chat avec l'admin
   - Mode sombre/clair

3. **Vérifier les logs**
   - Allez sur le tableau de bord Vercel
   - Onglet "Logs"
   - Vérifiez qu'il n'y a pas d'erreurs

---

## Étape 5: Domaine Personnalisé (Optionnel)

### 1. Dans Vercel:
1. Allez à Settings → Domains
2. Ajoutez votre domaine (ex: `kami-extension.com`)
3. Cliquez sur "Add"

### 2. Configurer DNS:

Vercel vous donnera 2 options:

**Option A: CNAME (Recommandée)**
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
```

**Option B: A Record**
```
Type: A
Name: @
Value: 76.76.21.21
```

### 3. Activer HTTPS
- Vercel activera automatiquement un certificat SSL gratuit

---

## Mise à jour de l'Application

### Via GitHub (Automatique)

1. Modifiez le code localement
2. Committez et poussez sur GitHub
3. Vercel déploiera automatiquement la nouvelle version

### Via Vercel CLI
```bash
vercel --prod
```

---

## Surveillance et Maintenance

### Vercel Dashboard

- **Analytics**: Visites, pages vues, temps de chargement
- **Logs**: Erreurs, requêtes API
- **Deployments**: Historique des déploiements
- **Environment Variables**: Gestion des variables d'environnement

### MongoDB Atlas Dashboard

- **Metrics**: Connexions, opérations, stockage
- **Slow Queries**: Requêtes lentes
- **Backups**: Sauvegardes (payant)
- **Cluster Status**: État du cluster

### Performance Monitoring

1. **Vercel Speed Insights**
   - Analyse Core Web Vitals
   - Optimisation des performances
   - A/B testing

2. **MongoDB Performance Advisor**
   - Recommandations d'index
   - Optimisation des requêtes
   - Alertes de performance

---

## Sécurité

### Vercel

- HTTPS automatique
- Protection DDoS
- WAF (Web Application Firewall)

### MongoDB Atlas

- Authentification requise
- TLS/SSL encryption
- Contrôle d'accès IP
- Auditing (payant)

### Bonnes pratiques

1. **Variables d'environnement**
   - Ne jamais commiter les secrets
   - Utiliser des noms de variables standard
   - Faire des rotations régulières

2. **Mots de passe**
   - Utiliser des mots de passe forts
   - Mots de passe différents par environnement
   - Rotation régulière

3. **Code**
   - Valider toutes les entrées utilisateur
   - Sanitiser les données
   - Gérer les erreurs correctement

---

## Dépannage

### Erreur: "Cannot connect to MongoDB"

**Solutions**:
1. Vérifiez que `MONGODB_URI` est correct
2. Vérifiez l'accès réseau MongoDB (IP whitelist)
3. Vérifiez les credentials de l'utilisateur
4. Vérifiez que le cluster est en ligne

### Erreur: "Build failed"

**Solutions**:
1. Vérifiez que toutes les dépendances sont installées
2. Vérifiez que le build command est correct: `bun run build`
3. Regardez les logs de build dans Vercel
4. Testez le build localement: `bun run build`

### Erreur: "Application not found"

**Solutions**:
1. Vérifiez que le déploiement est réussi
2. Vérifiez que le nom de domaine est correct
3. Regardez les logs dans Vercel
4. Essayez avec l'URL par défaut de Vercel

### Performance lente

**Solutions**:
1. Optimisez les requêtes MongoDB
2. Ajoutez des indexes aux champs fréquemment interrogés
3. Utilisez Vercel Edge Functions pour les endpoints critiques
4. Mettez en cache les données statiques

---

## URLs Importantes

- **Application**: Votre URL Vercel (ex: https://kami-extension.vercel.app)
- **Vercel Dashboard**: https://vercel.com/dashboard
- **MongoDB Atlas**: https://cloud.mongodb.com
- **GitHub**: https://github.com/VOTRE_USERNAME/kami-extension

---

## Support

- **Vercel Documentation**: https://vercel.com/docs
- **MongoDB Documentation**: https://docs.mongodb.com
- **Next.js Documentation**: https://nextjs.org/docs

---

## Coûts

### Vercel (Hobby Plan - Gratuit)
- 100 GB Bandwidth par mois
- Infinite builds
- Edge Functions
- Deployments automatiques

### MongoDB Atlas (M0 - Gratuit)
- 512 MB de stockage
- RAM partagé
- 1 cluster

### Total: 0 FCFA / mois

Pour une application en production avec plus d'utilisateurs, envisagez les plans payants:
- **Vercel Pro**: $20/mois
- **MongoDB Atlas M10**: $9/mois

---

## Check-list de Déploiement

- [ ] MongoDB Atlas configuré
- [ ] Utilisateur de base de données créé
- [ ] Accès réseau configuré
- [ ] Connection string obtenue
- [ ] .env.local configuré localement
- [ ] Application testée localement
- [ ] Code poussé sur GitHub
- [ ] Projet Vercel créé
- [ ] Variables d'environnement configurées
- [ ] Déploiement réussi
- [ ] Application testée en production
- [ ] Domaine personnalisé configuré (optionnel)
- [ ] HTTPS activé
- [ ] Surveillance configurée

---

🚀 Bon déploiement!