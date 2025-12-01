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

	const name =
		typeof body.name === "string" && body.name.trim().length > 0
			? body.name.trim()
			: `Abgeschlossen ${new Date().toLocaleString("de-CH")}`;
	const offerNumber = typeof body.offerNumber === "string" ? body.offerNumber : "";

	const db = await getDb();
	const id = generateIdFromEntropySize(12);
	const now = new Date();

	await db.collection("offers").insertOne(
		{
			_id: id,
			userId: locals.user.id,
			name,
			offerNumber,
			data,
			createdAt: now
		} as any
	);

	return json({ ok: true, id, name });
};
