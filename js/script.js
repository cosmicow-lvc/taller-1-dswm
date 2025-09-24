async function cambiarFoto() {
    const url = 'https://cataas.com/cat'; // Example API that returns JPG
    const imgElement = document.getElementById('mainImage');
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const blob = await response.blob();
        const objectURL = URL.createObjectURL(blob);
        imgElement.src = objectURL;
    } catch (error) {
        console.error('Error fetching image:', error);
    }
}

// Responsive navbar toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('hidden');
    });
}