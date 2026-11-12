import { readFile, writeFile } from "node:fs/promises";

const root = new URL("../", import.meta.url);
const routes = ["", "games", "sps", "studio", "contact", "download", "privacy", "terms", "security"];
const navigation = [
  ["games", "Games", "게임"],
  ["sps", "SPS", "SPS"],
  ["studio", "Studio", "스튜디오"],
  ["contact", "Contact", "문의"],
];
const policies = [
  ["privacy", "Privacy", "개인정보"],
  ["terms", "Terms", "이용 조건"],
  ["security", "Security", "보안"],
];
const github = "https://github.com/Powerpunch777/SPS";

function navLinks(items, base, activeRoute) {
  return items.map(([route, en, ko]) => {
    const isParent = activeRoute.startsWith(`${route}/`) || (activeRoute === "download" && route === "sps");
    const current = route === activeRoute ? ' aria-current="page"' : isParent ? ' aria-current="location"' : "";
    return `<a href="${base}${route}/"${current} data-en="${en}" data-ko="${ko}">${en}</a>`;
  }).join("\n          ");
}

function brand(base) {
  return `<a class="brand" href="${base}" aria-label="REDON Games home" data-label-ko="REDON Games 홈">
          <span class="brand-monogram" aria-hidden="true">R</span>
          <span>REDON GAMES</span>
        </a>`;
}

function languages() {
  return `<div class="language-switch" role="group" aria-label="Language selection" data-label-ko="언어 선택">
            <button type="button" class="language-button" data-language="en" lang="en" aria-label="English" aria-pressed="true">EN</button>
            <span aria-hidden="true">/</span>
            <button type="button" class="language-button" data-language="ko" lang="ko" aria-label="한국어" aria-pressed="false">KO</button>
          </div>`;
}

function header(base, route) {
  return `    <a class="skip-link" href="#main" data-en="Skip to content" data-ko="본문으로 건너뛰기">Skip to content</a>
    <header class="site-header${route ? "" : " site-header--overlay"}">
      <div class="header-inner page-width">
        ${brand(base)}
        <nav id="mobile-navigation" class="primary-nav" aria-label="Main navigation" data-label-ko="주 메뉴">
          ${navLinks(navigation, base, route)}
        </nav>
        <div class="header-actions">
          ${languages()}
          <button class="menu-button" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="mobile-navigation">
            <span></span><span></span><span></span>
          </button>
        </div>
      </div>
    </header>`;
}

function footer(base, route) {
  return `    <footer class="site-footer">
      <div class="footer-main page-width">
        ${brand(base)}
        <nav class="footer-nav" aria-label="Site links" data-label-ko="사이트 링크">
          ${navLinks(navigation, base, route)}
        </nav>
        <a class="footer-github text-link" href="${github}" target="_blank" rel="noopener">
          <span data-en="SPS on GitHub" data-ko="GitHub의 SPS">SPS on GitHub</span><span class="external-arrow" aria-hidden="true">↗</span>
        </a>
      </div>
      <div class="footer-bottom page-width">
        <span>© 2026 REDON Games</span>
        <nav class="footer-legal" aria-label="Legal links" data-label-ko="정책 및 보안">
          ${navLinks(policies, base, route)}
        </nav>
        ${languages()}
      </div>
    </footer>
    <script src="${base}scripts/site.js" defer></script>`;
}

for (const route of routes) {
  const file = new URL(route ? `${route}/index.html` : "index.html", root);
  const source = (await readFile(file, "utf8")).replace(/\r\n/g, "\n");
  const start = source.indexOf("    <main");
  const end = source.indexOf("</main>", start) + "</main>".length;
  if (start < 0 || !source.slice(start, end).endsWith("</main>")) throw new Error(`Missing main landmark in ${file.pathname}`);

  const base = route ? "../".repeat(route.split("/").length) : "./";
  const body = source.slice(0, source.indexOf("\n", source.indexOf("<body"))).trimEnd();
  const next = `${body}\n${header(base, route)}\n\n${source.slice(start, end)}\n\n${footer(base, route)}\n  </body>\n</html>\n`;
  if (next === source) continue;
  if (process.argv.includes("--check")) throw new Error(`Shared navigation is out of date in ${file.pathname}. Run node scripts/sync-shell.mjs.`);
  await writeFile(file, next);
}
