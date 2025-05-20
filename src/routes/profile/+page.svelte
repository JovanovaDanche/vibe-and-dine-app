<script lang="ts">
  export let data;
</script>

<main>
  <h1>Профил</h1>

  {#if data.profile}
    <p><strong>Име:</strong> {data.profile.full_name}</p>
    <p><strong>Телефон:</strong> {data.profile.phone}</p>
    <p><strong>Email:</strong> {data.profile.email}</p>
  {:else}
    <p>Не се пронајдени податоци за профилот.</p>
  {/if}
</main>
