<script lang="ts">
	import { ConnectError } from "@connectrpc/connect";
	import { authClient } from "$lib/api";
	import { clearAuthSession } from "$lib/auth/session";

	let oldPassword = $state("");
	let newPassword = $state("");
	let isSubmitting = $state(false);
	let message = $state("");
	let errorMessage = $state("");

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		isSubmitting = true;
		message = "";
		errorMessage = "";
		try {
			const response = await authClient.changePassword({ oldPassword, newPassword });
			message = `${response.message}. Silakan login ulang.`;
			clearAuthSession();
		} catch (error) {
			if (error instanceof ConnectError) {
				errorMessage = error.rawMessage || "Change password failed";
			} else {
				errorMessage = "Unexpected error";
			}
		} finally {
			isSubmitting = false;
		}
	}
</script>

<section class="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 p-6">
	<h1 class="text-2xl font-semibold">Change Password</h1>
	<form class="flex flex-col gap-3" onsubmit={handleSubmit}>
		<input
			class="rounded-md border px-3 py-2"
			type="password"
			placeholder="Password lama"
			bind:value={oldPassword}
			required
		/>
		<input
			class="rounded-md border px-3 py-2"
			type="password"
			placeholder="Password baru"
			bind:value={newPassword}
			required
		/>
		<button class="rounded-md border px-3 py-2" type="submit" disabled={isSubmitting}>
			{isSubmitting ? "Loading..." : "Change Password"}
		</button>
	</form>
	{#if message}
		<p class="text-sm text-green-600">{message}</p>
	{/if}
	{#if errorMessage}
		<p class="text-destructive text-sm">{errorMessage}</p>
	{/if}
</section>
