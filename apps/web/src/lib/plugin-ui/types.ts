import type { PluginUiManifest, UiAction, UiView } from "@oxtro-ui/proto/gen/plugin/v1/plugin_pb";

export type PluginManifest = PluginUiManifest;
export type PluginView = UiView;
export type PluginAction = UiAction;

export type ResolvedPluginView = {
	manifest: PluginManifest;
	view: PluginView;
	path: string;
};
