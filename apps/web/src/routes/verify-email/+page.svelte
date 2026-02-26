<script lang="ts">
	import { ConnectError } from "@connectrpc/connect";
	import { authClient } from "$lib/api";

	let token = $state("");
	let isSubmitting = $state(false);
	let message = $state("");
	let errorMessage = $state("");

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		isSubmitting = true;
		message = "";
		errorMessage = "";
		try {
			const response = await authClient.verifyEmail({ token: token.trim() });
			message = response.message;
		} catch (error) {
			if (error instanceof ConnectError) {
				errorMessage = error.rawMessage || "Verify email failed";
			} else {
				errorMessage = "Unexpected error";
			}
		} finally {
			isSubmitting = false;
		}
	}
</script>

<section class="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 p-6">
	<h1 class="text-2xl font-semibold">Verify Email</h1>
	<form class="flex flex-col gap-3" onsubmit={handleSubmit}>
		<input class="rounded-md border px-3 py-2" placeholder="Token verifikasi" bind:value={token} required />
		<button class="rounded-md border px-3 py-2" type="submit" disabled={isSubmitting}>
			{isSubmitting ? "Loading..." : "Verify"}
		</button>
	</form>
	{#if message}
		<p class="text-sm text-green-600">{message}</p>
	{/if}
	{#if errorMessage}
		<p class="text-destructive text-sm">{errorMessage}</p>
	{/if}
</section>
