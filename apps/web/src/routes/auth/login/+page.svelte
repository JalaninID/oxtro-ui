<script lang="ts">
	import { goto } from "$app/navigation";
	import { ConnectError } from "@connectrpc/connect";
	import { Button } from "@oxtro-ui/shadcn/button";
	import * as Card from "@oxtro-ui/shadcn/card";
	import { Input } from "@oxtro-ui/shadcn/input";
	import { Label } from "@oxtro-ui/shadcn/label";
	import * as Tabs from "@oxtro-ui/shadcn/tabs";
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

<section class="bg-muted/30 flex min-h-screen items-center px-4 py-10">
	<div class="mx-auto w-full max-w-md">
		<Tabs.Root value="login" class="w-full">
			<Tabs.List class="grid w-full grid-cols-2">
				<Tabs.Trigger value="login">Login</Tabs.Trigger>
				<Tabs.Trigger value="new-user">Pengguna Baru</Tabs.Trigger>
			</Tabs.List>

			<Tabs.Content value="login">
				<Card.Root>
					<Card.Header>
						<Card.Title>Masuk ke Oxtro</Card.Title>
						<Card.Description>Gunakan akun Anda untuk melanjutkan ke dashboard.</Card.Description>
					</Card.Header>
					<Card.Content class="space-y-4">
						<form class="space-y-4" onsubmit={handleSubmit}>
							<div class="grid gap-2">
								<Label for="login-email">Email</Label>
								<Input
									id="login-email"
									type="email"
									placeholder="name@company.com"
									bind:value={email}
									required
								/>
							</div>
							<div class="grid gap-2">
								<div class="flex items-center justify-between">
									<Label for="login-password">Password</Label>
									<a class="text-muted-foreground text-xs underline" href="/auth/forgot-password">
										Lupa password?
									</a>
								</div>
								<Input id="login-password" type="password" bind:value={password} required />
							</div>
							<Button class="w-full" type="submit" disabled={isSubmitting}>
								{isSubmitting ? "Memproses..." : "Login"}
							</Button>
						</form>
						{#if errorMessage}
							<p class="text-destructive text-sm">{errorMessage}</p>
						{/if}
					</Card.Content>
					<Card.Footer class="text-muted-foreground flex-col items-start gap-1 text-sm">
						<p>
							Belum punya akun? <a class="underline" href="/auth/register">Daftar sekarang</a>
						</p>
						<p>
							Sudah verifikasi token? <a class="underline" href="/auth/verify-email">Verifikasi email</a>
						</p>
					</Card.Footer>
				</Card.Root>
			</Tabs.Content>

			<Tabs.Content value="new-user">
				<Card.Root>
					<Card.Header>
						<Card.Title>Buat akun baru</Card.Title>
						<Card.Description>
							Daftar akun baru untuk mengakses fitur plugin, sesi, dan manajemen pengguna.
						</Card.Description>
					</Card.Header>
					<Card.Content class="space-y-3 text-sm">
						<p class="text-muted-foreground">
							Setelah registrasi, Anda akan mendapatkan token verifikasi email dari backend.
						</p>
					</Card.Content>
					<Card.Footer class="flex gap-2">
						<Button href="/auth/register" class="w-full">Ke halaman register</Button>
						<Button href="/auth/login" variant="outline" class="w-full">Kembali login</Button>
					</Card.Footer>
				</Card.Root>
			</Tabs.Content>
		</Tabs.Root>
	</div>
</section>
