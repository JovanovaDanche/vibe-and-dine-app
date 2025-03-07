<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';

    let mapContainer: HTMLDivElement | null = null;
    let map: any; 

    // Пресметка на растојание помеѓу две географски координати
    const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
        const R = 6371; // Радиус на Земјата во км
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; // Растојание во км
    };

    onMount(async () => {
        if (browser && mapContainer) {
            const leaflet = await import('leaflet');
            await import('leaflet/dist/leaflet.css');

            map = leaflet.map(mapContainer).setView([41.9981, 21.4254], 13); // Скопје

            leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' 
            }).addTo(map);

            // Податоци од API
            const locations = [
                { name: "Restaurant A", lat: 41.9981, lon: 21.4254 },
                { name: "Cafe B", lat: 41.9991, lon: 21.4274 },
                { name: "Magic House", lat: 41.9808322, lon: 21.4391686 }
            ];

            // Координати за вашиот центар на мапата (може да ја замените со вистинскиот кориснички координат)
            const centerLat = 41.9981;
            const centerLon = 21.4254;

            // Додавање маркери за локации кои се блиски до централната точка
            locations.forEach((location: any) => {
                const distance = haversineDistance(centerLat, centerLon, location.lat, location.lon);
                
                // Ако растојанието е помало од 1 км (можете да го смените овој услов)
                if (distance < 1) {
                    const marker = leaflet.marker([location.lat, location.lon]);

                    // Креирање линк за пренасочување кон Google Maps
                    const googleMapsLink = `https://www.google.com/maps/search/?q=${encodeURIComponent(location.name)}+${location.lat},${location.lon}`;

                    // Поврзување на линк за Google Maps со маркерот
                    marker.bindPopup(`
                        <div>
                            <h3>${location.name}</h3>
                            <a href="${googleMapsLink}" target="_blank">Види на Google Maps</a>
                        </div>
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
