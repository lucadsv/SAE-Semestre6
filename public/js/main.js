document.addEventListener('DOMContentLoaded', () => {
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

    const leftBtn = document.querySelector('.carousel-btn.left');
    const rightBtn = document.querySelector('.carousel-btn.right');
    const track = document.querySelector('.carousel-track');

    if (leftBtn && rightBtn && track) {
        const videos = Array.from(track.children);
        if (videos.length >= 3) {
            videos.forEach((video) => {
                video.muted = true;
                const playPromise = video.play();
                if (playPromise && typeof playPromise.catch === 'function') {
                    playPromise.catch(() => {});
                }
            });

            let order = [0, 1, 2];

            const updateCarousel = () => {
                videos.forEach((v) => v.classList.remove('left', 'center', 'right'));
                videos[order[0]].classList.add('left');
                videos[order[1]].classList.add('center');
                videos[order[2]].classList.add('right');
                track.style.justifyContent = 'center';
            };

            leftBtn.addEventListener('click', () => {
                order.unshift(order.pop());
                updateCarousel();
            });

            rightBtn.addEventListener('click', () => {
                order.push(order.shift());
                updateCarousel();
            });

            updateCarousel();
        }
    }
});

function toggleMenu() {
    const menu = document.getElementById('menu-deroulant');
    if (!menu) {
        return;
    }
    menu.classList.toggle('active');
}

window.addEventListener('click', (e) => {
    const menu = document.getElementById('menu-deroulant');
    const burger = document.querySelector('.menu-burger');
    if (!menu || !burger) {
        return;
    }

    if (!menu.contains(e.target) && !burger.contains(e.target)) {
        menu.classList.remove('active');
    }
});
