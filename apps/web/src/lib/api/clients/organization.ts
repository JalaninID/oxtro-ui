import { createClient, type Client, type Transport } from "@connectrpc/connect";
import { Organization } from "@oxtro-ui/proto/gen/organization/v1/organization_pb";
import { authInterceptor } from "$lib/auth/interceptor";
import { createApiTransport } from "../transport";

export type OrganizationClient = Client<typeof Organization>;

const authenticatedTransport = createApiTransport({
	interceptors: [authInterceptor]
});

export function createOrganizationClient(transport: Transport = authenticatedTransport): OrganizationClient {
	return createClient(Organization, transport);
}

export const organizationClient = createOrganizationClient();
