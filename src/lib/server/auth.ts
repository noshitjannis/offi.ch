// src/lib/server/auth.ts
import { Lucia } from "lucia";
import { dev } from "$app/environment";
import { MongodbAdapter } from "@lucia-auth/adapter-mongodb";
import type { Collection } from "mongodb";
import { getDb } from "$lib/server/mongo";

type AdapterUserDoc = {
	_id: import("lucia").UserId;
	email: string;
	name?: string;
	passwordHash?: string;
};

type AdapterSessionDoc = {
	_id: string;
	user_id: import("lucia").UserId;
	expires_at: Date;
};

const db = await getDb();
const sessions = db.collection<AdapterSessionDoc>("sessions") as Collection<AdapterSessionDoc>;
const users = db.collection<AdapterUserDoc>("users") as Collection<AdapterUserDoc>;
const adapter = new MongodbAdapter(sessions, users);

export const auth = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: !dev
		}
	},
	getUserAttributes: (user) => {
		return {
			email: user.email,
			name: user.name
		};
	}
});

// User-Typen für Lucia (TypeScript)
declare module "lucia" {
    interface Register {
        Lucia: typeof auth;
        DatabaseUserAttributes: {
            email: string;
            name?: string;
        };
    }
}
