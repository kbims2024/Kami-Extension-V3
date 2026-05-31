# Sauvegardes KAMI-EXTENSION

Ce dossier contient les sauvegardes des fichiers modifiés pour permettre une restauration en cas d'incompréhension.

## Format de nommage
`nom-du-fichier.ext.backup-YYYYMMDD-HHMMSS`

## Historique des sauvegardes

### 2025-05-31

#### `flash-info-band.tsx.backup-20260531-053732`
**Description**: Sauvegarde avant modification mobile de la barre de flash info

**Modifications effectuées**:
- Mobile: "FLASH INFO" → "INFO" (plus compact)
- Desktop: "FLASH INFO" (inchangé)
- Réduction épaisseur conteneur: `py-3` → `py-2 md:py-3`
- Réduction padding horizontal: `px-4` → `px-3 md:px-4`
- Réduction taille texte: `text-sm` → `text-xs md:text-sm`

**Commande de restauration**:
```bash
cp /home/z/my-project/backups/flash-info-band.tsx.backup-20260531-053732 /home/z/my-project/src/components/flash-info-band.tsx
```

#### `flash-info-band.tsx.backup-20260531-055202`
**Description**: Sauvegarde avant ajout fonctionnalité favoris de couleurs dans FlashInfoAdmin

**Modifications effectuées**:
- Ajout de l'interface ColorFavorite
- Ajout des états pour gérer les favoris de couleurs
- Ajout des fonctions loadColorFavorites, handleSaveColorFavorite, handleDeleteColorFavorite
- Ajout de la modal pour nommer les favoris de couleurs
- Ajout de l'affichage des favoris (texte et fond) dans le formulaire
- Création de l'API route `/api/color-favorites` (GET, POST, DELETE)

**Commande de restauration**:
```bash
cp /home/z/my-project/backups/flash-info-band.tsx.backup-20260531-055202 /home/z/my-project/src/components/flash-info-band.tsx
cp /home/z/my-project/backups/flash-info-api-route.ts.backup-20260531-055202 /home/z/my-project/src/app/api/flash-info/route.ts
```

#### `flash-info-api-route-v3.backup-20260531-060307`
**Description**: Sauvegarde avant ajout settings dans API flash-info

**Modifications effectuées**:
- Ajout du support de `settings` dans le PUT endpoint
- Permet de mettre à jour scrollSpeed, bgColor, textColor
- Si `settings` est présent, met à jour les settings globaux
- Sinon, met à jour un flash info spécifique

**Commande de restauration**:
```bash
cp /home/z/my-project/backups/flash-info-api-route-v3.backup-20260531-060307 /home/z/my-project/src/app/api/flash-info/route.ts
```

#### `FlashInfoAdmin.tsx.backup-20260531-055956`
**Description**: Sauvegarde avant ajout configuration intelligente des paramètres

**Modifications effectuées**:
- Ajout de l'interface SettingPreset
- Ajout de la section "Paramètres de la barre" avec bouton toggle
- Ajout des états: showSettings, settingsData, settingPresets, showPresetName, presetNameInput
- Ajout des fonctions: loadSettingPresets, handleSaveSettings, handleSaveSettingsAsPreset, handleApplyPreset, handleDeletePreset
- Slider pour la vitesse de défilement (10s-120s)
- Configuration des couleurs de fond et texte de la barre
- Support des favoris pour les couleurs de settings
- Sauvegarde de configuration comme préréglage
- Application rapide des préréglages
- Aperçu en temps réel de la barre avec les paramètres actuels
- Création de l'API route `/api/flash-info-settings` (PUT)
- Création de l'API route `/api/flash-info-presets` (GET, POST, DELETE)

**Commande de restauration**:
```bash
cp /home/z/my-project/backups/FlashInfoAdmin.tsx.backup-20260531-055956 /home/z/my-project/src/components/kami/FlashInfoAdmin.tsx
rm /home/z/my-project/src/app/api/flash-info-settings/route.ts 2>/dev/null || true
rm /home/z/my-project/src/app/api/flash-info-presets/route.ts 2>/dev/null || true
```

#### `flash-info-api-route.backup-20260531-060307`
**Description**: Sauvegarde la version complète de l'API flash-info avec support settings

**Commande de restauration**:
```bash
cp /home/z/my-project/backups/flash-info-api-route.backup-20260531-060307 /home/z/my-project/src/app/api/flash-info/route.ts
```

---

## Instructions de restauration

Pour restaurer un fichier à partir d'une sauvegarde:
```bash
cp /home/z/my-project/backups/[nom-du-fichier.backup] /home/z/my-project/[chemin-original-du-fichier]
```

Exemple:
```bash
cp /home/z/my-project/backups/flash-info-band.tsx.backup-20260531-053732 /home/z/my-project/src/components/flash-info-band.tsx
```

---

## Nouveaux fichiers API créés

### `/api/flash-info-settings/route.ts`
- **PUT**: Met à jour les settings globaux de la barre (scrollSpeed, bgColor, textColor)

### `/api/flash-info-presets/route.ts`
- **GET**: Récupérer tous les préréglages sauvegardés
- **POST**: Créer un nouveau préréglage de configuration
- **DELETE**: Supprimer un préréglage

### `/api/color-favorites/route.ts`
- **GET**: Récupérer tous les favoris de couleurs
- **POST**: Ajouter un favori de couleur
- **DELETE**: Supprimer un favori

---

## Commandes utiles

### Lister toutes les sauvegardes
```bash
ls -la /home/z/my-project/backups/
```

### Restaurer toutes les modifications d'une session
```bash
# Restaurer flash-info-band.tsx
cp /home/z/my-project/backups/flash-info-band.tsx.backup-20260531-053732 /home/z/my-project/src/components/flash-info-band.tsx

# Restaurer FlashInfoAdmin
cp /home/z/my-project/backups/FlashInfoAdmin.tsx.backup-20260531-055956 /home/z/my-project/src/components/kami/FlashInfoAdmin.tsx

# Restaurer API flash-info
cp /home/z/my-project/backups/flash-info-api-route.backup-20260531-055202 /home/z/my-project/src/app/api/flash-info/route.ts
```