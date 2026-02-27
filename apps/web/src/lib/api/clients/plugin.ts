import { createClient, type Client, type Transport } from "@connectrpc/connect";
import { PluginManager } from "@oxtro-ui/proto/gen/plugin/v1/plugin_pb";
import { authInterceptor } from "$lib/auth/interceptor";
import { createApiTransport } from "../transport";

export type PluginClient = Client<typeof PluginManager>;

const authenticatedTransport = createApiTransport({
	interceptors: [authInterceptor]
});

export function createPluginClient(transport: Transport = authenticatedTransport): PluginClient {
	return createClient(PluginManager, transport);
}

export const pluginClient = createPluginClient();
