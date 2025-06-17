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
       <div class="name-surname-group">
          <div class="input-half">
            <label for="name">Name</label>
            <input name="name" id="name" placeholder="Your name.." required />
          </div>

          <div class="input-half">
            <label for="surname">Surname</label>
            <input name="surname" id="surname" placeholder="Your surname" required />
          </div>
        </div>

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

