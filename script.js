const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-menu a");
const dropdownItems = document.querySelectorAll(".has-dropdown");
const supportSelect = document.querySelector("[data-support-select]");
const supportPanels = document.querySelectorAll("[data-support-panel]");
const supportsHover = window.matchMedia("(hover: hover)").matches;

function setMenu(open) {
    if (!menuToggle || !navMenu) {
        return;
    }

    menuToggle.classList.toggle("is-open", open);
    navMenu.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));

    if (!open) {
        closeDropdowns();
    }
}

function setDropdown(item, open) {
    const toggle = item.querySelector(".dropdown-toggle");

    item.classList.toggle("is-open", open);
    if (toggle) {
        toggle.setAttribute("aria-expanded", String(open));
    }
}

function closeDropdowns(exceptItem = null) {
    dropdownItems.forEach((item) => {
        if (item === exceptItem) {
            return;
        }

        setDropdown(item, false);
    });
}

dropdownItems.forEach((item) => {
    const toggle = item.querySelector(".dropdown-toggle");
    let closeTimer = null;

    if (!toggle) {
        return;
    }

    function openDropdown() {
        window.clearTimeout(closeTimer);
        closeDropdowns(item);
        setDropdown(item, true);
    }

    function scheduleClose() {
        window.clearTimeout(closeTimer);
        closeTimer = window.setTimeout(() => setDropdown(item, false), 220);
    }

    if (supportsHover) {
        item.addEventListener("pointerenter", openDropdown);
        item.addEventListener("pointerleave", scheduleClose);
    }

    toggle.addEventListener("click", () => {
        const willOpen = !item.classList.contains("is-open");
        closeDropdowns(item);
        setDropdown(item, willOpen);
    });
});

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
        setMenu(!navMenu.classList.contains("is-open"));
    });
}

navLinks.forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
});

function showSupportPanel(product) {
    supportPanels.forEach((panel) => {
        panel.hidden = panel.dataset.supportPanel !== product;
    });
}

if (supportSelect && supportPanels.length > 0) {
    showSupportPanel(supportSelect.value);

    supportSelect.addEventListener("change", () => {
        showSupportPanel(supportSelect.value);
    });
}

document.addEventListener("click", (event) => {
    const target = event.target;

    if (menuToggle && navMenu && !navMenu.contains(target) && !menuToggle.contains(target)) {
        setMenu(false);
    }

    if (![...dropdownItems].some((item) => item.contains(target))) {
        closeDropdowns();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        setMenu(false);
        closeDropdowns();
    }
});
