/**
 * Script de seeding pour MongoDB - KAMI Extension
 * Utilisez: npx tsx lib/seed-mongodb.ts
 */

import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../src/lib/mongodb';
import { Lot } from '../src/lib/models/Lot';
import { User } from '../src/lib/models/User';
import { Reservation } from '../src/lib/models/Reservation';
import { Payment } from '../src/lib/models/Payment';

async function seed() {
  console.log('🌱 Début du seeding MongoDB...');

  await connectDB();
  console.log('✅ Connecté à MongoDB');

  // Supprimer les données existantes
  await Payment.deleteMany({});
  await Reservation.deleteMany({});
  await Lot.deleteMany({});
  await User.deleteMany({});
  console.log('✅ Données existantes supprimées');

  // Créer des lots
  const lots = [
    // Îlot A - Lots standards
    { name: 'A-01', block: 'A', surface: '250m²', priceRes: 100000, priceNon: 150000, status: 'AVAILABLE', description: 'Lot standard îlot A' },
    { name: 'A-02', block: 'A', surface: '300m²', priceRes: 100000, priceNon: 150000, status: 'AVAILABLE', description: 'Lot standard îlot A' },
    { name: 'A-03', block: 'A', surface: '280m²', priceRes: 100000, priceNon: 150000, status: 'AVAILABLE', description: 'Lot standard îlot A' },
    { name: 'A-04', block: 'A', surface: '320m²', priceRes: 120000, priceNon: 170000, status: 'AVAILABLE', description: 'Lot standard îlot A' },
    { name: 'A-05', block: 'A', surface: '350m²', priceRes: 120000, priceNon: 170000, status: 'RESERVED', description: 'Lot standard îlot A' },
    { name: 'A-06', block: 'A', surface: '300m²', priceRes: 100000, priceNon: 150000, status: 'AVAILABLE', description: 'Lot standard îlot A' },
    { name: 'A-07', block: 'A', surface: '280m²', priceRes: 100000, priceNon: 150000, status: 'AVAILABLE', description: 'Lot standard îlot A' },
    { name: 'A-08', block: 'A', surface: '400m²', priceRes: 150000, priceNon: 200000, status: 'AVAILABLE', description: 'Lot standard îlot A' },

    // Îlot B - Lots plus grands
    { name: 'B-01', block: 'B', surface: '400m²', priceRes: 150000, priceNon: 200000, status: 'AVAILABLE', description: 'Lot spacieux îlot B' },
    { name: 'B-02', block: 'B', surface: '450m²', priceRes: 170000, priceNon: 220000, status: 'AVAILABLE', description: 'Lot spacieux îlot B' },
    { name: 'B-03', block: 'B', surface: '500m²', priceRes: 200000, priceNon: 250000, status: 'PAID', description: 'Lot spacieux îlot B' },
    { name: 'B-04', block: 'B', surface: '420m²', priceRes: 160000, priceNon: 210000, status: 'AVAILABLE', description: 'Lot spacieux îlot B' },
    { name: 'B-05', block: 'B', surface: '380m²', priceRes: 140000, priceNon: 190000, status: 'AVAILABLE', description: 'Lot spacieux îlot B' },
    { name: 'B-06', block: 'B', surface: '480m²', priceRes: 190000, priceNon: 240000, status: 'AVAILABLE', description: 'Lot spacieux îlot B' },

    // Îlot C - Lots premium
    { name: 'C-01', block: 'C', surface: '600m²', priceRes: 300000, priceNon: 400000, status: 'AVAILABLE', description: 'Lot premium îlot C' },
    { name: 'C-02', block: 'C', surface: '550m²', priceRes: 270000, priceNon: 370000, status: 'AVAILABLE', description: 'Lot premium îlot C' },
    { name: 'C-03', block: 'C', surface: '650m²', priceRes: 350000, priceNon: 450000, status: 'RESERVED', description: 'Lot premium îlot C' },
    { name: 'C-04', block: 'C', surface: '500m²', priceRes: 250000, priceNon: 350000, status: 'AVAILABLE', description: 'Lot premium îlot C' },

    // Îlot D - Lots économiques
    { name: 'D-01', block: 'D', surface: '200m²', priceRes: 80000, priceNon: 120000, status: 'AVAILABLE', description: 'Lot économique îlot D' },
    { name: 'D-02', block: 'D', surface: '220m²', priceRes: 90000, priceNon: 130000, status: 'AVAILABLE', description: 'Lot économique îlot D' },
    { name: 'D-03', block: 'D', surface: '180m²', priceRes: 70000, priceNon: 110000, status: 'PAID', description: 'Lot économique îlot D' },
    { name: 'D-04', block: 'D', surface: '250m²', priceRes: 100000, priceNon: 150000, status: 'AVAILABLE', description: 'Lot économique îlot D' },
    { name: 'D-05', block: 'D', surface: '230m²', priceRes: 95000, priceNon: 145000, status: 'AVAILABLE', description: 'Lot économique îlot D' },
    { name: 'D-06', block: 'D', surface: '200m²', priceRes: 80000, priceNon: 120000, status: 'AVAILABLE', description: 'Lot économique îlot D' },

    // Îlot E - Lots mixtes
    { name: 'E-01', block: 'E', surface: '350m²', priceRes: 130000, priceNon: 180000, status: 'AVAILABLE', description: 'Lot mixte îlot E' },
    { name: 'E-02', block: 'E', surface: '300m²', priceRes: 110000, priceNon: 160000, status: 'AVAILABLE', description: 'Lot mixte îlot E' },
    { name: 'E-03', block: 'E', surface: '400m²', priceRes: 150000, priceNon: 200000, status: 'AVAILABLE', description: 'Lot mixte îlot E' },
    { name: 'E-04', block: 'E', surface: '280m²', priceRes: 100000, priceNon: 150000, status: 'AVAILABLE', description: 'Lot mixte îlot E' },
  ];

  const createdLots = await Lot.insertMany(lots);
  console.log(`✅ ${createdLots.length} lots créés`);

  // Créer des utilisateurs de test
  const users = await User.insertMany([
    {
      name: 'Jean Koné',
      pseudo: 'Jean K.',
      phone: '07584210',
      isResident: true,
      referralCode: 'KON789',
      status: 'ACTIVE',
      role: 'USER',
    },
    {
      name: 'Marie Yapo',
      pseudo: 'Marie Y.',
      phone: '07123456',
      isResident: false,
      referralCode: 'YAP456',
      status: 'ACTIVE',
      role: 'USER',
    },
    {
      name: 'Koffi Brou',
      pseudo: 'Koffi B.',
      phone: '07987654',
      isResident: true,
      referralCode: 'BRO321',
      status: 'ACTIVE',
      role: 'USER',
    },
  ]);
  console.log(`✅ ${users.length} utilisateurs créés`);

  const jeanUser = users[0];
  const marieUser = users[1];
  const koffiUser = users[2];

  // Trouver les lots par nom
  const lotA5 = createdLots.find(l => l.name === 'A-05');
  const lotC3 = createdLots.find(l => l.name === 'C-03');
  const lotB3 = createdLots.find(l => l.name === 'B-03');
  const lotD3 = createdLots.find(l => l.name === 'D-03');

  // Réservation de Jean sur A-05 (partielle)
  if (lotA5) {
    await Payment.create({
      userId: jeanUser._id,
      lotId: lotA5._id,
      amount: 50000,
      status: 'VALIDATED',
      type: 'PARTIAL',
    });
    await Reservation.create({
      userId: jeanUser._id,
      lotId: lotA5._id,
      paidAmount: 50000,
      totalPrice: 120000,
      isResident: true,
      status: 'RESERVED',
    });
    console.log('✅ Réservation Jean (A-05) créée');
  }

  // Réservation de Marie sur C-03 (partielle)
  if (lotC3) {
    await Payment.create({
      userId: marieUser._id,
      lotId: lotC3._id,
      amount: 150000,
      status: 'VALIDATED',
      type: 'PARTIAL',
    });
    await Reservation.create({
      userId: marieUser._id,
      lotId: lotC3._id,
      paidAmount: 150000,
      totalPrice: 450000,
      isResident: false,
      status: 'RESERVED',
    });
    console.log('✅ Réservation Marie (C-03) créée');
  }

  // Lot B-03 PAY (payé intégralement par Koffi)
  if (lotB3) {
    await Payment.create({
      userId: koffiUser._id,
      lotId: lotB3._id,
      amount: 200000,
      status: 'VALIDATED',
      type: 'FULL',
    });
    await Reservation.create({
      userId: koffiUser._id,
      lotId: lotB3._id,
      paidAmount: 200000,
      totalPrice: 200000,
      isResident: true,
      status: 'PAID',
    });
    console.log('✅ Achat Koffi (B-03) créé');
  }

  // Lot D-03 PAY (payé intégralement par Jean)
  if (lotD3) {
    await Payment.create({
      userId: jeanUser._id,
      lotId: lotD3._id,
      amount: 70000,
      status: 'VALIDATED',
      type: 'FULL',
    });
    await Reservation.create({
      userId: jeanUser._id,
      lotId: lotD3._id,
      paidAmount: 70000,
      totalPrice: 70000,
      isResident: true,
      status: 'PAID',
    });
    console.log('✅ Achat Jean (D-03) créé');
  }

  console.log('\n🎉 Seeding terminé avec succès !');
  console.log(`\n📊 Résumé :`);
  console.log(`   - ${createdLots.length} lots créés`);
  console.log(`   - ${users.length} utilisateurs créés`);
  console.log(`   - 4 réservations et paiements de test`);

  await mongoose.connection.close();
}

seed().catch((e) => {
  console.error('❌ Erreur lors du seeding:', e);
  process.exit(1);
});