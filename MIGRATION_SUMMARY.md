# Migration MongoDB & Configuration Vercel - KAMI-EXTENSION

## Résumé de la Migration

### ✅ Tâches Complétées

1. **Migration de la base de données**
   - ✅ Suppression de Prisma/SQLite
   - ✅ Installation de MongoDB/Mongoose
   - ✅ Création des modèles Mongoose
   - ✅ Migration de toutes les routes API (16 routes)

2. **Configuration Vercel**
   - ✅ Création de `vercel.json`
   - ✅ Configuration des builds et déploiements
   - ✅ Configuration des headers pour les fichiers statiques

3. **Configuration MongoDB**
   - ✅ Création de `lib/mongodb.ts` - Connexion MongoDB avec cache
   - ✅ Création de tous les modèles Mongoose:
     - User
     - Lot
     - Reservation
     - Payment
     - AdminFile
     - Logo
     - FlashInfo

4. **Variables d'environnement**
   - ✅ Création de `.env.example`
   - ✅ Création de `.env.local` (à personnaliser)
   - ✅ Documentation détaillée dans `MONGODB_SETUP.md`

5. **Documentation**
   - ✅ Guide de déploiement complet (`DEPLOYMENT.md`)
   - ✅ Guide de configuration MongoDB (`MONGODB_SETUP.md`)
   - ✅ Mise à jour de `worklog.md`

---

## Fichiers Créés/Modifiés

### Nouveaux fichiers

```
lib/
├── mongodb.ts                          # Connexion MongoDB
├── db.ts                               # Export des modèles
└── models/
    ├── User.ts                         # Modèle Utilisateur
    ├── Lot.ts                          # Modèle Lot
    ├── Reservation.ts                  # Modèle Réservation
    ├── Payment.ts                      # Modèle Paiement
    ├── AdminFile.ts                    # Modèle Fichiers Admin
    ├── Logo.ts                         # Modèle Logo
    └── FlashInfo.ts                    # Modèle Flash Info

.env.example                            # Exemple variables d'environnement
.env.local                              # Variables locales (à personnaliser)
vercel.json                            # Configuration Vercel
DEPLOYMENT.md                           # Guide de déploiement
MONGODB_SETUP.md                        # Guide configuration MongoDB
```

### Routes API migrées (16 fichiers)

```
src/app/api/
├── reservations/route.ts
├── user/
│   ├── reservations/route.ts
│   ├── payments/route.ts
│   ├── stats/route.ts
│   └── profile/route.ts
├── lots/route.ts
├── flash-info/
│   ├── settings/route.ts
│   └── route.ts
├── flash-info-settings/route.ts
├── user-stats/route.ts
├── admin/
│   ├── payments/route.ts
│   ├── users/route.ts
│   ├── stats/route.ts
│   ├── payments-list/route.ts
│   └── dashboard-stats/route.ts
└── logo/route.ts
```

### Fichiers modifiés

```
src/lib/db.ts                          # Remplacé par connexion MongoDB
package.json                           # Nettoyage des scripts Prisma
```

---

## Modèles de Données MongoDB

### User
```typescript
{
  firstName: string,
  lastName: string,
  phone: string (unique),
  email: string (unique, optional),
  password: string (optional),
  isResident: boolean,
  referralCode: string (unique, optional),
  referredByCode: string,
  profileImage: string,
  idCard: string,
  selfie: string,
  status: 'ACTIVE' | 'BLOCKED',
  timestamps
}
```

### Lot
```typescript
{
  name: string,
  block: string,
  surface: string,
  priceRes: number,
  priceNon: number,
  status: 'AVAILABLE' | 'RESERVED' | 'PAID',
  description: string,
  positionX: number,
  positionY: number,
  timestamps
}
```

### Reservation
```typescript
{
  userId: string (indexed),
  lotId: string (indexed),
  paidAmount: number,
  totalPrice: number,
  isResident: boolean,
  status: 'RESERVED' | 'PAID',
  timestamps
}
```

### Payment
```typescript
{
  userId: string (indexed),
  lotId: string (indexed),
  amount: number,
  status: 'PENDING' | 'VALIDATED',
  type: 'FULL' | 'PARTIAL',
  timestamps
}
```

---

## Variables d'environnement Requises

### Dans `.env.local` (développement)

```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
NODE_ENV=development
```

### Dans Vercel (production)

1. Allez à Settings → Environment Variables
2. Ajoutez:
   - **Name**: `MONGODB_URI`
   - **Value**: Votre chaîne de connexion MongoDB
   - **Environments**: ✅ Production, ✅ Preview, ✅ Development

---

## Étapes de Déploiement

### 1. Configuration MongoDB Atlas

1. Créer un compte MongoDB Atlas: https://www.mongodb.com/cloud/atlas
2. Créer un cluster gratuit (M0)
3. Créer un utilisateur de base de données avec password
4. Configurer l'accès réseau: `0.0.0.0/0` (allow all)
5. Copier la chaîne de connexion

### 2. Configuration locale

1. Créer `.env.local` avec votre MONGODB_URI
2. Tester localement:
```bash
bun install
bun run dev
```

### 3. Déploiement sur Vercel

#### Option A: Via GitHub (Recommandé)

1. Pousser le code sur GitHub
2. Connecter Vercel à GitHub
3. Importer le dépôt
4. Configurer les variables d'environnement
5. Déployer

#### Option B: Via Vercel CLI

```bash
bun add -g vercel
vercel login
vercel
vercel env add MONGODB_URI production
vercel --prod
```

---

## Patterns de Migration Prisma → Mongoose

### Connexion
```typescript
// Prisma
import { db } from '@/lib/db';

// Mongoose
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

await connectDB(); // Ajouter au début de chaque route
```

### Find One
```typescript
// Prisma
await db.user.findUnique({ where: { phone } })

// Mongoose
await User.findOne({ phone })
```

### Find Many
```typescript
// Prisma
await db.lot.findMany()

// Mongoose
await Lot.find()
```

### Create
```typescript
// Prisma
await db.user.create({ data: { ... } })

// Mongoose
const user = new User({ ... });
await user.save();
return user.toObject();
```

### Update
```typescript
// Prisma
await db.user.update({ where: { id }, data: { ... } })

// Mongoose
await User.findByIdAndUpdate(id, { ... }, { new: true })
```

### Delete
```typescript
// Prisma
await db.user.delete({ where: { id } })

// Mongoose
await User.findByIdAndDelete(id)
```

### Count
```typescript
// Prisma
await db.user.count()

// Mongoose
await User.countDocuments()
```

### Sort
```typescript
// Prisma
await db.lot.findMany({ orderBy: { name: 'asc' } })

// Mongoose
await Lot.find().sort({ name: 1 }) // 1 = asc, -1 = desc
```

---

## Avantages de MongoDB

### Avantages par rapport à SQLite

1. **Scalabilité**: Peut gérer beaucoup plus d'utilisateurs
2. **Hébergement cloud**: MongoDB Atlas gratuite
3. **Replication**: Réplication automatique
4. **Backup**: Sauvegardes automatiques (payant)
5. **Flexibilité**: Schéma flexible (NoSQL)
6. **Performance**: Bonnes performances pour les requêtes complexes
7. **Real-time**: Support pour le temps réel

### Avantages pour KAMI-EXTENSION

1. **Multi-utilisateurs**: Peut gérer des milliers d'utilisateurs
2. **Géodistribution**: Clusters dans différentes régions
3. **Chat**: Support natif pour les messages temps réel
4. **Analytics**: Agrégations complexes pour les statistiques
5. **Fichiers**: GridFS pour les fichiers (images, documents)

---

## Coûts

### MongoDB Atlas Free Tier (M0)
- 512 MB de stockage
- RAM partagé
- 1 cluster
- **Coût**: 0 FCFA / mois

### Vercel Hobby Plan
- 100 GB bande passante / mois
- Deploiements automatiques
- Edge Functions
- **Coût**: 0 FCFA / mois

### **Total**: 0 FCFA / mois

### Upgrade si nécessaire

Pour une application en production avec plus d'utilisateurs:

| Service | Plan | Coût |
|---------|------|------|
| MongoDB Atlas | M10 | $9/mois |
| Vercel | Pro | $20/mois |
| **Total** | | **$29/mois** (~18,000 FCFA/mois) |

---

## Maintenance

### Sauvegardes MongoDB

```bash
# Export
mongodump --uri="MONGODB_URI" --out=./backup

# Import
mongorestore --uri="MONGODB_URI" --dir=./backup
```

### Surveillance

1. **Vercel Dashboard**
   - Analytics
   - Logs
   - Deployments

2. **MongoDB Atlas Dashboard**
   - Metrics
   - Slow Queries
   - Cluster Status

### Mises à jour

```bash
# Pull les modifications
git pull origin main

# Installer les dépendances
bun install

# Tester localement
bun run dev

# Déployer
vercel --prod
```

---

## Sécurité

### Mise en place

✅ Variables d'environnement pour les secrets
✅ MongoDB Atlas authentification
✅ TLS/SSL encryption (mongodb+srv://)
✅ IP whitelist (configurable)
✅ HTTPS automatique (Vercel)
✅ Protection DDoS (Vercel)

### Bonnes pratiques

1. Rotation régulière des mots de passe MongoDB
2. Utilisation de mots de passe forts
3. Validation des entrées utilisateur
4. Gestion des erreurs sans exposition de secrets
5. Logs sécurisés (pas de données sensibles)

---

## Support et Documentation

- **Vercel**: https://vercel.com/docs
- **MongoDB Atlas**: https://docs.mongodb.com/atlas
- **Mongoose**: https://mongoosejs.com/docs
- **Next.js**: https://nextjs.org/docs

---

## Test en production

Après déploiement:

1. **Tester l'inscription**
   - Créer un compte avec email et mot de passe
   - Vérifier que l'utilisateur est sauvegardé dans MongoDB Atlas

2. **Tester la connexion**
   - Se connecter avec email/password
   - Vérifier que l'authentification fonctionne

3. **Tester la réservation**
   - Compléter le profil (photo, ID, selfie)
   - Réserver un lot
   - Effectuer un paiement

4. **Tester le chat**
   - Envoyer un message à l'admin
   - Vérifier que le message est stocké

5. **Tester le mode sombre**
   - Basculer entre les thèmes
   - Vérifier que les textes sont lisibles

6. **Tester le responsive**
   - Sur desktop
   - Sur tablette
   - Sur mobile

7. **Vérifier les logs**
   - Vercel Logs: https://vercel.com/dashboard
   - MongoDB Atlas Logs: https://cloud.mongodb.com

---

## Résolution de problèmes

### Erreur: "MongoError: bad auth"

**Cause**: Mauvais credentials MongoDB

**Solution**:
1. Vérifiez MONGODB_URI
2. Vérifiez le nom d'utilisateur et le mot de passe
3. Vérifiez que l'utilisateur a les bonnes permissions

### Erreur: "MongooseServerSelectionError"

**Cause**: Impossible de se connecter à MongoDB

**Solution**:
1. Vérifiez que le cluster est en ligne
2. Vérifiez l'accès réseau (IP whitelist)
3. Vérifiez la chaîne de connexion
4. Essayez sans `+srv`: `mongodb://...`

### Erreur: "Cannot find module 'mongodb'"

**Cause**: Mongoose non installé

**Solution**:
```bash
bun install mongoose
```

### Build échoue sur Vercel

**Cause**: Erreur de build ou dépendance manquante

**Solution**:
1. Vérifiez les logs de build dans Vercel
2. Testez le build localement: `bun run build`
3. Vérifiez que toutes les dépendances sont dans package.json
4. Vérifiez la version de Node.js (Vercel utilise la dernière)

---

## Checklist de déploiement

- [ ] MongoDB Atlas configuré
- [ ] Cluster créé
- [ ] Utilisateur de base de données créé
- [ ] Accès réseau configuré
- [ ] Connection string obtenue
- [ ] .env.local configuré localement
- [ ] Application testée localement
- [ ] Code poussé sur GitHub
- [ ] Projet Vercel créé
- [ ] Variables d'environnement configurées dans Vercel
- [ ] Premier déploiement réussi
- [ ] Application testée en production
- [ ] Domaine personnalisé configuré (optionnel)
- [ ] HTTPS vérifié
- [ ] Logs vérifiés (pas d'erreurs)
- [ ] MongoDB Atlas vérifié (données stockées)

---

🚉 **Votre application est prête pour le déploiement en production avec MongoDB et Vercel!**