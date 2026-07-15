/**
 * Script de migration des données de SQLite vers MongoDB
 *
 * Note: Cette migration est optionnelle car vous n'avez probablement
 * pas de données de production dans SQLite.
 *
 * Recommandation: Commencer avec MongoDB vide.
 */

import mongoose from 'mongoose';
import { connectDB } from '@/lib/mongodb';
import { User } from '@/lib/models/User';
import { Lot } from '@/lib/models/Lot';
import { Reservation } from '@/lib/models/Reservation';
import { Payment } from '@/lib/models/Payment';

export async function migrateData() {
  console.log('🚀 Début de la migration...\n');

  // Connecter à MongoDB
  await connectDB();
  console.log('✅ Connecté à MongoDB\n');

  // Vérifier si MongoDB est déjà peuplé
  const userCount = await User.countDocuments();
  const lotCount = await Lot.countDocuments();

  if (userCount > 0 || lotCount > 0) {
    console.log('⚠️  MongoDB contient déjà des données:');
    console.log(`   - Utilisateurs: ${userCount}`);
    console.log(`   - Lots: ${lotCount}\n`);
    console.log('   Pour réinitialiser, utilisez les commandes MongoDB Compass\n');
    return;
  }

  console.log('✅ MongoDB est vide - Prêt pour les premières données!\n');

  // Créer des lots par défaut (vous pouvez personnaliser)
  console.log('📦 Création des lots par défaut...');
  const defaultLots = [
    { name: 'A-01', block: 'A', surface: '300m²', priceRes: 100000, priceNon: 150000, status: 'AVAILABLE' },
    { name: 'A-02', block: 'A', surface: '350m²', priceRes: 100000, priceNon: 150000, status: 'AVAILABLE' },
    { name: 'A-03', block: 'A', surface: '400m²', priceRes: 100000, priceNon: 150000, status: 'AVAILABLE' },
    { name: 'B-01', block: 'B', surface: '300m²', priceRes: 150000, priceNon: 200000, status: 'AVAILABLE' },
    { name: 'B-02', block: 'B', surface: '350m²', priceRes: 150000, priceNon: 200000, status: 'AVAILABLE' },
    { name: 'B-03', block: 'B', surface: '400m²', priceRes: 150000, priceNon: 200000, status: 'AVAILABLE' },
    { name: 'C-01', block: 'C', surface: '300m²', priceRes: 100000, priceNon: 150000, status: 'AVAILABLE' },
    { name: 'C-02', block: 'C', surface: '350m²', priceRes: 100000, priceNon: 150000, status: 'AVAILABLE' },
  ];

  await Lot.insertMany(defaultLots);
  console.log(`✅ ${defaultLots.length} lots créés\n`);

  console.log('✅ Migration terminée avec succès!\n');
  console.log('📝 Résumé:');
  console.log(`   - Lots créés: ${defaultLots.length}`);
  console.log(`   - Utilisateurs: 0 (seront créés lors de l'inscription)\n`);
  console.log('🎉 Votre base de données est prête pour la production!\n');
}