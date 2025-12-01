// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			auth: typeof import("$lib/server/auth").auth;
			user: import("lucia").User | null;
			session: import("lucia").Session | null;
		}
	}
}

export {};
