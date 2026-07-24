const languageButtons = document.querySelectorAll(".language-button");
const localizedElements = document.querySelectorAll("[data-en][data-ko]");
const menuButton = document.querySelector(".menu-button");
const mobileNavigation = document.querySelector(".mobile-navigation");

function setLanguage(language) {
  document.documentElement.lang = language;
  localizedElements.forEach((element) => {
    element.textContent = element.dataset[language];
  });
  languageButtons.forEach((button) => {
    const active = button.dataset.language === language;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  localStorage.setItem("redon-language", language);
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => setLanguage(button.dataset.language));
});

if (menuButton && mobileNavigation) {
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!open));
    mobileNavigation.hidden = open;
  });

  mobileNavigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menuButton.setAttribute("aria-expanded", "false");
      mobileNavigation.hidden = true;
    });
  });
}

const preferredLanguage = localStorage.getItem("redon-language");
if (preferredLanguage === "ko" || preferredLanguage === "en") {
  setLanguage(preferredLanguage);
}
