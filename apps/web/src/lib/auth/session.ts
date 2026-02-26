import { browser } from "$app/environment";
import { writable } from "svelte/store";

const ACCESS_TOKEN_KEY = "oxtro.accessToken";
const REFRESH_TOKEN_KEY = "oxtro.refreshToken";
const DEVICE_ID_KEY = "oxtro.deviceId";

export type AuthSession = {
	accessToken: string;
	refreshToken: string;
	deviceId: string;
};

const initialSession: AuthSession = {
	accessToken: "",
	refreshToken: "",
	deviceId: ""
};

export const authSession = writable<AuthSession>(initialSession);

export function getOrCreateDeviceId(): string {
	if (!browser) {
		return "browserless-device";
	}
	const existing = localStorage.getItem(DEVICE_ID_KEY);
	if (existing) {
		return existing;
	}
	const newValue = crypto.randomUUID();
	localStorage.setItem(DEVICE_ID_KEY, newValue);
	return newValue;
}

export function loadAuthSession(): AuthSession {
	if (!browser) {
		return initialSession;
	}
	const session = {
		accessToken: localStorage.getItem(ACCESS_TOKEN_KEY) ?? "",
		refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY) ?? "",
		deviceId: getOrCreateDeviceId()
	};
	authSession.set(session);
	return session;
}

export function saveAuthSession(session: Partial<AuthSession>): AuthSession {
	const current = loadAuthSession();
	const merged = { ...current, ...session };
	if (browser) {
		localStorage.setItem(ACCESS_TOKEN_KEY, merged.accessToken);
		localStorage.setItem(REFRESH_TOKEN_KEY, merged.refreshToken);
		localStorage.setItem(DEVICE_ID_KEY, merged.deviceId || getOrCreateDeviceId());
	}
	authSession.set(merged);
	return merged;
}

export function clearAuthSession(): void {
	if (browser) {
		localStorage.removeItem(ACCESS_TOKEN_KEY);
		localStorage.removeItem(REFRESH_TOKEN_KEY);
	}
	authSession.set({
		accessToken: "",
		refreshToken: "",
		deviceId: getOrCreateDeviceId()
	});
}
