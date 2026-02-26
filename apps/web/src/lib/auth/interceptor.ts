import { Code, ConnectError, type Interceptor } from "@connectrpc/connect";
import { createAuthClient } from "$lib/api/clients/auth";
import { createApiTransport } from "$lib/api/transport";
import { clearAuthSession, loadAuthSession, saveAuthSession } from "./session";

let refreshInFlight: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
	const current = loadAuthSession();
	if (!current.refreshToken) {
		return null;
	}

	if (refreshInFlight) {
		return refreshInFlight;
	}

	refreshInFlight = (async () => {
		try {
			const authClient = createAuthClient(createApiTransport());
			const response = await authClient.refreshToken({
				refreshToken: current.refreshToken,
				deviceId: current.deviceId
			});
			saveAuthSession({
				accessToken: response.accessToken,
				refreshToken: response.refreshToken
			});
			return response.accessToken;
		} catch {
			clearAuthSession();
			return null;
		} finally {
			refreshInFlight = null;
		}
	})();

	return refreshInFlight;
}

export const authInterceptor: Interceptor = (next) => async (req) => {
	const session = loadAuthSession();
	if (session.accessToken) {
		req.header.set("Authorization", `Bearer ${session.accessToken}`);
	}

	try {
		return await next(req);
	} catch (error) {
		const connectError = ConnectError.from(error);
		if (connectError.code !== Code.Unauthenticated) {
			throw error;
		}
		if (req.url.includes("/auth.v1.Auth/")) {
			throw error;
		}

		const newAccessToken = await refreshAccessToken();
		if (!newAccessToken) {
			throw error;
		}

		req.header.set("Authorization", `Bearer ${newAccessToken}`);
		return await next(req);
	}
};
