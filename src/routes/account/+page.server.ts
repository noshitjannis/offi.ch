import type { Actions, PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";
import { auth } from "$lib/server/auth";
import { getDb } from "$lib/server/mongo";
import { generateIdFromEntropySize } from "lucia";

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		throw redirect(302, "/login/basic");
	}

	const db = await getDb();
	const record = await db.collection("users").findOne({
		// string ids in our setup
		_id: locals.user.id
	} as Record<string, unknown>);

	const draftsCursor = db
		.collection("drafts")
		.find({ userId: locals.user.id } as Record<string, unknown>)
		.project({ _id: 1, name: 1, updatedAt: 1 })
		.sort({ updatedAt: -1 });
	const drafts = await draftsCursor.toArray();

	const offersCursor = db
		.collection("offers")
		.find({ userId: locals.user.id } as Record<string, unknown>)
		.project({ _id: 1, name: 1, offerNumber: 1, createdAt: 1 })
		.sort({ createdAt: -1 });
	const offers = await offersCursor.toArray();

	return {
		user: {
			id: locals.user.id,
			email: locals.user.email,
			name: locals.user.name
		},
		profile: record?.company ?? {},
		drafts: drafts.map((d) => ({
			id: d._id,
			name: d.name,
			updatedAt: d.updatedAt
		})),
		offers: offers.map((o) => ({
			id: o._id,
			name: o.name,
			offerNumber: o.offerNumber,
			createdAt: o.createdAt
		}))
	};
};

export const actions: Actions = {
	deleteDraft: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(302, "/login/basic");
		}

		const formData = await request.formData();
		const draftId = formData.get("draftId");
		if (!draftId || typeof draftId !== "string") {
			throw redirect(302, "/account");
		}

		const db = await getDb();
		await db.collection("drafts").deleteOne({
			_id: draftId,
			userId: locals.user.id
		} as Record<string, unknown>);

		throw redirect(302, "/account");
	},
	deleteOffer: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(302, "/login/basic");
		}

		const formData = await request.formData();
		const offerId = formData.get("offerId");
		if (!offerId || typeof offerId !== "string") {
			throw redirect(302, "/account");
		}

		const db = await getDb();
		await db.collection("offers").deleteOne({
			_id: offerId,
			userId: locals.user.id
		} as Record<string, unknown>);

		throw redirect(302, "/account");
	},
	reopenOffer: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(302, "/login/basic");
		}

		const formData = await request.formData();
		const offerId = formData.get("offerId");
		if (!offerId || typeof offerId !== "string") {
			throw redirect(302, "/account");
		}

		const db = await getDb();
		const offer = await db.collection("offers").findOne({
			_id: offerId,
			userId: locals.user.id
		} as Record<string, unknown>);

		if (!offer) {
			throw redirect(302, "/account");
		}

		const now = new Date();
		const newDraftId = generateIdFromEntropySize(12);

		await db.collection("drafts").insertOne({
			_id: newDraftId,
			userId: locals.user.id,
			name: (offer as any).name ?? "",
			data: (offer as any).data,
			createdAt: now,
			updatedAt: now
		} as any);

		throw redirect(302, `/builder?draft=${newDraftId}`);
	},
	renameDraft: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(302, "/login/basic");
		}

		const formData = await request.formData();
		const draftId = formData.get("draftId");
		const name = (formData.get("name") || "").toString().trim();

		if (!draftId || typeof draftId !== "string" || !name) {
			throw redirect(302, "/account");
		}

		const db = await getDb();
		await db.collection("drafts").updateOne(
			{
				_id: draftId,
				userId: locals.user.id
			},
			{ $set: { name, updatedAt: new Date() } }
		);

		throw redirect(302, "/account");
	},
	renameOffer: async ({ request, locals }) => {
		if (!locals.user) {
			throw redirect(302, "/login/basic");
		}

		const formData = await request.formData();
		const offerId = formData.get("offerId");
		const name = (formData.get("name") || "").toString().trim();

		if (!offerId || typeof offerId !== "string" || !name) {
			throw redirect(302, "/account");
		}

		const db = await getDb();
		await db.collection("offers").updateOne(
			{
				_id: offerId,
				userId: locals.user.id
			},
			{ $set: { name } }
		);

		throw redirect(302, "/account");
	},
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
