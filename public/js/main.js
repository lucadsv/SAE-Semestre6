document.addEventListener('DOMContentLoaded', () => {
    console.log("Script principal chargé");

    // Animation de survol sur les liens du menu
    const navLinks = document.querySelectorAll('nav a');
    navLinks.forEach(link => {
        link.addEventListener('mouseover', () => link.classList.add('active'));
        link.addEventListener('mouseout', () => link.classList.remove('active'));
    });

    // Confirmation lors de la déconnexion
    const logoutLinks = document.querySelectorAll('a[href="/logout"]');
    logoutLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (!confirm("Souhaites-tu vraiment te déconnecter ?")) {
                e.preventDefault();
            }
        });
    });

    // Animation de fade-in sur les pages
    document.body.style.opacity = 0;
    document.body.style.transition = "opacity 0.4s ease-in-out";
    requestAnimationFrame(() => (document.body.style.opacity = 1));
});