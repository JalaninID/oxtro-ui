import { browser } from "$app/environment";
import { redirect } from "@sveltejs/kit";
import { loadAuthSession } from "$lib/auth/session";

const PUBLIC_ROUTES = new Set([
	"/login",
	"/register",
	"/forgot-password",
	"/reset-password",
	"/verify-email"
]);

export const ssr = false;

export function load({ url }: { url: URL }) {
	if (!browser) {
		return {};
	}
	const session = loadAuthSession();
	const isPublic = PUBLIC_ROUTES.has(url.pathname);
	if (!session.accessToken && !isPublic) {
		throw redirect(307, "/login");
	}
	if (session.accessToken && isPublic) {
		throw redirect(307, "/");
	}
	return {};
}
