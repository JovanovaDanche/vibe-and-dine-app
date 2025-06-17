<section class="hero">
    <div class="hero-content">
    <h2> Skopje’s Ultimate Eats & Beats </h2>
    <p>
        Savor. Sip. Dance. Repeat. From cozy cafés to buzzing bars,
        gourmet restaurants to electrifying nightclubs, Skopje’s food
        and nightlife scene has it all. Whether you're looking for a laid-back drink,
        a fine dining experience, or an unforgettable night out, this city never sleeps.
    </p>
    <a href="/map" class="explore-btn">Start Exploring</a>
    </div>
</section>
<section class="categories">
  <h3>Discover the Best Spots</h3>
  <div class="category-grid">
    <div class="category-card bg-cafe" on:click={() => startExploring('cafe')}>
      <div class="overlay">
        <h4>Cafes</h4>
      </div>
    </div>
    <div class="category-card bg-pub" on:click={() => startExploring('pub')}>
      <div class="overlay">
        <h4>Pubs</h4>
      </div>
    </div>
    <div class="category-card bg-bar" on:click={() => startExploring('bar')}>
      <div class="overlay">
        <h4>Bars</h4>
      </div>
    </div>
    <div class="category-card bg-restaurant" on:click={() => startExploring('restaurant')}>
      <div class="overlay">
        <h4>Restaurants</h4>
      </div>
    </div>
  </div>
</section>


<script lang="ts">
    function startExploring(category: string) {
        window.location.href = `/map?category=${category}`; 
    }
    export let data;
</script>

<style>
     @import '/css/home.css';
    
</style>