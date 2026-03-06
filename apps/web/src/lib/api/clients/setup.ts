import { createClient, type Client, type Transport } from "@connectrpc/connect";
import { Setup } from "@oxtro-ui/proto/gen/setup/v1/setup_pb";
import { createApiTransport } from "../transport";

export type SetupClient = Client<typeof Setup>;

const setupTransport = createApiTransport();

export function createSetupClient(transport: Transport = setupTransport): SetupClient {
	return createClient(Setup, transport);
}

export const setupClient = createSetupClient();
