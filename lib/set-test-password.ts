// One-off script: set a known password on the seeded test user Jean Koné
// so we can log in via the browser and exercise the payment flow.
import 'dotenv/config';
import mongoose from 'mongoose';
import { hashPassword } from '../src/lib/password';
import { User } from '../src/lib/models/User';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined');
  process.exit(1);
}

async function main() {
  await mongoose.connect(MONGODB_URI as string);
  const hashed = hashPassword('test1234');
  const updated = await User.updateOne(
    { phone: '07584210' },
    { $set: { password: hashed } }
  );
  console.log('Matched:', updated.matchedCount, 'Modified:', updated.modifiedCount);
  const u = await User.findOne({ phone: '07584210' }).select('name phone password isResident');
  console.log('User now has password:', !!u?.password);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
