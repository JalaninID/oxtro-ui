<script lang="ts">
	import { goto } from "$app/navigation";
	import { ConnectError } from "@connectrpc/connect";
	import { authClient } from "$lib/api";

	let username = $state("");
	let email = $state("");
	let password = $state("");
	let isSubmitting = $state(false);
	let message = $state("");
	let errorMessage = $state("");

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		isSubmitting = true;
		errorMessage = "";
		message = "";
		try {
			const response = await authClient.register({
				username: username.trim(),
				email: email.trim(),
				password,
				name: username.trim(),
				profile: "",
				premium: false
			});
			message = `Akun ${response.email} dibuat. Cek token verifikasi di log backend.`;
			setTimeout(() => goto("/login"), 900);
		} catch (error) {
			if (error instanceof ConnectError) {
				errorMessage = error.rawMessage || "Register failed";
			} else {
				errorMessage = "Unexpected register error";
			}
		} finally {
			isSubmitting = false;
		}
	}
</script>

<section class="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 p-6">
	<h1 class="text-2xl font-semibold">Register</h1>
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
		<button class="rounded-md border px-3 py-2" type="submit" disabled={isSubmitting}>
			{isSubmitting ? "Loading..." : "Register"}
		</button>
	</form>
	{#if message}
		<p class="text-sm text-green-600">{message}</p>
	{/if}
	{#if errorMessage}
		<p class="text-destructive text-sm">{errorMessage}</p>
	{/if}
	<p class="text-sm">
		Sudah punya akun? <a class="underline" href="/login">Login</a>
	</p>
</section>
