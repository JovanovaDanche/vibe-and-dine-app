<script lang="ts">
  export let data;
let favPage = 1;
let ratingsPage = 1;

const itemsPerPage = 5;

$: paginatedFavorites = data.favorites.slice((favPage - 1) * itemsPerPage, favPage * itemsPerPage);
$: paginatedRatings = data.ratings.slice((ratingsPage - 1) * itemsPerPage, ratingsPage * itemsPerPage);

$: totalFavPages = Math.ceil(data.favorites.length / itemsPerPage);
$: totalRatingsPages = Math.ceil(data.ratings.length / itemsPerPage);
</script>

<main class="profile-container">
 

  {#if data.profile}
    <div class="profile-card">
      <img src="/icons/user.png" alt="Profile Picture" class="profile-avatar" />
      <div class="profile-info">
        <p><strong>👤 Name :</strong> {data.profile.name}  {data.profile.surname}</p>
        <p><strong>📧 Email:</strong> {data.profile.email}</p>
        <p><strong>📅 Member since:</strong> {new Date(data.profile.created_at).toLocaleDateString()}</p>
      </div>
    </div>

    {#if paginatedFavorites.length > 0}
    <h3>My Favorite places</h3>
    <ul class="places-list">
      {#each paginatedFavorites as fav}
        <li><strong>{fav.name}</strong><br /></li>
      {/each}
    </ul>
    <div class="pagination">
      <button on:click={() => favPage--} disabled={favPage === 1}>←</button>
      <span>Page {favPage} of {totalFavPages}</span>
      <button on:click={() => favPage++} disabled={favPage === totalFavPages}>→</button>
    </div>
    {:else}
      <p class="empty-note">You haven't added any favorite places yet.</p>
    {/if}

    {#if paginatedRatings.length > 0}
    <h3>My Rated places</h3>
    <ul class="places-list">
      {#each paginatedRatings as rate}
        <li>
          <strong>{rate.name}</strong><br />
          <span class="stars">
            {Array(5).fill(0).map((_, i) => i < rate.rating ? '★' : '☆').join('')}
          </span>
          <small>({rate.rating}/5)</small>
        </li>
      {/each}
    </ul>
    <div class="pagination">
      <button on:click={() => ratingsPage--} disabled={ratingsPage === 1}>←</button>
      <span>Page {ratingsPage} of {totalRatingsPages}</span>
      <button on:click={() => ratingsPage++} disabled={ratingsPage === totalRatingsPages}>→</button>
    </div>
  {:else}
    <p class="empty-note">You haven't rated any places yet.</p>
  {/if}



  {:else}
    <p class="no-profile">No profile data found.</p>
  {/if}
</main>

<style>
   @import '/css/profile.css';
</style>
