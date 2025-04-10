import { MongoClient } from "mongodb";

const uri = process.env.NEXT_PUBLIC_MONGODB_URI;

if (!uri) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

let client;
let clientPromise;

if (process.env.NODE_ENV === "development") {
  // In develop mode, use a global variable to avoid new MongoClient connection on every request
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = new MongoClient(uri, { useUnifiedTopology: true }).connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = new MongoClient(uri, { useUnifiedTopology: true }).connect();
}

export default clientPromise;
