const root = document.documentElement;
const languageButtons = document.querySelectorAll("[data-language]");
const localizedText = document.querySelectorAll("[data-en][data-ko]:not(meta)");
const localizedLabels = Array.from(document.querySelectorAll("[data-label-ko]"), (element) => ({
  element,
  english: element.getAttribute("aria-label"),
}));
const localizedImages = Array.from(document.querySelectorAll("img[data-alt-ko]"), (element) => ({
  element,
  english: element.alt,
}));
const description = document.querySelector('meta[name="description"]');
const menuButton = document.querySelector(".menu-button");
const navigation = document.querySelector(".primary-nav");
const mobile = window.matchMedia("(max-width: 760px)");
const menuLabels = {
  en: { open: "Close navigation", closed: "Open navigation" },
  ko: { open: "메뉴 닫기", closed: "메뉴 열기" },
};

function menuIsOpen() {
  return menuButton.getAttribute("aria-expanded") === "true";
}

function updateMenuLabel() {
  menuButton.setAttribute("aria-label", menuLabels[root.lang][menuIsOpen() ? "open" : "closed"]);
}

function setMenu(open) {
  menuButton.setAttribute("aria-expanded", String(open));
  navigation.classList.toggle("is-open", open);
  updateMenuLabel();
}

function setLanguage(language) {
  root.lang = language;
  const korean = language === "ko";

  localizedText.forEach((element) => {
    element.textContent = element.dataset[language];
  });
  localizedLabels.forEach(({ element, english }) => {
    element.setAttribute("aria-label", korean ? element.dataset.labelKo : english);
  });
  localizedImages.forEach(({ element, english }) => {
    element.alt = korean ? element.dataset.altKo : english;
  });
  languageButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.language === language));
  });
  document.title = korean ? root.dataset.pageTitleKo : root.dataset.pageTitleEn;
  description.content = description.dataset[language];
  updateMenuLabel();
}

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const language = button.dataset.language;
    setLanguage(language);
    try {
      localStorage.setItem("redon-language", language);
    } catch {
      // Visitors can still switch languages when storage is blocked.
    }
  });
});

menuButton.addEventListener("click", () => {
  const open = !menuIsOpen();
  setMenu(open);
  if (open) navigation.querySelector("a").focus();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuIsOpen()) {
    setMenu(false);
    menuButton.focus();
  }
});

document.addEventListener("pointerdown", (event) => {
  if (menuIsOpen() && !event.target.closest(".site-header")) setMenu(false);
});

document.querySelector(".site-header").addEventListener("focusout", (event) => {
  if (menuIsOpen() && event.relatedTarget && !event.currentTarget.contains(event.relatedTarget)) {
    setMenu(false);
  }
});

mobile.addEventListener("change", () => setMenu(false));

let preferredLanguage = "en";
try {
  if (localStorage.getItem("redon-language") === "ko") preferredLanguage = "ko";
} catch {
  // English is the default.
}

setLanguage(preferredLanguage);
root.classList.add("has-js");
