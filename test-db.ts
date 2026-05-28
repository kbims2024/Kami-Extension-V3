import { db } from './src/lib/db.ts';

console.log('Checking db properties...');
console.log('Available properties:', Object.keys(db));

setTimeout(async () => {
  try {
    console.log('Checking db.adminFile...');
    console.log('Type of db.adminFile:', typeof db.adminFile);

    if (db.adminFile) {
      console.log('db.adminFile methods:', Object.keys(db.adminFile));
      const file = await db.adminFile.findFirst();
      console.log('First file:', file);
    } else {
      console.error('db.adminFile is undefined!');
    }

    // Also check lot for comparison
    console.log('Checking db.lot...');
    console.log('Type of db.lot:', typeof db.lot);
    if (db.lot) {
      const lots = await db.lot.findMany({ take: 1 });
      console.log('First lot:', lots[0]);
    }
  } catch (error) {
    console.error('Error:', error);
  }

  process.exit(0);
}, 1000);