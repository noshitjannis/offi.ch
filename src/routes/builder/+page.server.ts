import type { PageServerLoad } from "./$types";
import { getDb } from "$lib/server/mongo";

export const load: PageServerLoad = async ({ locals }) => {
	if (!locals.user) {
		return { profile: null };
	}

	const db = await getDb();
	const user = await db.collection("users").findOne({
		_id: locals.user.id
	} as Record<string, unknown>);

	const profile = (user as any)?.company ?? null;

	return {
		profile,
		user: {
			email: locals.user.email,
			name: locals.user.name
		}
	};
};
