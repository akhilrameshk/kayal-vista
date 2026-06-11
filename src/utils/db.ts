import mongoose from 'mongoose';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const MONGODB_URI:any = process.env.MONGODB_URI 

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside your configuration.');
}

// Global caching container to preserve connections across Next.js dev hot-reloads
interface GlobalMongoose {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: GlobalMongoose | undefined;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cached:any = globalThis.mongoose;

if (!cached) {
  cached = globalThis.mongoose = { conn: null, promise: null };
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      console.log('✨ Clean connection established to MongoDB: kayalvista instance');
      return mongooseInstance;
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