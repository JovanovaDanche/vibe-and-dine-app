<script lang="ts">
  import { page } from '$app/stores';
  $: currentRoute = $page.url.pathname;
  $: hideLayout = ['/login', '/register'].includes(currentRoute);
</script>

<svelte:head>
  <link rel="stylesheet" href="/css/layout.css" />
</svelte:head>

{#if !hideLayout}
  <header>
    <img src="/img/logo.png" alt="Logo" class="logo" />
    <h1>Vibe & Dine Skopje</h1>
  </header>
{/if}

<main>
  <slot></slot>
</main>

{#if !hideLayout}
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-logo">
        <img src="/img/logo.png" alt="Vibe & Dine Skopje Logo">
        <h3>Vibe & Dine Skopje</h3>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; {new Date().getFullYear()} Vibe & Dine Skopje. All rights reserved.</p>
    </div>
  </footer>
{/if}

<!-- <style>
    @import '/css/layout.css';
</style> -->