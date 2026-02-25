<script lang="ts">
  let { children } = $props();
</script>

<svelte:head>
  <title>Oxtro UI</title>
  <meta name="description" content="Oxtro UI web app powered by SvelteKit" />
</svelte:head>

<main>
  {@render children()}
</main>

<style>
  :global(body) {
    margin: 0;
    font-family: Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial,
      sans-serif;
    background: #0b1020;
    color: #f1f5f9;
  }

  main {
    min-height: 100vh;
  }
</style>
