<script lang="ts">
	import './layout.css';
	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();
</script>

<svelte:head>
	<title>Oxtro UI</title>

	<meta
		name="description"
		content="Oxtro UI web app powered by SvelteKit"
	/>
</svelte:head>

<ModeWatcher defaultMode="dark" />

<main>{@render children()}</main>
