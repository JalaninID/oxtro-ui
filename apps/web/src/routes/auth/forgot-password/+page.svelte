<script lang="ts">
	import { ConnectError } from "@connectrpc/connect";
	import { Button } from "@oxtro-ui/shadcn/button";
	import * as Card from "@oxtro-ui/shadcn/card";
	import { Input } from "@oxtro-ui/shadcn/input";
	import { Label } from "@oxtro-ui/shadcn/label";
	import { authClient } from "$lib/api";

	let email = $state("");
	let isSubmitting = $state(false);
	let message = $state("");
	let errorMessage = $state("");

	async function handleSubmit(event: SubmitEvent) {
		event.preventDefault();
		isSubmitting = true;
		message = "";
		errorMessage = "";
		try {
			await authClient.forgotPassword({ email: email.trim() });
			message = "Jika email terdaftar, token reset akan muncul di log backend.";
		} catch (error) {
			if (error instanceof ConnectError) {
				errorMessage = error.rawMessage || "Request failed";
			} else {
				errorMessage = "Unexpected error";
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
				<Card.Title>Forgot Password</Card.Title>
				<Card.Description>Masukkan email akun untuk meminta reset password.</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-4">
				<form class="space-y-4" onsubmit={handleSubmit}>
					<div class="grid gap-2">
						<Label for="forgot-email">Email</Label>
						<Input id="forgot-email" type="email" placeholder="name@company.com" bind:value={email} required />
					</div>
					<Button class="w-full" type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Memproses..." : "Kirim request reset"}
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
				Kembali ke <a class="underline" href="/auth/login">login</a>
			</Card.Footer>
		</Card.Root>
	</div>
</section>
