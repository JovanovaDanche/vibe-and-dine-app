<svelte:head>
  <link rel="stylesheet" href="/css/map.css" />
</svelte:head>

<script lang="ts">
import { onMount, onDestroy } from 'svelte';
import { browser } from '$app/environment';
import { transliterate } from 'transliteration';
import { getUserLocation } from '$lib/usersLocation';
import type { UserLocation } from '$lib/usersLocation';
import { toggleFavorite } from '$lib/utils/favorites';
import { supabase } from '$lib/supabaseClient';
import { submitRating } from '$lib/utils/ratings';
import Notification from '$lib/notifications.svelte';

export let data;

let mapContainer: HTMLDivElement | null = null;
let map: any;
let markers: any[] = [];
let selectedCategory = "all";
let searchQuery = "";
let userLocation: UserLocation | null = null;
let isNearMeActive = false;
let minRating = 0;

let notification = { message: '', type: 'success', show: false };

function showNotification(msg: string, type: 'success' | 'error' | 'info' = 'success') {
  notification = { message: msg, type, show: true };
  setTimeout(() => { notification = { ...notification, show: false }; }, 3000);
}

if (browser) {
  const urlParams = new URLSearchParams(window.location.search);
  selectedCategory = urlParams.get('category') || "all";
}

async function getAverageRating(placeId: string): Promise<{ average: number; count: number }> {
  const { data, error } = await supabase.from('ratings').select('rating').eq('place_id', placeId);
  if (error || !data || data.length === 0) return { average: 0, count: 0 };
  const count = data.length;
  const total = data.reduce((sum, r) => sum + r.rating, 0); 
  const average = total / count;
  return { average: parseFloat(average.toFixed(1)), count };
}

const fetchOverpassData = async () => {
  const query = `
    [out:json];
    area[name="Скопје"]->.a;
    (
      node["amenity"="restaurant"](area.a);
      node["amenity"="cafe"](area.a);
      node["amenity"="bar"](area.a);
      node["amenity"="pub"](area.a);
    );
    out body;
  `;
  const response = await fetch(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`);
  const data = await response.json();
  return data.elements;
};

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 0.5 - Math.cos(dLat)/2 + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * (1 - Math.cos(dLon))/2;
  return R * 2 * Math.asin(Math.sqrt(a));
}

const updateMarkers = async (locations: any[]) => {
  const leaflet = await import('leaflet');
  markers.forEach(marker => map.removeLayer(marker));
  markers = [];

  const icons: { [key: string]: any } = {
    restaurant: leaflet.icon({ iconUrl: '/icons/restaurant.png', iconSize: [32, 32] }),
    cafe: leaflet.icon({ iconUrl: '/icons/cafe.png', iconSize: [36, 36] }),
    bar: leaflet.icon({ iconUrl: '/icons/bar.png', iconSize: [32, 32] }),
    pub: leaflet.icon({ iconUrl: '/icons/pub.png', iconSize: [32, 32] }),
  };

  const filteredLocations = locations.filter(location => {
    const hasName = location.tags.name && location.tags.name.trim().length > 0;
    if (!hasName) return false;

    const locationNameTranslit = transliterate(location.tags.name.toLowerCase());
    const searchQueryTranslit = transliterate(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === "all" || location.tags.amenity === selectedCategory;
    const matchesSearch = locationNameTranslit.includes(searchQueryTranslit);

    if (isNearMeActive && userLocation) {
      const distance = getDistanceFromLatLonInKm(userLocation.lat, userLocation.lng, location.lat, location.lon);
      if (distance > 1.5) return false;
    }

    return matchesCategory && matchesSearch;
  });

  for (const location of filteredLocations) {
    if (!location.lat || !location.lon) continue;
    const category = location.tags.amenity || 'restaurant';
    const icon = icons[category] || icons['restaurant'];
    const marker = leaflet.marker([location.lat, location.lon], { icon });

    const placeId = location.id || `${location.lat}-${location.lon}`;
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.tags.name)}&near=${location.lat},${location.lon}&radius=1000`;

    const popupContent = document.createElement('div');
    popupContent.innerHTML = `
      <div class="popup-wrapper">
        <div class="popup-header">
          <strong class="popup-title">${location.tags.name}</strong>
          <div class="avg-rating">Average rating: loading...</div>
        </div>
        <a href="${googleMapsUrl}" target="_blank">View on Google Maps</a><br>
        <button class="favorite-btn">♡ Add to Favorites</button><br><br>
        <label class="rate-label">Rate this place:</label>
        <div class="star-rating">
          ${[1,2,3,4,5].map(i => `<span data-value="${i}" class="star">☆</span>`).join('')}
        </div>
        <button class="submit-rating-btn">Submit Rating</button>
      </div>
    `;

    getAverageRating(placeId).then(({ average, count }) => {
      const avgEl = popupContent.querySelector('.avg-rating');
      if (avgEl) {
        const roundedStars = Math.round(average); 
        const stars = '★★★★★☆☆☆☆☆'.slice(5 - roundedStars, 10 - roundedStars);
        avgEl.textContent = `${average} ${stars} (${count})`;
      }
    });

    let selectedRating = 0;
    popupContent.querySelectorAll('.star').forEach(star => {
      star.addEventListener('click', () => {
        selectedRating = Number((star as HTMLElement).dataset.value);
        popupContent.querySelectorAll('.star').forEach((s, i) => { s.textContent = i < selectedRating ? '★' : '☆'; });
      });
    });

    popupContent.querySelector('.favorite-btn')?.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('add-favorite', { detail: location }));
    });

    popupContent.querySelector('.submit-rating-btn')?.addEventListener('click', () => {
      if (!selectedRating || selectedRating < 1 || selectedRating > 5) {
        window.dispatchEvent(new CustomEvent("notify", { detail: { message: "⭐ Please click on a star to rate.", type: "error" } }));
        return;
      }
      window.dispatchEvent(new CustomEvent('rate-location', { detail: { location: { ...location, id: placeId }, rating: selectedRating } }));
    });

    marker.bindPopup(popupContent).addTo(map);
    markers.push(marker);
  }
};

const handleFilterChange = async (event: Event) => {
  selectedCategory = (event.target as HTMLSelectElement).value;
  const url = new URL(window.location.href);
  url.searchParams.set('category', selectedCategory);
  window.history.pushState({}, "", url);
  const locations = await fetchOverpassData();
  await updateMarkers(locations);
};

const handleSearch = async () => {
  const locations = await fetchOverpassData();
  await updateMarkers(locations);
};

const toggleNearMe = async () => {
  isNearMeActive = !isNearMeActive;
  if (isNearMeActive) {
    userLocation = await getUserLocation();
    if (!userLocation) {
      alert("Could not get your location.");
      isNearMeActive = false;
      return;
    }
  }
  const locations = await fetchOverpassData();
  await updateMarkers(locations);
};

const ratingSearch = async () => {
  const locations = await fetchOverpassData();
  const withRatings = await Promise.all(locations.map(async (loc:any) => {
    const placeId = loc.id || `${loc.lat}-${loc.lon}`;
    const { average } = await getAverageRating(placeId);
    return { ...loc, average };
  }));
  const filtered = withRatings.filter(loc => loc.average >= minRating);
  await updateMarkers(filtered);
};

onMount(async () => {
  if (!browser || !mapContainer) return;

  const leaflet = await import('leaflet');
  await import('leaflet/dist/leaflet.css');

  map = leaflet.map(mapContainer).setView([41.9981, 21.4254], 13);
  leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  const locations = await fetchOverpassData();
  await updateMarkers(locations);

  const userProfile = data.profile;

  const notifyHandler = (event: Event) => {
    const e = event as CustomEvent<{ message: string; type: 'success' | 'error' | 'info' }>;
    const { message, type } = e.detail;
    showNotification(message, type);
  };

  const favoriteHandler = (event: Event) => {
    const e = event as CustomEvent<any>;
    if (!userProfile) {
      showNotification('You must be logged in to save favorites.', 'error');
      return;
    }
    toggleFavorite(userProfile.user_id, e.detail)
      .then(() => showNotification('Saved to favorites!', 'success'))
      .catch(err => showNotification('Error: ' + err.message, 'error'));
  };

  const rateHandler = async (event: Event) => {
    const e = event as CustomEvent<{ location: any; rating: number }>;
    if (!userProfile) {
      showNotification('You must be logged in to rate places.', 'error');
      return;
    }
    const { location, rating } = e.detail;
    try {
      await submitRating(userProfile.user_id, location, rating);
      showNotification('Rating submitted!', 'success');
    } catch (err) {
      showNotification('Error submitting rating: ' + (err as Error).message, 'error');
    }
  };

  window.addEventListener('notify', notifyHandler);
  window.addEventListener('add-favorite', favoriteHandler);
  window.addEventListener('rate-location', rateHandler);

  onDestroy(() => {
    if (map) map.remove();
    window.removeEventListener('notify', notifyHandler);
    window.removeEventListener('add-favorite', favoriteHandler);
    window.removeEventListener('rate-location', rateHandler);
  });
});
</script>

<main class="main-layout">
  <Notification message={notification.message} type={notification.type} show={notification.show} />
  <div class="sidebar">
    <div class="filter-container">
      <label for="category-filter">Filter by Type:</label>
      <select id="category-filter" on:change={handleFilterChange} bind:value={selectedCategory}>
        <option value="all">All</option>
        <option value="restaurant">Restaurants</option>
        <option value="cafe">Cafes</option>
        <option value="bar">Bars</option>
        <option value="pub">Pubs</option>
      </select>
    </div>

    <div class="near-me-toggle">
      <label class="switch">
        <input type="checkbox" on:change={toggleNearMe} />
        <span class="slider"></span>
      </label>
      <span>Near Me</span>
    </div>

    <div class="rating-filter">
      <label>Filter by Rating:</label>
      <div class="stars">
        {#each [1,2,3,4,5] as star}
          <span class="star {star <= minRating ? 'active' : ''}" on:click={() => { minRating = star; ratingSearch(); }}>★</span>
        {/each}
        <button class="reset" on:click={() => { minRating = 0; ratingSearch(); }}>Reset</button>
      </div>
    </div>

    <div class="search-container">
      <input type="text" bind:value={searchQuery} placeholder="Search by name..." />
      <button on:click={handleSearch}>Search</button>
    </div>
  </div>

  <div class="map-container" bind:this={mapContainer}></div>
</main>

<style>
  @import 'leaflet/dist/leaflet.css';
</style>
