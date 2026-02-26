import type { Interceptor, Transport } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { env } from "$env/dynamic/public";


type CreateApiTransportOptions = {
	interceptors?: Interceptor[];
	fetch?: typeof globalThis.fetch;
};

export function createApiTransport(options: CreateApiTransportOptions = {}): Transport {
	return createConnectTransport({
		baseUrl: env.PUBLIC_API_BASE_URL ?? "",
		interceptors: options.interceptors ?? [],
		fetch: options.fetch,
		useBinaryFormat: false,
	});
}

export const apiTransport = createApiTransport();
