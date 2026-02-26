import { createClient, type Client, type Transport } from "@connectrpc/connect";
import { Auth } from "@oxtro-ui/proto/gen/auth/v1/auth_pb";
import { authInterceptor } from "$lib/auth/interceptor";
import { createApiTransport } from "../transport";

export type AuthClient = Client<typeof Auth>;

const authenticatedTransport = createApiTransport({
	interceptors: [authInterceptor]
});

export function createAuthClient(transport: Transport = authenticatedTransport): AuthClient {
	return createClient(Auth, transport);
}

export const authClient = createAuthClient();
