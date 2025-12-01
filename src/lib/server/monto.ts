// src/lib/server/mongo.ts
import { MongoClient } from "mongodb";
import { env } from "$env/dynamic/private";

if (!env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not set");
}

const client = new MongoClient(env.MONGODB_URI);

// Wir nutzen eine einzelne DB für alles
const dbName = env.MONGODB_DB_NAME || "offertino";

let clientPromise: Promise<MongoClient>;

// Sicherstellen, dass im Dev nicht bei jedem HMR ein neuer Client entsteht
if (globalThis.__mongoClientPromise) {
    clientPromise = globalThis.__mongoClientPromise;
} else {
    clientPromise = client.connect();
    globalThis.__mongoClientPromise = clientPromise;
}

export const getDb = async () => {
    const connectedClient = await clientPromise;
    return connectedClient.db(dbName);
};

// (Optional) direkt Zugriff auf Collections
export const getUsersCollection = async () => {
    const db = await getDb();
    return db.collection("users");
};

export const getSessionsCollection = async () => {
    const db = await getDb();
    return db.collection("sessions");
};

// TypeScript-Deklaration für globalThis, falls du TS nutzt
declare global {
    // eslint-disable-next-line no-var
    var __mongoClientPromise: Promise<MongoClient> | undefined;
}
