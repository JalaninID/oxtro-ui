import { createClient, type Client, type Transport } from "@connectrpc/connect";
import { createConnectTransport } from "@connectrpc/connect-web";
import { CRM } from "@oxtro-ui/proto/gen/sample_crm/v1/crm_pb";
import { PUBLIC_API_BASE_URL } from "$env/static/public";
import { authInterceptor } from "$lib/auth/interceptor";

const CRM_PLUGIN_BASE_PATH = "/plugins/com.oxtro.crm";
const DEFAULT_API_BASE_URL = "http://localhost:8080";

export type CRMClient = Client<typeof CRM>;

function createCRMTransport(): Transport {
	const baseUrl = `${PUBLIC_API_BASE_URL || DEFAULT_API_BASE_URL}${CRM_PLUGIN_BASE_PATH}`;
	return createConnectTransport({
		baseUrl,
		interceptors: [authInterceptor],
		useBinaryFormat: false
	});
}

export function createCRMClient(transport?: Transport): CRMClient {
	return createClient(CRM, transport ?? createCRMTransport());
}

export const crmClient = createCRMClient();
