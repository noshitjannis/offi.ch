import type { RequestHandler } from "./$types";
import { json } from "@sveltejs/kit";
import { getDb } from "$lib/server/mongo";
import { generateIdFromEntropySize } from "lucia";

export const POST: RequestHandler = async ({ request, locals }) => {
	if (!locals.user) {
		return json({ error: "UNAUTHENTICATED" }, { status: 401 });
	}

	const body = await request.json();
	const data = body.data;
	if (!data) {
		return json({ error: "INVALID" }, { status: 400 });
	}

	const draftId = typeof body.id === "string" ? body.id : null;
	const name =
		typeof body.name === "string" && body.name.trim().length > 0
			? body.name.trim()
			: `Abgeschlossen ${new Date().toLocaleString("de-CH")}`;
	const offerNumber = typeof body.offerNumber === "string" ? body.offerNumber : "";

	const db = await getDb();
	const now = new Date();
	const id = draftId || generateIdFromEntropySize(12);

	if (draftId) {
		await db.collection("drafts").deleteOne({
			_id: draftId,
			userId: locals.user.id
		} as Record<string, unknown>);
	}

	const existingOffer = await db.collection("offers").findOne({
		_id: id,
		userId: locals.user.id
	} as Record<string, unknown>);

	await db.collection("offers").updateOne(
		{
			_id: id,
			userId: locals.user.id
		},
		{
			$set: {
				userId: locals.user.id,
				name,
				offerNumber,
				data
			},
			$setOnInsert: { createdAt: existingOffer?.createdAt ?? now }
		},
		{ upsert: true }
	);

	return json({ ok: true, id, name });
};
