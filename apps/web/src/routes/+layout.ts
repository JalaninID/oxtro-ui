import { browser } from "$app/environment";
import { redirect } from "@sveltejs/kit";
import { setupClient } from "$lib/api";
import { loadAuthSession } from "$lib/auth/session";

const PUBLIC_ROUTES = new Set([
	"/setup",
	"/login",
	"/register",
	"/forgot-password",
	"/reset-password",
	"/verify-email"
]);

export const ssr = false;

export async function load({ url }: { url: URL }) {
	if (!browser) {
		return {};
	}

	let setupCompleted = true;
	try {
		const setupStatus = await setupClient.getStatus({});
		setupCompleted = setupStatus.isCompleted;
	} catch {
		// If setup status cannot be fetched, allow route fallback behavior below.
	}
	if (!setupCompleted && url.pathname !== "/setup") {
		throw redirect(307, "/setup");
	}
	if (setupCompleted && url.pathname === "/setup") {
		throw redirect(307, "/login");
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
