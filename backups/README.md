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