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
	let name = typeof body.name === "string" && body.name.trim() ? body.name.trim() : "";
	if (!name) {
		name = `Entwurf ${new Date().toLocaleString("de-CH")}`;
	}

	if (!data) {
		return json({ error: "INVALID" }, { status: 400 });
	}

	const db = await getDb();
	const now = new Date();
	const draftId = body.id || generateIdFromEntropySize(12);

	await db.collection("drafts").updateOne(
		{
			_id: draftId,
			userId: locals.user.id
		},
		{
			$set: {
				userId: locals.user.id,
				name,
				data,
				updatedAt: now
			},
			$setOnInsert: { createdAt: now }
		},
		{ upsert: true }
	);

	return json({ ok: true, id: draftId, name });
};
