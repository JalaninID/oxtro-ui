<script lang="ts">
	import { onMount } from "svelte";
	import { ConnectError } from "@connectrpc/connect";
	import { authClient } from "$lib/api";
	import type { Session } from "@oxtro-ui/proto/gen/auth/v1/auth_pb";

	let sessions = $state<Session[]>([]);
	let isLoading = $state(false);
	let errorMessage = $state("");

	async function fetchSessions() {
		isLoading = true;
		errorMessage = "";
		try {
			const response = await authClient.listSessions({});
			sessions = response.sessions;
		} catch (error) {
			if (error instanceof ConnectError) {
				errorMessage = error.rawMessage || "Failed to load sessions";
			} else {
				errorMessage = "Unexpected error";
			}
		} finally {
			isLoading = false;
		}
	}

	async function revokeSession(sessionId: string) {
		try {
			await authClient.revokeSession({ sessionId });
			await fetchSessions();
		} catch (error) {
			if (error instanceof ConnectError) {
				errorMessage = error.rawMessage || "Failed to revoke session";
			}
		}
	}

	onMount(fetchSessions);
</script>

<section class="mx-auto flex max-w-3xl flex-col gap-4 p-6">
	<h1 class="text-2xl font-semibold">Active Sessions</h1>
	{#if errorMessage}
		<p class="text-destructive text-sm">{errorMessage}</p>
	{/if}
	{#if isLoading}
		<p class="text-sm">Loading sessions...</p>
	{:else}
		{#if sessions.length === 0}
			<p class="text-sm">No active sessions.</p>
		{:else}
			<div class="flex flex-col gap-3">
				{#each sessions as item (item.id)}
					<div class="rounded-md border p-3 text-sm">
						<p><strong>ID:</strong> {item.id}</p>
						<p><strong>Device:</strong> {item.deviceId}</p>
						<p><strong>IP:</strong> {item.ip}</p>
						<p><strong>User Agent:</strong> {item.userAgent}</p>
						<p><strong>Expires:</strong> {item.expiresAt}</p>
						<p><strong>Revoked:</strong> {item.revoked ? "yes" : "no"}</p>
						{#if !item.revoked}
							<button class="mt-2 rounded-md border px-2 py-1" onclick={() => revokeSession(item.id)}>
								Revoke
							</button>
						{/if}
					</div>
				{/each}
			</div>
		{/if}
	{/if}
</section>
