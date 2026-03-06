<script lang="ts">
	import { ConnectError } from "@connectrpc/connect";
	import { Button } from "@oxtro-ui/shadcn/button";
	import * as Card from "@oxtro-ui/shadcn/card";
	import { Input } from "@oxtro-ui/shadcn/input";
	import { Label } from "@oxtro-ui/shadcn/label";
	import { authClient } from "$lib/api";

	let token = $state("");
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
			const response = await authClient.resetPassword({
				token: token.trim(),
				newPassword
			});
			message = response.message;
		} catch (error) {
			if (error instanceof ConnectError) {
				errorMessage = error.rawMessage || "Reset failed";
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
				<Card.Title>Reset Password</Card.Title>
				<Card.Description>Masukkan token reset dan password baru Anda.</Card.Description>
			</Card.Header>
			<Card.Content class="space-y-4">
				<form class="space-y-4" onsubmit={handleSubmit}>
					<div class="grid gap-2">
						<Label for="reset-token">Token reset</Label>
						<Input id="reset-token" placeholder="paste token reset" bind:value={token} required />
					</div>
					<div class="grid gap-2">
						<Label for="reset-password">Password baru</Label>
						<Input id="reset-password" type="password" bind:value={newPassword} required />
					</div>
					<Button class="w-full" type="submit" disabled={isSubmitting}>
						{isSubmitting ? "Memproses..." : "Reset password"}
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
