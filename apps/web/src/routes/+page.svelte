<script lang="ts">
	import { ConnectError } from "@connectrpc/connect";
	import { Button } from "@oxtro-ui/shadcn/button";
	import { organizationClient } from "$lib/api";
	import { goto } from "$app/navigation";
	import { clearAuthSession } from "$lib/auth/session";
	import type { ResponseOrganization } from "@oxtro-ui/proto/gen/organization/v1/organization_pb";

	let isLoading = $state(false);
	let errorMessage = $state("");
	let organizations = $state<ResponseOrganization[]>([]);

	async function handleListOrganizations() {
		isLoading = true;
		errorMessage = "";

		try {
			const response = await organizationClient.listOrganization({
				id: 0,
				uuid: "",
				name: "",
				domain: "",
				page: 1,
				perPage: 10
			});

			organizations = response.organizations;
		} catch (error) {
			if (error instanceof ConnectError) {
				errorMessage = `${error.code}: ${error.rawMessage}`;
			} else {
				errorMessage = "Unexpected error while calling ListOrganization.";
			}
		} finally {
			isLoading = false;
		}
	}

	async function handleLogout() {
		clearAuthSession();
		await goto("/login");
	}
</script>

<section class="mx-auto flex max-w-3xl flex-col gap-4 p-6">
	<h1 class="text-2xl font-semibold">Organization RPC Demo</h1>
	<p class="text-muted-foreground text-sm">
		Contoh call ConnectRPC ke endpoint Organization dengan auth bearer token + refresh otomatis.
	</p>
	<div class="flex gap-2">
		<a class="rounded-md border px-3 py-2 text-sm" href="/sessions">Manage Sessions</a>
		<a class="rounded-md border px-3 py-2 text-sm" href="/change-password">Change Password</a>
		<Button variant="outline" onclick={handleLogout}>Logout</Button>
	</div>

	<Button variant="outline" onclick={handleListOrganizations} disabled={isLoading}>
		{isLoading ? "Loading..." : "List Organizations"}
	</Button>

	{#if errorMessage}
		<p class="text-destructive text-sm">{errorMessage}</p>
	{/if}

	{#if organizations.length > 0}
		<div class="rounded-md border p-4">
			<p class="mb-2 text-sm font-medium">Organizations ({organizations.length})</p>
			<pre class="overflow-auto text-xs">{JSON.stringify(organizations, null, 2)}</pre>
		</div>
	{/if}
</section>