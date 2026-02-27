import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { listActivePluginManifests } from "$lib/plugin-ui/manifest-loader";
import { resolvePluginView } from "$lib/plugin-ui/route-resolver";

export const load: PageLoad = async ({ params, url }) => {
	const manifests = await listActivePluginManifests();
	const slugPath = params.slug ? `/${params.slug}` : "";
	const routePath = `/app/plugins/${params.plugin}${slugPath}`;

	const resolved = resolvePluginView(manifests, routePath);
	if (!resolved) {
		throw error(404, "Plugin view not found");
	}

	return {
		manifests,
		routePath,
		manifest: resolved.manifest,
		view: resolved.view,
		pageTitle: resolved.view.id || url.pathname
	};
};
