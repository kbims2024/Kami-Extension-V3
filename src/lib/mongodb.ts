import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || '';

if (!MONGO_URI) {
  console.warn('[MONGODB] MONGO_URI is not set in environment variables');
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var _mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global._mongooseCache || {
  conn: null,
  promise: null,
};

if (!global._mongooseCache) {
  global._mongooseCache = cached;
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!MONGO_URI) {
    throw new Error('MongoDB connection string is not defined. Set MONGO_URI (or MONGODB_URI) in your environment.');
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 2,
    };
    cached.promise = mongoose.connect(MONGO_URI, opts).then((mongoose) => {
      console.log('[MONGODB] Connected successfully');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}