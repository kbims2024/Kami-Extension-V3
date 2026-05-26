import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding...');

  // Supprimer les lots existants
  await prisma.payment.deleteMany({});
  await prisma.reservation.deleteMany({});
  await prisma.lot.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('✅ Données existantes supprimées');

  // Créer des lots de test variés
  const lots = [
    // Bloc A - Lots standards
    { name: 'A-01', block: 'A', surface: '250m²', priceRes: 100000, priceNon: 150000, status: 'AVAILABLE' },
    { name: 'A-02', block: 'A', surface: '300m²', priceRes: 100000, priceNon: 150000, status: 'AVAILABLE' },
    { name: 'A-03', block: 'A', surface: '280m²', priceRes: 100000, priceNon: 150000, status: 'AVAILABLE' },
    { name: 'A-04', block: 'A', surface: '320m²', priceRes: 120000, priceNon: 170000, status: 'AVAILABLE' },
    { name: 'A-05', block: 'A', surface: '350m²', priceRes: 120000, priceNon: 170000, status: 'RESERVED' },
    { name: 'A-06', block: 'A', surface: '300m²', priceRes: 100000, priceNon: 150000, status: 'AVAILABLE' },
    { name: 'A-07', block: 'A', surface: '280m²', priceRes: 100000, priceNon: 150000, status: 'AVAILABLE' },
    { name: 'A-08', block: 'A', surface: '400m²', priceRes: 150000, priceNon: 200000, status: 'AVAILABLE' },

    // Bloc B - Lots plus grands
    { name: 'B-01', block: 'B', surface: '400m²', priceRes: 150000, priceNon: 200000, status: 'AVAILABLE' },
    { name: 'B-02', block: 'B', surface: '450m²', priceRes: 170000, priceNon: 220000, status: 'AVAILABLE' },
    { name: 'B-03', block: 'B', surface: '500m²', priceRes: 200000, priceNon: 250000, status: 'PAID' },
    { name: 'B-04', block: 'B', surface: '420m²', priceRes: 160000, priceNon: 210000, status: 'AVAILABLE' },
    { name: 'B-05', block: 'B', surface: '380m²', priceRes: 140000, priceNon: 190000, status: 'AVAILABLE' },
    { name: 'B-06', block: 'B', surface: '480m²', priceRes: 190000, priceNon: 240000, status: 'AVAILABLE' },

    // Bloc C - Lots premium
    { name: 'C-01', block: 'C', surface: '600m²', priceRes: 300000, priceNon: 400000, status: 'AVAILABLE' },
    { name: 'C-02', block: 'C', surface: '550m²', priceRes: 270000, priceNon: 370000, status: 'AVAILABLE' },
    { name: 'C-03', block: 'C', surface: '650m²', priceRes: 350000, priceNon: 450000, status: 'RESERVED' },
    { name: 'C-04', block: 'C', surface: '500m²', priceRes: 250000, priceNon: 350000, status: 'AVAILABLE' },

    // Bloc D - Lots économiques
    { name: 'D-01', block: 'D', surface: '200m²', priceRes: 80000, priceNon: 120000, status: 'AVAILABLE' },
    { name: 'D-02', block: 'D', surface: '220m²', priceRes: 90000, priceNon: 130000, status: 'AVAILABLE' },
    { name: 'D-03', block: 'D', surface: '180m²', priceRes: 70000, priceNon: 110000, status: 'PAID' },
    { name: 'D-04', block: 'D', surface: '250m²', priceRes: 100000, priceNon: 150000, status: 'AVAILABLE' },
    { name: 'D-05', block: 'D', surface: '230m²', priceRes: 95000, priceNon: 145000, status: 'AVAILABLE' },
    { name: 'D-06', block: 'D', surface: '200m²', priceRes: 80000, priceNon: 120000, status: 'AVAILABLE' },

    // Bloc E - Lots mixtes
    { name: 'E-01', block: 'E', surface: '350m²', priceRes: 130000, priceNon: 180000, status: 'AVAILABLE' },
    { name: 'E-02', block: 'E', surface: '300m²', priceRes: 110000, priceNon: 160000, status: 'AVAILABLE' },
    { name: 'E-03', block: 'E', surface: '400m²', priceRes: 150000, priceNon: 200000, status: 'AVAILABLE' },
    { name: 'E-04', block: 'E', surface: '280m²', priceRes: 100000, priceNon: 150000, status: 'AVAILABLE' },
  ];

  for (const lot of lots) {
    await prisma.lot.create({
      data: lot,
    });
  }

  console.log(`✅ ${lots.length} lots créés avec succès`);

  // Créer des utilisateurs de test
  const users = [
    {
      name: 'Jean Koné',
      phone: '07584210',
      isResident: true,
      referralCode: 'KON789',
      status: 'ACTIVE',
    },
    {
      name: 'Marie Yapo',
      phone: '07123456',
      isResident: false,
      referralCode: 'YAP456',
      status: 'ACTIVE',
    },
  ];

  for (const user of users) {
    await prisma.user.create({
      data: user,
    });
  }

  console.log(`✅ ${users.length} utilisateurs créés avec succès`);

  // Récupérer un utilisateur pour créer des réservations de test
  const jeanUser = await prisma.user.findUnique({
    where: { phone: '07584210' },
  });

  const marieUser = await prisma.user.findUnique({
    where: { phone: '07123456' },
  });

  // Créer quelques réservations de test
  if (jeanUser) {
    const lotA5 = await prisma.lot.findFirst({
      where: { name: 'A-05' },
    });

    if (lotA5) {
      // Réservation partielle pour Jean
      const payment = await prisma.payment.create({
        data: {
          userId: jeanUser.id,
          lotId: lotA5.id,
          amount: 50000,
          status: 'VALIDATED',
          type: 'PARTIAL',
        },
      });

      await prisma.reservation.create({
        data: {
          userId: jeanUser.id,
          lotId: lotA5.id,
          paidAmount: 50000,
          totalPrice: lotA5.priceRes,
          isResident: true,
          status: 'RESERVED',
        },
      });
    }
  }

  if (marieUser) {
    const lotC3 = await prisma.lot.findFirst({
      where: { name: 'C-03' },
    });

    if (lotC3) {
      // Réservation partielle pour Marie
      await prisma.payment.create({
        data: {
          userId: marieUser.id,
          lotId: lotC3.id,
          amount: 150000,
          status: 'VALIDATED',
          type: 'PARTIAL',
        },
      });

      await prisma.reservation.create({
        data: {
          userId: marieUser.id,
          lotId: lotC3.id,
          paidAmount: 150000,
          totalPrice: lotC3.priceNon,
          isResident: false,
          status: 'RESERVED',
        },
      });
    }
  }

  console.log('✅ Réservations de test créées');

  // Créer des paiements validés pour les lots PAID
  const paidLots = await prisma.lot.findMany({
    where: { status: 'PAID' },
  });

  for (const lot of paidLots) {
    const user = await prisma.user.findFirst();

    if (user) {
      await prisma.payment.create({
        data: {
          userId: user.id,
          lotId: lot.id,
          amount: lot.priceRes,
          status: 'VALIDATED',
          type: 'FULL',
        },
      });

      await prisma.reservation.create({
        data: {
          userId: user.id,
          lotId: lot.id,
          paidAmount: lot.priceRes,
          totalPrice: lot.priceRes,
          isResident: true,
          status: 'PAID',
        },
      });
    }
  }

  console.log('✅ Paiements validés créés pour les lots payés');
  console.log('\n🎉 Seeding terminé avec succès !');
  console.log('\n📊 Résumé :');
  console.log(`   - ${lots.length} lots créés`);
  console.log(`   - ${users.length} utilisateurs créés`);
  console.log(`   - Plusieurs réservations et paiements de test`);
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
