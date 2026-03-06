<script lang="ts">
	import { goto } from "$app/navigation";
	import { ConnectError } from "@connectrpc/connect";
	import { setupClient } from "$lib/api";

	let username = $state("");
	let email = $state("");
	let password = $state("");
	let isSubmitting = $state(false);
	let isLoadingStatus = $state(true);
	let isDBHealthy = $state(false);
	let statusMessage = $state("Checking backend setup status...");
	let errorMessage = $state("");
	let resultMessage = $state("");

	function toConnectMessage(error: unknown, fallback: string): string {
		if (error instanceof ConnectError) {
			return error.rawMessage || fallback;
		}
		return fallback;
	}

	async function loadStatus(): Promise<void> {
		isLoadingStatus = true;
		errorMessage = "";
		try {
			const status = await setupClient.getStatus({});
			if (status.isCompleted) {
				await goto("/login");
				return;
			}
			isDBHealthy = status.dbHealthy;
			statusMessage = status.dbHealthy
				? "Database is healthy. Continue to create the first admin account."
				: "Database health check failed. Please verify backend DB settings first.";
		} catch (error) {
			errorMessage = toConnectMessage(error, "Failed to load setup status.");
		} finally {
			isLoadingStatus = false;
		}
	}

	async function handleSubmit(event: SubmitEvent): Promise<void> {
		event.preventDefault();
		isSubmitting = true;
		errorMessage = "";
		resultMessage = "";

		try {
			const response = await setupClient.runSetup({
				username: username.trim(),
				email: email.trim(),
				password
			});
			resultMessage = response.message || "Setup completed.";
			setTimeout(() => {
				void goto("/login");
			}, 1000);
		} catch (error) {
			errorMessage = toConnectMessage(error, "Failed to complete setup.");
		} finally {
			isSubmitting = false;
		}
	}

	$effect(() => {
		void loadStatus();
	});
</script>

<section class="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 p-6">
	<h1 class="text-2xl font-semibold">Setup Oxtro</h1>
	<p class="text-muted-foreground text-sm">First-run wizard untuk bootstrap aplikasi.</p>

	<div class="rounded-md border p-3 text-sm">
		{#if isLoadingStatus}
			Checking setup status...
		{:else}
			{statusMessage}
		{/if}
	</div>

	<form class="flex flex-col gap-3" onsubmit={handleSubmit}>
		<input class="rounded-md border px-3 py-2" placeholder="Username" bind:value={username} required />
		<input class="rounded-md border px-3 py-2" type="email" placeholder="Email" bind:value={email} required />
		<input
			class="rounded-md border px-3 py-2"
			type="password"
			placeholder="Password (min 8, upper/lower/number)"
			bind:value={password}
			required
		/>
		<button class="rounded-md border px-3 py-2" type="submit" disabled={isSubmitting || isLoadingStatus || !isDBHealthy}>
			{isSubmitting ? "Running setup..." : "Run Setup"}
		</button>
	</form>

	{#if resultMessage}
		<p class="text-sm text-green-600">{resultMessage}</p>
	{/if}
	{#if errorMessage}
		<p class="text-destructive text-sm">{errorMessage}</p>
	{/if}
</section>
