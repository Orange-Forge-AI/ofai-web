const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-menu a");

function setMenu(open) {
    if (!menuToggle || !navMenu) {
        return;
    }

    menuToggle.classList.toggle("is-open", open);
    navMenu.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
}

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
        setMenu(!navMenu.classList.contains("is-open"));
    });
}

navLinks.forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("click", (event) => {
    if (!menuToggle || !navMenu) {
        return;
    }

    const target = event.target;
    if (!navMenu.contains(target) && !menuToggle.contains(target)) {
        setMenu(false);
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        setMenu(false);
    }
});
