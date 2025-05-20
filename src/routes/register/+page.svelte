<script lang="ts">
  export let form;
</script>

<svelte:head>
  <link rel="stylesheet" href="/css/register.css" />
</svelte:head>

<div class="container">
  <div class="left">
    <div class="overlay"></div>
  </div>

  <div class="right">
    <div class="form-box">
      <h2>Create your account</h2>
      <form method="POST">
        <label for="fullName">Name and surname</label>
        <input name="fullName" id="fullName" placeholder="Name and surname" required />

        <label for="phone">Phone number</label>
        <input name="phone" id="phone" placeholder="Phone number" />

        <label for="email">Email</label>
        <input type="email" name="email" id="email" placeholder="Email" required />

        <label for="password">Password</label>
        <input type="password" name="password" id="password" placeholder="Password" required />

        <button type="submit">Sign in</button>

        {#if form?.error}
          <p class="error">{form.error}</p>
        {/if}
      </form>
    </div>
  </div>
</div>

