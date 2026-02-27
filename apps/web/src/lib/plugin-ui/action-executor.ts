import { crmClient } from "$lib/api";
import type { PluginAction } from "./types";

export type ExecuteActionInput = {
	action: PluginAction;
	payload: Record<string, string>;
};

export async function executePluginAction(input: ExecuteActionInput): Promise<string> {
	const { action, payload } = input;

	if (action.rpcMethod === "sample_crm.v1.CRM/CreateContact") {
		await crmClient.createContact({
			name: payload.name ?? "",
			email: payload.email ?? "",
			phone: payload.phone ?? "",
			company: payload.company ?? "",
			notes: payload.notes ?? ""
		});
		return action.successToast || "Action completed";
	}

	if (action.rpcMethod === "sample_crm.v1.CRM/DeleteContact") {
		const uuid = payload.uuid ?? "";
		if (uuid) {
			await crmClient.deleteContact({ uuid });
		}
		return action.successToast || "Action completed";
	}

	return "No frontend executor registered for this action";
}
