import type { PageServerLoad } from "./$types";
import { getDb } from "$lib/server/mongo";

export const load: PageServerLoad = async ({ locals, url }) => {
	const db = await getDb();

	let profile: any = null;
	let draft: any = null;

	if (locals.user) {
		const user = await db.collection("users").findOne({
			_id: locals.user.id
		} as Record<string, unknown>);
		profile = (user as any)?.company ?? null;

		const draftId = url.searchParams.get("draft");
		if (draftId) {
			const found = await db.collection("drafts").findOne({
				_id: draftId,
				userId: locals.user.id
			} as Record<string, unknown>);
			if (found) {
				draft = {
					id: found._id,
					name: found.name,
					data: found.data
				};
			}
		}
	}

	return {
		profile,
		draft,
		user: locals.user
			? {
					email: locals.user.email,
					name: locals.user.name
				}
			: null
	};
};
