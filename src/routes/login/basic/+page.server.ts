import type { Actions, PageServerLoad } from "./$types";
import { fail, redirect } from "@sveltejs/kit";
import { auth } from "$lib/server/auth";
import { getDb } from "$lib/server/mongo";
import { verifyPassword } from "$lib/server/password";

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		throw redirect(302, "/account");
	}
	return {};
};

export const actions: Actions = {
	login: async ({ request, cookies }) => {
		const formData = await request.formData();
		const email = (formData.get("email") || "").toString().trim().toLowerCase();
		const password = (formData.get("password") || "").toString();

		if (!email || !password) {
			return fail(400, { message: "Bitte E-Mail und Passwort eingeben.", email });
		}

		const db = await getDb();
		const user = await db.collection("users").findOne<{ _id: unknown; passwordHash?: string }>({
			email
		});

		if (!user?.passwordHash) {
			return fail(400, {
				message: "E-Mail oder Passwort ist falsch.",
				email
			});
		}

		const passwordMatches = verifyPassword(password, user.passwordHash);
		if (!passwordMatches) {
			return fail(400, {
				message: "E-Mail oder Passwort ist falsch.",
				email
			});
		}

		const userId =
			typeof user._id === "string"
				? user._id
				: typeof user._id === "object" && user._id !== null && "toString" in user._id
					? (user._id as { toString: () => string }).toString()
					: "";

		if (!userId) {
			return fail(500, {
				message: "Konto ist fehlerhaft gespeichert.",
				email
			});
		}

		const session = await auth.createSession(userId, {});
		const sessionCookie = auth.createSessionCookie(session.id);
		cookies.set(sessionCookie.name, sessionCookie.value, {
			path: "/",
			...sessionCookie.attributes
		});

		throw redirect(302, "/");
	}
};
