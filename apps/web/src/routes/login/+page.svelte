<script lang="ts">
	import { goto } from "$app/navigation";
	import { ConnectError } from "@connectrpc/connect";
	import { authClient } from "$lib/api";
	import { getOrCreateDeviceId, saveAuthSession } from "$lib/auth/session";

	let email = $state("");
	let password = $state("");
	let isSubmitting = $state(false);
	let errorMessage = $state("");

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		isSubmitting = true;
		errorMessage = "";
		try {
			const response = await authClient.login({
				username: email.trim(),
				password,
				deviceId: getOrCreateDeviceId()
			});
			saveAuthSession({
				accessToken: response.accessToken,
				refreshToken: response.refreshToken
			});
			await goto("/");
		} catch (error) {
			if (error instanceof ConnectError) {
				errorMessage = error.rawMessage || "Login failed";
			} else {
				errorMessage = "Unexpected login error";
			}
		} finally {
			isSubmitting = false;
		}
	}
</script>

<section class="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 p-6">
	<h1 class="text-2xl font-semibold">Login</h1>
	<form class="flex flex-col gap-3" onsubmit={handleSubmit}>
		<input
			class="rounded-md border px-3 py-2"
			type="email"
			placeholder="Email"
			bind:value={email}
			required
		/>
		<input
			class="rounded-md border px-3 py-2"
			type="password"
			placeholder="Password"
			bind:value={password}
			required
		/>
		<button class="rounded-md border px-3 py-2" type="submit" disabled={isSubmitting}>
			{isSubmitting ? "Loading..." : "Login"}
		</button>
	</form>
	{#if errorMessage}
		<p class="text-destructive text-sm">{errorMessage}</p>
	{/if}
	<p class="text-sm">
		Belum punya akun? <a class="underline" href="/register">Register</a>
	</p>
	<p class="text-sm">
		Lupa password? <a class="underline" href="/forgot-password">Reset</a>
	</p>
</section>
