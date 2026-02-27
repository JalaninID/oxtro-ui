<script lang="ts">
	import { onMount } from "svelte";
	import { ConnectError } from "@connectrpc/connect";
	import PluginNodeRenderer from "$lib/plugin-ui/components/PluginNodeRenderer.svelte";
	import { executePluginAction } from "$lib/plugin-ui/action-executor";
	import { resolveDataSource } from "$lib/plugin-ui/datasource-resolver";
	import type { Contact } from "@oxtro-ui/proto/gen/sample_crm/v1/crm_pb";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();

	let isLoading = $state(false);
	let errorMessage = $state("");
	let successMessage = $state("");
	let rows = $state<Contact[]>([]);
	let total = $state(0);
	let formState = $state({
		name: "",
		email: "",
		phone: "",
		company: "",
		notes: ""
	});

	const createAction = $derived(
		data.manifest.actions.find((item) => item.rpcMethod === "sample_crm.v1.CRM/CreateContact")
	);

	async function loadViewData() {
		isLoading = true;
		errorMessage = "";
		try {
			const result = await resolveDataSource(data.view.dataSource);
			rows = result.rows;
			total = result.total;
		} catch (error) {
			if (error instanceof ConnectError) {
				errorMessage = error.rawMessage || "Failed to load plugin data";
			} else {
				errorMessage = "Unexpected plugin UI error";
			}
		} finally {
			isLoading = false;
		}
	}

	async function handleSubmitForm() {
		if (!createAction) {
			errorMessage = "No create action configured in plugin manifest";
			return;
		}
		errorMessage = "";
		successMessage = "";
		try {
			const message = await executePluginAction({
				action: createAction,
				payload: formState
			});
			successMessage = message;
			formState = {
				name: "",
				email: "",
				phone: "",
				company: "",
				notes: ""
			};
			await loadViewData();
		} catch (error) {
			if (error instanceof ConnectError) {
				errorMessage = error.rawMessage || "Action failed";
			} else {
				errorMessage = "Unexpected error while executing action";
			}
		}
	}

	onMount(loadViewData);
</script>

<section class="mx-auto flex max-w-5xl flex-col gap-4 p-6">
	<h1 class="text-2xl font-semibold">{data.pageTitle}</h1>
	<p class="text-muted-foreground text-sm">
		Plugin: {data.manifest.pluginId} · Route: {data.routePath}
	</p>

	{#if errorMessage}
		<p class="text-destructive text-sm">{errorMessage}</p>
	{/if}
	{#if successMessage}
		<p class="text-sm text-green-500">{successMessage}</p>
	{/if}
	{#if isLoading}
		<p class="text-sm">Loading plugin view...</p>
	{/if}

	{#if data.view.root}
		<PluginNodeRenderer
			node={data.view.root}
			rows={rows}
			total={total}
			formState={formState}
			onSubmitForm={handleSubmitForm}
		/>
	{/if}
</section>
