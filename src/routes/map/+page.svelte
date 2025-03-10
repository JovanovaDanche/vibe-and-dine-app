<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';

    let mapContainer: HTMLDivElement | null = null;
    let map: any;
    let markers: any[] = [];
    let selectedCategory = "all"; // Избрана категорија за филтер

    // Функција за земање податоци од Overpass API
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

    // Функција за ажурирање на маркерите според филтерот
    const updateMarkers = async (locations: any[]) => {
        const leaflet = await import('leaflet');

        // Отстрани ги сите постоечки маркери
        markers.forEach(marker => map.removeLayer(marker));
        markers = [];

        // Дефинирање на икони за секоја категорија
        const icons: { [key: string]: any } = {
            restaurant: leaflet.icon({ iconUrl: '/icons/restaurant.png', iconSize: [32, 32] }),
            cafe: leaflet.icon({ iconUrl: '/icons/cafe.png', iconSize: [36, 36] }),
            bar: leaflet.icon({ iconUrl: '/icons/bar.png', iconSize: [32, 32] }),
            pub: leaflet.icon({ iconUrl: '/icons/pub.png', iconSize: [32, 32] }),
        };

        // Филтрирање на локации според избраниот тип
        const filteredLocations = locations.filter(location => {
            if (selectedCategory === "all") return true;
            return location.tags.amenity === selectedCategory;
        });

        filteredLocations.forEach((location: any) => {
            if (location.lat && location.lon) {
                // Избор на икона според категоријата
                const category = location.tags.amenity || "restaurant"; // Дефолт за ресторан ако не е дадена категорија
                const icon = icons[category] || icons['restaurant']; // Фалбек на ресторан ако не е најдена икона

                const marker = leaflet.marker([location.lat, location.lon], { icon });

                // Google Maps URL
                const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.tags.name)}&near=${location.lat},${location.lon}&radius=1000`;

                marker.bindPopup(`
                    <strong>${location.tags.name || 'Unnamed Location'}</strong><br>
                    <a href="${googleMapsUrl}" target="_blank">View on Google Maps</a>
                `).addTo(map);

                markers.push(marker);
            }
        });

        console.log("Markers added:", markers.length);
    };

    // Иницијализација на мапата
    onMount(async () => {
        if (browser && mapContainer) {
            const leaflet = await import('leaflet');
            await import('leaflet/dist/leaflet.css');

            map = leaflet.map(mapContainer).setView([41.9981, 21.4254], 13);

            leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' 
            }).addTo(map);

            // Земи ги сите локации и прикажи ги според филтерот
            const locations = await fetchOverpassData();
            await updateMarkers(locations);
        }
    });

    // Чистење на мапата при напуштање на страната
    onDestroy(() => {
        if (map) {
            map.remove();
        }
    });

    // Функција која ќе ја повикаме кога корисникот ќе смени филтер
    const handleFilterChange = async (event: Event) => {
        selectedCategory = (event.target as HTMLSelectElement).value;
        const locations = await fetchOverpassData();
        await updateMarkers(locations);
    };
</script>

<main>
    <!-- Филтер Dropdown -->
    <div class="filter-container">
        <label for="category-filter">Филтрирај по тип:</label>
        <select id="category-filter" on:change={handleFilterChange}>
            <option value="all">Сите</option>
            <option value="restaurant">Ресторани</option>
            <option value="cafe">Кафулиња</option>
            <option value="bar">Барови</option>
            <option value="pub">Пабови</option>
        </select>
    </div>

    <!-- Мапа -->
    <div class="map-container" bind:this={mapContainer}></div>
</main>

<style>
    @import 'leaflet/dist/leaflet.css';

    .filter-container {
        margin-bottom: 10px;
        text-align: center;
    }

    .filter-container select {
        padding: 5px;
        font-size: 16px;
    }

    .map-container {
        width: 100%;
        height: 600px;
    }
</style>
