<script lang="ts">
  export let data;

  import { page } from '$app/stores';
  $: currentRoute = $page.url.pathname;
  $: hideLayout = ['/login', '/register','/logout'].includes(currentRoute);

  let dropdownOpen = false;

  function toggleDropdown() {
    dropdownOpen = !dropdownOpen;
  }

  function closeDropdown() {
    dropdownOpen = false;
  }
</script>

<svelte:head>
  <link rel="stylesheet" href="/css/layout.css" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" />
</svelte:head>

{#if !hideLayout}
  <header>
    <div class="left-side">
      <img src="/icons/location.png" alt="Logo" class="logo" />
      <a href="/" class="title">Vibe & Dine Skopje</a>
    </div>

    <div class="profile-wrapper" on:click={toggleDropdown}>
      <span class="menu-icon">☰</span>
      <img class="avatar" src="/icons/user.png" alt="avatar" />

      {#if dropdownOpen}
        <div class="dropdown-menu">
          {#if data.profile}
            <p class="dropdown-email">{data.profile.email}</p>
            <a href="/profile">My Profile</a>
            <a href="/logout">Log Out</a>
          {:else}
            <a href="/login">Log In</a>
          {/if}
        </div>
      {/if}
    </div>
  </header>
{/if}



<div class="layout-wrapper">
  <main class="content">
    <slot></slot>
  </main>

  {#if !hideLayout}
    <footer class="footer">
      <div class="footer-container">
        <div class="footer-logo">
          <img src="/img/logo.png" alt="Vibe & Dine Skopje Logo" />
          <a href="/" class="title_footer">Vibe & Dine Skopje</a>
        </div>
          <p>&copy; {new Date().getFullYear()} Vibe & Dine Skopje. All rights reserved.</p>
      </div>
    </footer>
  {/if}
</div>


<style>
  :global(body) {
    font-family: 'Poppins', sans-serif;
  }
</style>
