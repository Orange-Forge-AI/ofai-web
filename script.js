/* =====================================================================
   Orange Forge AI — site interactions (vanilla JS, no dependencies)
   ---------------------------------------------------------------------
   1. Mobile menu + product dropdown (accessible)
   2. Support product selector
   3. Sticky-header scroll state
   4. Scroll-reveal (IntersectionObserver)
   5. Interactive body-map demo (homepage)
   Every block guards its own selectors so each page only runs what it has.
   ===================================================================== */
(function () {
    "use strict";

    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---- 1. Navigation: mobile menu + dropdowns -------------------- */
    var menuToggle = document.querySelector(".menu-toggle");
    var navMenu = document.querySelector(".nav-menu");
    var navLinks = document.querySelectorAll(".nav-menu a");
    var dropdownItems = document.querySelectorAll(".has-dropdown");
    var supportsHover = window.matchMedia("(hover: hover)").matches;

    function setMenu(open) {
        if (!menuToggle || !navMenu) return;
        menuToggle.classList.toggle("is-open", open);
        navMenu.classList.toggle("is-open", open);
        menuToggle.setAttribute("aria-expanded", String(open));
        if (!open) closeDropdowns();
    }

    function setDropdown(item, open) {
        var toggle = item.querySelector(".dropdown-toggle");
        item.classList.toggle("is-open", open);
        if (toggle) toggle.setAttribute("aria-expanded", String(open));
    }

    function closeDropdowns(except) {
        dropdownItems.forEach(function (item) {
            if (item !== except) setDropdown(item, false);
        });
    }

    dropdownItems.forEach(function (item) {
        var toggle = item.querySelector(".dropdown-toggle");
        var closeTimer = null;
        if (!toggle) return;

        function open() {
            window.clearTimeout(closeTimer);
            closeDropdowns(item);
            setDropdown(item, true);
        }
        function scheduleClose() {
            window.clearTimeout(closeTimer);
            closeTimer = window.setTimeout(function () { setDropdown(item, false); }, 220);
        }

        if (supportsHover) {
            item.addEventListener("pointerenter", open);
            item.addEventListener("pointerleave", scheduleClose);
        }
        toggle.addEventListener("click", function () {
            var willOpen = !item.classList.contains("is-open");
            closeDropdowns(item);
            setDropdown(item, willOpen);
        });
    });

    if (menuToggle && navMenu) {
        menuToggle.addEventListener("click", function () {
            setMenu(!navMenu.classList.contains("is-open"));
        });
    }

    navLinks.forEach(function (link) {
        // close the mobile menu after navigating, but let dropdown toggles open
        if (!link.classList.contains("dropdown-toggle")) {
            link.addEventListener("click", function () { setMenu(false); });
        }
    });

    document.addEventListener("click", function (event) {
        var target = event.target;
        if (menuToggle && navMenu && !navMenu.contains(target) && !menuToggle.contains(target)) {
            setMenu(false);
        }
        var insideDropdown = Array.prototype.some.call(dropdownItems, function (item) {
            return item.contains(target);
        });
        if (!insideDropdown) closeDropdowns();
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") {
            setMenu(false);
            closeDropdowns();
        }
    });

    /* ---- 2. Support product selector ------------------------------ */
    var supportSelect = document.querySelector("[data-support-select]");
    var supportPanels = document.querySelectorAll("[data-support-panel]");

    function showSupportPanel(product) {
        supportPanels.forEach(function (panel) {
            panel.hidden = panel.dataset.supportPanel !== product;
        });
    }

    if (supportSelect && supportPanels.length) {
        showSupportPanel(supportSelect.value);
        supportSelect.addEventListener("change", function () {
            showSupportPanel(supportSelect.value);
        });
    }

    /* ---- 3. Sticky-header scroll state ---------------------------- */
    var header = document.querySelector(".site-header");
    if (header) {
        var onScroll = function () {
            header.classList.toggle("is-scrolled", window.scrollY > 8);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
    }

    /* ---- 4. Scroll-reveal ----------------------------------------- */
    var revealables = document.querySelectorAll("[data-reveal]");
    if (revealables.length) {
        if (prefersReducedMotion || !("IntersectionObserver" in window)) {
            revealables.forEach(function (el) { el.classList.add("is-visible"); });
        } else {
            var observer = new IntersectionObserver(function (entries, obs) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("is-visible");
                        obs.unobserve(entry.target);
                    }
                });
            }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
            revealables.forEach(function (el) { observer.observe(el); });
        }
    }

    /* ---- 5. Interactive body-map demo ----------------------------- */
    var stage = document.querySelector("[data-bodymap]");
    if (stage) {
        var tooltip = stage.querySelector("[data-bodymap-tooltip]");
        var hint = stage.querySelector("[data-bodymap-hint]");
        var countEl = document.querySelector("[data-bodymap-count]");
        var activeMarker = null;
        var placed = stage.querySelectorAll(".bodymap__marker").length;
        if (countEl) countEl.textContent = String(placed);

        function positionTooltip(marker) {
            if (!tooltip) return;
            tooltip.style.left = marker.style.left;
            tooltip.style.top = marker.style.top;
            var title = marker.getAttribute("data-title") || "Mole";
            var meta = marker.getAttribute("data-meta") || "";
            tooltip.querySelector("[data-tt-title]").textContent = title;
            tooltip.querySelector("[data-tt-meta]").textContent = meta;
            tooltip.classList.add("is-visible");
        }

        function hideTooltip() {
            if (tooltip) tooltip.classList.remove("is-visible");
        }

        function activate(marker) {
            if (activeMarker) activeMarker.classList.remove("is-active");
            activeMarker = marker;
            marker.classList.add("is-active");
            positionTooltip(marker);
        }

        function wireMarker(marker) {
            marker.addEventListener("pointerenter", function () { positionTooltip(marker); });
            marker.addEventListener("pointerleave", function () {
                if (marker !== activeMarker) hideTooltip();
                else positionTooltip(activeMarker);
            });
            marker.addEventListener("focus", function () { positionTooltip(marker); });
            marker.addEventListener("blur", function () {
                if (marker !== activeMarker) hideTooltip();
            });
            marker.addEventListener("click", function (e) {
                e.stopPropagation();
                activate(marker);
            });
        }

        stage.querySelectorAll(".bodymap__marker").forEach(wireMarker);

        // Click empty space on the body to "drop" a new mole marker.
        stage.addEventListener("click", function (event) {
            if (event.target.closest(".bodymap__marker")) return;
            var rect = stage.getBoundingClientRect();
            var x = ((event.clientX - rect.left) / rect.width) * 100;
            var y = ((event.clientY - rect.top) / rect.height) * 100;
            // keep markers within the figure's vertical band
            if (y < 12 || y > 92) return;

            var marker = document.createElement("button");
            marker.type = "button";
            marker.className = "bodymap__marker";
            marker.style.left = x.toFixed(1) + "%";
            marker.style.top = y.toFixed(1) + "%";
            placed += 1;
            marker.setAttribute("data-title", "New mole");
            marker.setAttribute("data-meta", "Added just now · 0 entries");
            marker.setAttribute("aria-label", "New mole marker, not yet logged");
            stage.appendChild(marker);
            wireMarker(marker);
            activate(marker);

            if (countEl) countEl.textContent = String(placed);
            if (hint) hint.style.opacity = "0";
        });
    }
})();
