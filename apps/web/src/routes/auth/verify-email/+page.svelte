<script lang="ts">
	import { ConnectError } from "@connectrpc/connect";
	import { Button } from "@oxtro-ui/shadcn/button";
	import * as Card from "@oxtro-ui/shadcn/card";
	import { Input } from "@oxtro-ui/shadcn/input";
	import { Label } from "@oxtro-ui/shadcn/label";
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

<section class="bg-muted/30 flex min-h-screen items-center px-4 py-10">
	<div class="mx-auto w-full max-w-md">
		<Card.Root>
			<Card.Header>
				<Card.Title>Verify Email</Card.Title>
				<Card.Description>Masukkan token verifikasi dari email/log backend.</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-4">
				<form class="space-y-4" onsubmit={handleSubmit}>
					<div class="grid gap-2">
						<Label for="verify-token">Token verifikasi</Label>
						<Input id="verify-token" placeholder="paste token verifikasi" bind:value={token} required />
					</div>
					<Button class="w-full" type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Memproses..." : "Verifikasi"}
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
