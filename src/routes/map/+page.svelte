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
import type { PlaceLocation } from '$lib/utils/favorites';
import { submitRating } from '$lib/utils/ratings';
export let data;
let mapContainer: HTMLDivElement | null = null;
let map: any;
let markers: any[] = [];
let selectedCategory = "all";
let searchQuery = "";

let userLocation: UserLocation | null = null;
let isNearMeActive = false;



$: if (browser) {
    const urlParams = new URLSearchParams(window.location.search);
    selectedCategory = urlParams.get('category') || "all";
}

async function getAverageRating(placeId: string): Promise<{ average: number; count: number }> {
  const { data, error } = await supabase
    .from('ratings')
    .select('rating')
    .eq('place_id', placeId);

  if (error || !data || data.length === 0) {
    return { average: 0, count: 0 };
  }

  const count = data.length;
  const total = data.reduce((sum, r) => sum + r.rating, 0); 
  const average = total / count;

  return {
    average: parseFloat(average.toFixed(1)),
    count
  };
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
        const distance = getDistanceFromLatLonInKm(
            userLocation.lat,
            userLocation.lng,
            location.lat,
            location.lon
        );
        if (distance > 1.5) return false;
    }

        return matchesCategory && matchesSearch;
    });
    
    function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        0.5 - Math.cos(dLat) / 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        (1 - Math.cos(dLon)) / 2;
    return R * 2 * Math.asin(Math.sqrt(a));
}


  filteredLocations.forEach(location => {
  if (location.lat && location.lon) {
    const category = location.tags.amenity || "restaurant";
    const icon = icons[category] || icons['restaurant'];
    const marker = leaflet.marker([location.lat, location.lon], { icon });
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.tags.name)}&near=${location.lat},${location.lon}&radius=1000`;

    const placeId = location.id || `${location.lat}-${location.lon}`;

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
        ${[1, 2, 3, 4, 5].map(i => `<span data-value="${i}" class="star">☆</span>`).join('')}
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
    const stars = popupContent.querySelectorAll('.star-rating .star');
    stars.forEach(star => {
      star.addEventListener('click', () => {
        selectedRating = Number((star as HTMLElement).dataset.value);
        stars.forEach((s, i) => {
          s.textContent = i < selectedRating ? '★' : '☆';
        });
      });
    });

 
    popupContent.querySelector('.favorite-btn')?.addEventListener('click', () => {
      window.dispatchEvent(new CustomEvent('add-favorite', { detail: location }));
    });


    popupContent.querySelector('.submit-rating-btn')?.addEventListener('click', () => {
      if (!selectedRating || selectedRating < 1 || selectedRating > 5) {
        alert('Please click on a star to rate.');
        return;
      }

      window.dispatchEvent(new CustomEvent('rate-location', {
        detail: { location: { ...location, id: placeId }, rating: selectedRating }
      }));
    });

    marker.bindPopup(popupContent).addTo(map);
    markers.push(marker);
  }
});

    console.log("Markers updated:", markers.length);
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

let user: any = null;

onMount(() => {
  if (browser && mapContainer) {
    (async () => {
      const leaflet = await import('leaflet');
      await import('leaflet/dist/leaflet.css');

      map = leaflet.map(mapContainer).setView([41.9981, 21.4254], 13);

      leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      const locations = await fetchOverpassData();
      await updateMarkers(locations);


      let userProfile = data.profile;


      window.addEventListener('add-favorite', (event) => {
        if (!userProfile) {
          alert('You must be logged in to save favorites.');
          return;
        }

        const location = (event as CustomEvent).detail;
        toggleFavorite(userProfile.user_id, location)
          .then(() => alert('Saved to favorites!'))
          .catch((err) => alert('Error: ' + err.message));
      });


      window.addEventListener('rate-location', async (event) => {
        if (!userProfile) {
          alert('You must be logged in to rate places.');
          return;
        }

        const { location, rating } = (event as CustomEvent).detail;

        try {
          await submitRating(userProfile.user_id, location, rating);
          alert('Rating submitted!');
        } catch (err) {
          const error = err as Error;
          alert('Error submitting rating: ' + error.message);
        }
      });
    })(); 
  }
});

$: if (browser && map && selectedCategory) {
    fetchOverpassData().then(updateMarkers);
}

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

const rataingSearch = async () => {
    

};



onDestroy(() => {
    if (map) map.remove();
});

</script>

<main class="main-layout">
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

    <div class="search-container">
      <input type="text" bind:value={searchQuery} placeholder="Search by name..." />
      <button on:click={handleSearch}>Search</button>
    </div>
 
  </div>

  <div class="map-container" bind:this={mapContainer}></div>
</main>

<style>
     @import 'leaflet/dist/leaflet.css';
     /* @import '/css/map.css'; */
</style>
