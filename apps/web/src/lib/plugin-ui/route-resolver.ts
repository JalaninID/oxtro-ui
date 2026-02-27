import type { ResolvedPluginView, PluginManifest } from "./types";

function normalizePath(pathname: string): string {
	if (!pathname) {
		return "/";
	}
	return pathname.endsWith("/") && pathname !== "/" ? pathname.slice(0, -1) : pathname;
}

export function resolvePluginView(manifests: PluginManifest[], pathname: string): ResolvedPluginView | null {
	const target = normalizePath(pathname);

	for (const manifest of manifests) {
		for (const view of manifest.views) {
			if (normalizePath(view.routePath) === target) {
				return {
					manifest,
					view,
					path: target
				};
			}
		}
	}

	return null;
}
