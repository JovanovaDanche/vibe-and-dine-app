<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';

    let mapContainer: HTMLDivElement | null = null;
    let map: any;

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
        const overpassUrl = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

        const response = await fetch(overpassUrl);
        const data = await response.json();

        return data.elements;
    };

    onMount(async () => {
        if (browser && mapContainer) {
            const leaflet = await import('leaflet');
            await import('leaflet/dist/leaflet.css');

            map = leaflet.map(mapContainer).setView([41.9981, 21.4254], 13); 

            leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' 
            }).addTo(map);

            const locations = await fetchOverpassData();

            locations.forEach((location: any) => {
                if (location.lat && location.lon) {
                    const marker = leaflet.marker([location.lat, location.lon]);

                    
                    const googleMapsUrl = `https://www.google.com/maps/search/?q=${encodeURIComponent(location.tags.name)}+${location.lat},${location.lon},+${encodeURIComponent(location.tags.website)}`;

                   
                    marker.bindPopup(`
                        <strong>${location.tags.name || 'Unnamed Location'}</strong><br>
                         <strong>${location.tags.website || 'Unnamed website'}</strong><br>
                         <strong>${location.tags.opening_hours || 'Unknown hours'}</strong><br>
                         <strong>${location.tags.phone || 'Unknown'}</strong><br>
                         <strong>${location.tags.cuisine || 'Unknown'}</strong><br>
                         
                        <a href="${googleMapsUrl}" target="_blank">Види на Google Maps</a>
                    `).addTo(map);
                }
            });
        }
    });

    onDestroy(() => {
        if (map) {
            map.remove();
        }
    });
</script>

<main>
    <div class="map-container" bind:this={mapContainer}></div>
</main>

<style>
    @import 'leaflet/dist/leaflet.css';

    .map-container {
        width: 100%;
        height: 600px;
    }
</style>
