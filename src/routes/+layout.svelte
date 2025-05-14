<header>
    <img src="/logo.avif" alt="Logo" class="logo" />
    <h1>Vibe & Dine Skopje</h1>
</header>

<nav>
    <ul>
        <li><a href="/">Home</a></li>
        <li><a href="/map">Explore</a></li>
        <li><a href="/profile">Profile</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/contact">Contact</a></li>


    </ul>
</nav>

<main>
    <slot></slot>
</main>

<footer class="footer">
    <div class="footer-container">
        <div class="footer-logo">
            <img src="/logo.avif" alt="Vibe & Dine Skopje Logo">
            <h3>Vibe & Dine Skopje</h3>
        </div>

        <div class="footer-links">
            <a href="/">Home</a>
            <a href="/map">Explore</a>
            <a href="/profile">Profile</a>
            <a href="/about">About</a>
            <a href="/contact">Contact</a>
        </div>

        <div class="footer-socials">
            <a href="#" target="_blank"><img src="/icons/facebook.png" alt="Facebook"></a>
            <a href="#" target="_blank"><img src="/icons/instagram.png" alt="Instagram"></a>
            <a href="#" target="_blank"><img src="/icons/twitter.png" alt="Twitter"></a>
        </div>
    </div>

    <div class="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Vibe & Dine Skopje. All rights reserved.</p>
    </div>
</footer>

<style>
    .footer {
        background-color: #222;
        color: #fff;
        padding: 40px 20px;
        text-align: center;
        margin-top: 40px;
    }

    .footer-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;
    }

    .footer-logo {
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .footer-logo img {
        width: 50px;
        height: auto;
    }

    .footer-logo h3 {
        font-size: 20px;
        font-weight: bold;
    }

    .footer-links {
        display: flex;
        gap: 15px;
    }

    .footer-links a {
        color: #ddd;
        text-decoration: none;
        font-size: 16px;
        transition: color 0.3s ease;
    }

    .footer-links a:hover {
        color: #fff;
    }

    .footer-socials {
        display: flex;
        gap: 10px;
    }

    .footer-socials img {
        width: 35px;
        height: 35px;
        object-fit: contain;
        border-radius: 5px;
        transition: transform 0.3s ease;
    }

    .footer-socials img:hover {
        transform: scale(1.1);
    }

    .footer-bottom {
        margin-top: 15px;
        font-size: 14px;
        color: #aaa;
    }


    header {
        display: flex;
        align-items: center;  /* Align items vertically */
        gap: 30px; /* Add spacing between the logo and title */
        margin:10px;
    }
    .logo {
        width: 75px;  /* Adjust as needed */
        height: auto;   /* Maintain aspect ratio */
    }
    nav {
        background-color: #333; /* Dark gray */
        padding: 10px 0;
        text-align: center;
    }

    nav ul {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        justify-content: center;
        gap: 20px;
    }

    nav li {
        display: inline;
    }

    nav a {
        color: white;
        text-decoration: none;
        font-size: 16px;
        font-weight: bold;
        padding: 10px 15px;
        transition: background 0.3s;
    }

    nav a:hover {
        background-color: #555; /* Slightly lighter gray on hover */
        border-radius: 5px;
    }
</style>