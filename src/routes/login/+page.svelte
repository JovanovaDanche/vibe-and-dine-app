<script lang="ts">
  export let form;
</script>
<svelte:head>
  <link rel="stylesheet" href="/css/login.css" />
</svelte:head>
<div class="login-container">
  <div class="overlay"></div>
  <div class="login-box">
    <h1>Login</h1>
    <form method="POST">
      <input name="email" type="email" required placeholder="Email" />
      <input name="password" type="password" required placeholder="Password" />
      <button type="submit">Log in</button>
    </form>

    {#if form?.error}
      <p class="error">{form.error}</p>
    {/if}
  </div>
</div>
