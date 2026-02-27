import { pluginClient } from "$lib/api";
import type { PluginManifest } from "./types";

export async function listActivePluginManifests(): Promise<PluginManifest[]> {
	const response = await pluginClient.listActivePluginUiManifests({});
	return response.manifests;
}
