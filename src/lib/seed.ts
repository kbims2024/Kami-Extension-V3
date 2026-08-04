/**
 * Seed script for MongoDB.
 * Usage: npx tsx src/lib/seed.ts
 * 
 * This script initializes the database with default data.
 * Adjust the seed data below to match your needs.
 */
import { connectDB } from './mongodb';
import { Lot } from './models/Lot';
import { Settings } from './models/Settings';

const SEED_LOTS = [
  // Ajoutez vos lots ici selon vos besoins
];

async function seed() {
  console.log('🌱 Connexion à MongoDB...');
  await connectDB();
  console.log('✅ Connecté !');

  // Seed Lots
  const existingLots = await Lot.countDocuments();
  if (existingLots === 0 && SEED_LOTS.length > 0) {
    console.log(`📦 Création de ${SEED_LOTS.length} lots...`);
    await Lot.insertMany(SEED_LOTS);
    console.log('✅ Lots créés !');
  } else {
    console.log(`ℹ️  ${existingLots} lots existent déjà, skip.`);
  }

  // Seed Settings
  const existingSettings = await Settings.countDocuments();
  if (existingSettings === 0) {
    await Settings.create({ heroBackground: null });
    console.log('✅ Settings par défaut créés !');
  } else {
    console.log('ℹ️  Settings existent déjà, skip.');
  }

  console.log('🎉 Seed terminé !');
  process.exit(0);
}

seed().catch((err) => {
  console.error('❌ Erreur lors du seed:', err);
  process.exit(1);
});
