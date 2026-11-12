const languageButtons = document.querySelectorAll(".language-button");
const localizedElements = document.querySelectorAll("[data-en][data-ko]:not(meta)");
const menuButton = document.querySelector(".menu-button");
const mobileNavigation = document.querySelector(".mobile-navigation");

function closeMenu() {
  if (!menuButton || !mobileNavigation) return;
  menuButton.setAttribute("aria-expanded", "false");
  mobileNavigation.hidden = true;
  const language = document.documentElement.lang === "ko" ? "ko" : "en";
  const suffix = language[0].toUpperCase() + language.slice(1);
  menuButton.setAttribute("aria-label", menuButton.dataset[`menuOpen${suffix}`] ?? "Open navigation");
}

function setLanguage(language, { persist = true } = {}) {
  const selectedLanguage = language === "ko" ? "ko" : "en";
  document.documentElement.lang = selectedLanguage;
  localizedElements.forEach((element) => {
    element.textContent = element.dataset[selectedLanguage];
  });
  languageButtons.forEach((button) => {
    const active = button.dataset.language === selectedLanguage;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  const suffix = selectedLanguage[0].toUpperCase() + selectedLanguage.slice(1);
  const title = document.documentElement.dataset[`pageTitle${suffix}`];
  if (title) document.title = title;
  const description = document.querySelector('meta[name="description"]');
  if (description?.dataset[selectedLanguage]) description.content = description.dataset[selectedLanguage];

  if (menuButton) {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    const labelKey = open ? `menuClose${suffix}` : `menuOpen${suffix}`;
    menuButton.setAttribute("aria-label", menuButton.dataset[labelKey] ?? "Open navigation");
  }

  if (persist) {
    try {
      localStorage.setItem("redon-language", selectedLanguage);
    } catch {
      // The selected language still works for this page when storage is unavailable.
    }
  }
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.language));
});

if (menuButton && mobileNavigation) {
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(open));
    mobileNavigation.hidden = !open;
    const language = document.documentElement.lang === "ko" ? "ko" : "en";
    const suffix = language[0].toUpperCase() + language.slice(1);
    const labelKey = open ? `menuClose${suffix}` : `menuOpen${suffix}`;
    menuButton.setAttribute("aria-label", menuButton.dataset[labelKey] ?? "Open navigation");
  });

  mobileNavigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") {
      closeMenu();
      menuButton.focus();
    }
  });

  document.addEventListener("pointerdown", (event) => {
    if (menuButton.getAttribute("aria-expanded") === "true" &&
        !mobileNavigation.contains(event.target) &&
        !menuButton.contains(event.target)) {
      closeMenu();
    }
  });
}

let preferredLanguage = "en";
try {
  const storedLanguage = localStorage.getItem("redon-language");
  if (storedLanguage === "ko" || storedLanguage === "en") preferredLanguage = storedLanguage;
} catch {
  // Use English when the browser blocks local storage.
}
setLanguage(preferredLanguage, { persist: false });
