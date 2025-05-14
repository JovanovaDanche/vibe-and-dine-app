<section class="hero">
    <h2>✨ Skopje’s Ultimate Eats & Beats ✨</h2>
    <p>
        Savor. Sip. Dance. Repeat. From cozy cafés to buzzing bars,
        gourmet restaurants to electrifying nightclubs, Skopje’s food
        and nightlife scene has it all. Whether you're looking for a laid-back drink,
        a fine dining experience, or an unforgettable night out, this city never sleeps.
    </p>
    <a href="/map" class="explore-btn">Start Exploring</a>
</section>
<section class="categories">
    <h3>Discover the Best Spots</h3>
    <div class="category-grid">
        <div class="category-card" on:click={() => startExploring('cafe')}>
            <img src="/icons/cafe.png" alt="Cafes">
            <h4>Cafes</h4>
        </div>
        <div class="category-card" on:click={() => startExploring('pub')}>
            <img src="/icons/pub.png" alt="Pubs">
            <h4>Pubs</h4>
        </div>
        <div class="category-card" on:click={() => startExploring('bar')}>
            <img src="/icons/bar.png" alt="Bars">
            <h4>Bars</h4>
        </div>
        <div class="category-card" on:click={() => startExploring('restaurant')}>
            <img src="/icons/restaurant.png" alt="Restaurants">
            <h4>Restaurants</h4>
        </div>
    </div>
</section>
<section class="recommendations">
    <h3>Recommended Places to Visit</h3>

</section>


<script lang="ts">
    function startExploring(category: string) {
        window.location.href = `/map?category=${category}`; // Navigate to the map with category filter
    }
</script>

<style>
    .hero {
        position: relative;
        text-align: center;
        background: url('/img/hero-bg.jpg') no-repeat center center;
        background-size: cover;
        color: white;
        padding: 80px 20px;
        min-height: 400px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .hero::after {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.6); /* Adjust the darkness (0.6 = medium dark) */
        z-index: 0;
    }

    .hero h2 {
        font-size: 28px;
        margin-bottom: 10px;
        position: relative;
        z-index: 1;
    }

    .hero p {
        font-size: 18px;
        color: white;
        max-width: 600px;
        margin: 0 auto 20px;
        position: relative;
        z-index: 1;
    }

    .explore-btn {
        display: inline-block;
        background-color: #333;
        color: white;
        padding: 12px 24px;
        font-size: 18px;
        text-decoration: none;
        border-radius: 5px;
        transition: background 0.3s;
        position: relative;
        z-index: 1;
    }

    .explore-btn:hover {
        background-color: #555;
    }

    .categories {
        text-align: center;
        padding: 60px 20px;
        max-width: 1200px;
        margin: 0 auto;
    }

    .categories h3 {
        font-size: 28px;
        font-weight: bold;
        margin-bottom: 20px;
    }

    .category-grid {
        display: flex;
        justify-content: center;
        gap: 20px;
        flex-wrap: wrap;
    }

    .category-card {
        width: 180px;
        height: 180px;
        padding: 20px;
        background: #333; /* Dark Gray Background */
        border-radius: 12px;
        text-align: center;
        cursor: pointer;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    .category-card img {
        width: 200px;
        height: auto;
        margin-bottom: 10px;
    }

    .category-card h4 {
        font-size: 18px;
        font-weight: 600;
        color: white;
    }

    .category-card:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }


    .category-card img {
        width: 50px;
        height: auto;
    }

</style>