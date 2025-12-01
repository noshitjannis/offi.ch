import type { Actions } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { hashPassword } from "$lib/server/password";
import { generateIdFromEntropySize } from "lucia";
import { getDb } from "$lib/server/mongo";
import { auth } from "$lib/server/auth";

export const actions: Actions = {
	register: async ({ request, cookies }) => {
		const formData = await request.formData();
		const company = (formData.get("company") || "").toString().trim();
		const email = (formData.get("email") || "").toString().trim().toLowerCase();
		const password = (formData.get("password") || "").toString();

		if (!company || !email || !password) {
			return fail(400, {
				message: "Bitte Firmenname, E-Mail und Passwort ausfüllen.",
				company,
				email
			});
		}

		if (password.length < 8) {
			return fail(400, {
				message: "Passwort muss mindestens 8 Zeichen lang sein.",
				company,
				email
			});
		}

		const db = await getDb();
		const existing = await db.collection("users").findOne({ email });
		if (existing) {
			return fail(400, {
				message: "Diese E-Mail ist bereits vergeben.",
				company,
				email
			});
		}

		const userId = generateIdFromEntropySize(10);
		const passwordHash = hashPassword(password);

		await db.collection("users").insertOne({
			_id: userId,
			email,
			name: company,
			passwordHash
		} as any);

		const session = await auth.createSession(userId, {});
		const sessionCookie = auth.createSessionCookie(session.id);
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: "/",
			...sessionCookie.attributes
		});

		throw redirect(302, "/");
	}
};
