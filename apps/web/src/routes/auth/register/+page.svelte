<script lang="ts">
	import { goto } from "$app/navigation";
	import { ConnectError } from "@connectrpc/connect";
	import { Button } from "@oxtro-ui/shadcn/button";
	import * as Card from "@oxtro-ui/shadcn/card";
	import { Input } from "@oxtro-ui/shadcn/input";
	import { Label } from "@oxtro-ui/shadcn/label";
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
			setTimeout(() => goto("/auth/login"), 900);
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

<section class="bg-muted/30 flex min-h-screen items-center px-4 py-10">
	<div class="mx-auto w-full max-w-md">
		<Card.Root>
			<Card.Header>
				<Card.Title>Register</Card.Title>
				<Card.Description>Buat akun baru untuk mulai menggunakan Oxtro.</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-4">
				<form class="space-y-4" onsubmit={handleSubmit}>
					<div class="grid gap-2">
						<Label for="register-username">Username</Label>
						<Input id="register-username" placeholder="username" bind:value={username} required />
					</div>
					<div class="grid gap-2">
						<Label for="register-email">Email</Label>
						<Input id="register-email" type="email" placeholder="name@company.com" bind:value={email} required />
					</div>
					<div class="grid gap-2">
						<Label for="register-password">Password</Label>
						<Input
							id="register-password"
							type="password"
							placeholder="min 8 karakter, huruf besar/kecil, angka"
							bind:value={password}
							required
						/>
					</div>
					<Button class="w-full" type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Memproses..." : "Buat akun"}
					</Button>
				</form>
				{#if message}
					<p class="text-sm text-green-600">{message}</p>
				{/if}
				{#if errorMessage}
					<p class="text-destructive text-sm">{errorMessage}</p>
				{/if}
			</Card.Content>
			<Card.Footer class="text-muted-foreground text-sm">
				Sudah punya akun? <a class="underline" href="/auth/login">Login</a>
			</Card.Footer>
		</Card.Root>
	</div>
</section>
