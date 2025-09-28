// Toggle menú responsive
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
if (navToggle && navMenu) { 
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('hidden');
});
}