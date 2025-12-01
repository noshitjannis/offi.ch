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
		const website = (formData.get("website") || "").toString().trim();

		const db = await getDb();
		const existing = await db.collection("users").findOne({
			_id: locals.user.id
		} as Record<string, unknown>);

		let logoData = (existing as any)?.company?.logoData || "";
		const logoFile = formData.get("logo");
		if (logoFile && typeof logoFile === "object" && "arrayBuffer" in logoFile) {
			const arrayBuffer = await logoFile.arrayBuffer();
			if (arrayBuffer.byteLength > 0) {
				const contentType =
					(logoFile as File).type && (logoFile as File).type.length > 0
						? (logoFile as File).type
						: "image/png";
				const base64 = Buffer.from(arrayBuffer).toString("base64");
				logoData = `data:${contentType};base64,${base64}`;
			}
		}

		const company = {
			addressStreet: (formData.get("addressStreet") || "").toString().trim(),
			addressZip: (formData.get("addressZip") || "").toString().trim(),
			addressCity: (formData.get("addressCity") || "").toString().trim(),
			phone: (formData.get("phone") || "").toString().trim(),
			website,
			logoData,
			mwst: (formData.get("mwst") || "").toString().trim(),
			bankName: (formData.get("bankName") || "").toString().trim(),
			bankLocation: (formData.get("bankLocation") || "").toString().trim(),
			bankAccount: (formData.get("bankAccount") || "").toString().trim(),
			bankIban: (formData.get("bankIban") || "").toString().trim(),
			bankSwift: (formData.get("bankSwift") || "").toString().trim()
		};

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
