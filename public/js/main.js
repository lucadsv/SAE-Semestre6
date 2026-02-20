document.addEventListener('DOMContentLoaded', () => {
    // Confirmation lors de la déconnexion
    const logoutLinks = document.querySelectorAll('a[href="/logout"]');
    logoutLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (!confirm("Souhaites-tu vraiment te déconnecter ?")) {
                e.preventDefault();
            }
        });
    });

    const menu = document.getElementById('menu-deroulant');
    const menuToggle = document.getElementById('menu-toggle');
    const closeMenu = () => {
        if (!menu || !menuToggle) {
            return;
        }
        menu.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
    };

    if (menu && menuToggle) {
        menuToggle.addEventListener('click', () => {
            const isOpen = menu.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', String(isOpen));
        });

        window.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
                closeMenu();
            }
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeMenu();
            }
        });
    }

    const confirmForms = document.querySelectorAll('form[data-confirm-message]');
    confirmForms.forEach((form) => {
        form.addEventListener('submit', (e) => {
            const message = form.getAttribute('data-confirm-message');
            if (message && !confirm(message)) {
                e.preventDefault();
            }
        });
    });

    const calcButtons = document.querySelectorAll('.js-calc-action');
    calcButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const message = button.getAttribute('data-alert');
            if (message) {
                alert(message);
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
