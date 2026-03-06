<script lang="ts">
	import { Button } from "@oxtro-ui/shadcn/button";
	import { goto } from "$app/navigation";
	import { clearAuthSession } from "$lib/auth/session";

	let errorMessage = $state("");

	
	async function handleLogout() {
		clearAuthSession();
		await goto("/login");
	}
</script>

<section class="mx-auto flex max-w-3xl flex-col gap-4 p-6">
	<h1 class="text-2xl font-semibold">Auth RPC Demo</h1>
	<p class="text-muted-foreground text-sm">
		Contoh call ConnectRPC ke endpoint Auth dengan auth bearer token + refresh otomatis.
	</p>
	<div class="flex gap-2">
		<a class="rounded-md border px-3 py-2 text-sm" href="/sessions">Manage Sessions</a>
		<a class="rounded-md border px-3 py-2 text-sm" href="/change-password">Change Password</a>
		<a class="rounded-md border px-3 py-2 text-sm" href="/app/plugins/crm/contacts">Open CRM Plugin UI</a>
		<Button variant="outline" onclick={handleLogout}>Logout</Button>
	</div>

	
	{#if errorMessage}
		<p class="text-destructive text-sm">{errorMessage}</p>
	{/if}

	
</section>