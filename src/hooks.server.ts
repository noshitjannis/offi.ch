import type { Handle } from "@sveltejs/kit";
import { auth } from "$lib/server/auth";

export const handle: Handle = async ({ event, resolve }) => {
	const sessionId = event.cookies.get(auth.sessionCookieName);

	if (!sessionId) {
		event.locals.auth = auth;
		event.locals.user = null;
		return resolve(event);
	}

	const { session, user } = await auth.validateSession(sessionId);

	if (session && session.fresh) {
		const sessionCookie = auth.createSessionCookie(session.id);
		event.cookies.set(sessionCookie.name, sessionCookie.value, {
			path: "/",
			...sessionCookie.attributes
		});
	}

	if (!session) {
		const blankSessionCookie = auth.createBlankSessionCookie();
		event.cookies.set(blankSessionCookie.name, blankSessionCookie.value, {
			path: "/",
			...blankSessionCookie.attributes
		});
	}

	event.locals.auth = auth;
	event.locals.user = user;
	event.locals.session = session;

	return resolve(event);
};
