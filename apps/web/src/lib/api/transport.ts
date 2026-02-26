import type { Interceptor, Transport } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { PUBLIC_API_BASE_URL } from "$env/static/public";

const DEFAULT_API_BASE_URL = "http://localhost:8080";

type CreateApiTransportOptions = {
	interceptors?: Interceptor[];
	fetch?: typeof globalThis.fetch;
};

export function createApiTransport(options: CreateApiTransportOptions = {}): Transport {
	return createConnectTransport({
		baseUrl: PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL,
		interceptors: options.interceptors ?? [],
		fetch: options.fetch,
		useBinaryFormat: false,
	});
}

export const apiTransport = createApiTransport();
