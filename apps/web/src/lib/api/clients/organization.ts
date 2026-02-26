import { createClient, type Client, type Transport } from "@connectrpc/connect";
import { Organization } from "@oxtro-ui/proto/gen/organization/v1/organization_pb";
import { apiTransport } from "../transport";

export type OrganizationClient = Client<typeof Organization>;

export function createOrganizationClient(transport: Transport = apiTransport): OrganizationClient {
	return createClient(Organization, transport);
}

export const organizationClient = createOrganizationClient();
