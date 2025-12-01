import type { Actions, PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { auth } from "$lib/server/auth";
import { getDb } from "$lib/server/mongo";

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, "/login/basic");
	}

	const db = await getDb();
	const record = await db.collection("users").findOne({
		// string ids in our setup
		_id: locals.user.id
	} as Record<string, unknown>);

	return {
		user: {
			id: locals.user.id,
			email: locals.user.email,
			name: locals.user.name
		},
		profile: record?.company ?? {}
	};
};

export const actions: Actions = {
	save: async ({ locals, request }) => {
		if (!locals.user) {
			throw redirect(302, "/login/basic");
		}

		const formData = await request.formData();
		const company = {
			addressStreet: (formData.get("addressStreet") || "").toString().trim(),
			addressZip: (formData.get("addressZip") || "").toString().trim(),
			addressCity: (formData.get("addressCity") || "").toString().trim(),
			phone: (formData.get("phone") || "").toString().trim(),
			website: (formData.get("website") || "").toString().trim(),
			mwst: (formData.get("mwst") || "").toString().trim(),
			bankName: (formData.get("bankName") || "").toString().trim(),
			bankLocation: (formData.get("bankLocation") || "").toString().trim(),
			bankAccount: (formData.get("bankAccount") || "").toString().trim(),
			bankIban: (formData.get("bankIban") || "").toString().trim(),
			bankSwift: (formData.get("bankSwift") || "").toString().trim()
		};

		const db = await getDb();
		await db
			.collection("users")
			.updateOne({ _id: locals.user.id } as Record<string, unknown>, { $set: { company } });

		return { updated: true, company };
	},
	logout: async ({ locals, cookies }) => {
		if (!locals.session) {
			throw redirect(302, "/login/basic");
		}

		await auth.invalidateSession(locals.session.id);
		const blank = auth.createBlankSessionCookie();
		cookies.set(blank.name, blank.value, { path: "/", ...blank.attributes });

		throw redirect(302, "/login/basic");
	}
};
