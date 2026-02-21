document.addEventListener('DOMContentLoaded', () => {

  // ── Inject nav CSS
  const style = document.createElement('style');
  style.textContent = `
    nav { background: rgba(15, 24, 32, 0.95); border-bottom: 1px solid rgba(100, 149, 237, 0.15); padding: 0; position: sticky; top: 0; z-index: 100; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
    nav .nav-inner { display: flex; align-items: center; justify-content: center; flex-wrap: wrap; }
    nav ul { list-style: none; display: flex; justify-content: center; flex-wrap: wrap; gap: 0; margin: 0; padding: 0; }
    nav a { color: #b0bec5; text-decoration: none; font-weight: 400; font-size: 0.9rem; padding: 1.2rem 2rem; display: block; transition: all 0.2s ease; border-right: 1px solid rgba(100, 149, 237, 0.1); font-family: 'Courier New', monospace; letter-spacing: 1px; text-transform: uppercase; }
    nav li:last-child a { border-right: none; }
    nav a:hover { color: #e3f2fd; background: rgba(100, 149, 237, 0.1); }
    .nav-toggle { display: none; background: none; border: 1px solid rgba(100, 149, 237, 0.3); border-radius: 3px; cursor: pointer; padding: 0.6rem 0.8rem; margin: 0.6rem 1rem; flex-direction: column; gap: 5px; }
    .nav-toggle span { display: block; width: 22px; height: 2px; background: #b0bec5; border-radius: 2px; transition: all 0.3s ease; }
    .nav-toggle.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .nav-toggle.open span:nth-child(2) { opacity: 0; }
    .nav-toggle.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
    @media (max-width: 768px) {
      .nav-toggle { display: flex; }
      nav ul { display: none; flex-direction: column; width: 100%; border-top: 1px solid rgba(100, 149, 237, 0.1); }
      nav ul.open { display: flex; }
      nav a { border-right: none; border-bottom: 1px solid rgba(100, 149, 237, 0.08); padding: 1rem 1.5rem; }
      nav li:last-child a { border-bottom: none; }
    }
  `;
  document.head.appendChild(style);

  // ── Build nav HTML
  const nav = document.querySelector('nav');
  if (!nav) return;

  nav.innerHTML = `
    <div class="container nav-inner">
      <button class="nav-toggle" id="navToggle" aria-label="Toggle navigation">
        <span></span><span></span><span></span>
      </button>
      <ul id="navMenu">
        <li><a href="index.html">Home</a></li>
        <li><a href="sharks.html">Sharks</a></li>
        <li><a href="crocs.html">Crocs</a></li>
        <li><a href="hippos.html">Hippos</a></li>
        <li><a href="rays.html">Rays</a></li>
        <li><a href="turtles.html">Turtles</a></li>
        <li><a href="cetaceans.html">Cetaceans</a></li>
        <li><a href="fish.html">Fish</a></li>
        <li><a href="crustaceans.html">Crustaceans</a></li>
      </ul>
    </div>
  `;

  // ── Hamburger toggle
  const toggle = document.getElementById('navToggle');
  const menu = document.getElementById('navMenu');
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('open');
    menu.classList.toggle('open');
  });
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      menu.classList.remove('open');
    });
  });

});