import { crmClient } from "$lib/api";
import type { DataSource } from "@oxtro-ui/proto/gen/plugin/v1/plugin_pb";
import type { Contact } from "@oxtro-ui/proto/gen/sample_crm/v1/crm_pb";

export type DataSourceResult = {
	rows: Contact[];
	total: number;
};

export async function resolveDataSource(dataSource?: DataSource): Promise<DataSourceResult> {
	if (!dataSource?.rpcMethod) {
		return { rows: [], total: 0 };
	}

	if (dataSource.rpcMethod === "sample_crm.v1.CRM/ListContacts") {
		const response = await crmClient.listContacts({
			uuid: "",
			search: "",
			page: 1,
			perPage: 20
		});
		return {
			rows: response.contacts,
			total: response.total
		};
	}

	return { rows: [], total: 0 };
}
