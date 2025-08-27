<script lang="ts">
  import { toggleFavorite } from "$lib/utils/favorites";
  import { supabase } from "$lib/supabaseClient";

  export let data;
  let favPage = 1;
  let ratingsPage = 1;

  const itemsPerPage = 5;

  let lastRemoved: any = null;
  let undoTimeout: any = null;

  async function removeFavorite(fav:any) {
    const { action, location } = await toggleFavorite(data.profile.user_id, {
      id: fav.place_id,
      lat: fav.lat,
      lon: fav.lon,
      tags: { name: fav.name, amenity: fav.category },
    });

    if (action === "removed") {
      data.favorites = data.favorites?.filter(
        (f) => f.place_id !== fav.place_id,
      );

      lastRemoved = location;
      clearTimeout(undoTimeout);
      undoTimeout = setTimeout(() => (lastRemoved = null), 5000);
    }
  }

  async function undoRemove() {
    if (!lastRemoved) return;

    if (!data.profile?.user_id) return; 

    await toggleFavorite(data.profile.user_id, {
      id: lastRemoved.place_id,
      lat: lastRemoved.lat,
      lon: lastRemoved.lon,
      tags: { name: lastRemoved.name, amenity: lastRemoved.category },
    });
    data.favorites = [...(data.favorites || []), lastRemoved];

    lastRemoved = null;
    clearTimeout(undoTimeout);
  }

  $: paginatedFavorites = (data.favorites || []).slice(
    (favPage - 1) * itemsPerPage,
    favPage * itemsPerPage,
  );

  $: paginatedRatings = (data.ratings || []).slice(
    (ratingsPage - 1) * itemsPerPage,
    ratingsPage * itemsPerPage,
  );


  $: totalFavPages = Math.ceil((data.favorites?.length || 0) / itemsPerPage);
  $: totalRatingsPages = Math.ceil((data.ratings?.length || 0) / itemsPerPage);
</script>

<main class="profile-container">
  {#if data.profile}
    <div class="profile-card">
      <img src="/icons/user.png" alt="Profile Picture" class="profile-avatar" />
      <div class="profile-info">
        <p>
          <strong>👤 Name :</strong>
          {data.profile.name}
          {data.profile.surname}
        </p>
        <p><strong>📧 Email:</strong> {data.profile.email}</p>
        <p>
          <strong>📅 Member since:</strong>
          {new Date(data.profile.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>

    {#if paginatedFavorites.length > 0}
      <h3>My Favorite places</h3>
     <ul class="places-list">
      {#each paginatedFavorites as fav}
        <li class="place-item">
          <span class="place-name">{fav.name}</span>
          <button class="remove-btn" on:click={() => removeFavorite(fav)}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
            <path d="M5.5 5.5a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0v-6a.5.5 0 0 1 .5-.5zm2.5.5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0v-6zm3-.5a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0v-6a.5.5 0 0 1 .5-.5z"/>
            <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1-1h-11a1 1 0 0 1-1 1H0v1h16V3h-1.5zm-1 0H2.5v10.5a1.5 1.5 0 0 0 1.5 1.5h7a1.5 1.5 0 0 0 1.5-1.5V3z"/>
          </svg>
          </button>
        </li>
      {/each}
    </ul>
      <div class="pagination">
        <button on:click={() => favPage--} disabled={favPage === 1}>←</button>
        <span>Page {favPage} of {totalFavPages}</span>
        <button on:click={() => favPage++} disabled={favPage === totalFavPages}
          >→</button
        >
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
              {Array(5)
                .fill(0)
                .map((_, i) => (i < rate.rating ? "★" : "☆"))
                .join("")}
            </span>
            <small>({rate.rating}/5)</small>
          </li>
        {/each}
      </ul>
      <div class="pagination">
        <button on:click={() => ratingsPage--} disabled={ratingsPage === 1}
          >←</button
        >
        <span>Page {ratingsPage} of {totalRatingsPages}</span>
        <button
          on:click={() => ratingsPage++}
          disabled={ratingsPage === totalRatingsPages}>→</button
        >
      </div>
    {:else}
      <p class="empty-note">You haven't rated any places yet.</p>
    {/if}
  {:else}
    <p class="no-profile">No profile data found.</p>
  {/if}
</main>

<style>
  @import "/css/profile.css";
</style>
