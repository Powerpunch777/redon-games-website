import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const origin = "https://redongames.com";
const pages = ["/", "/studio/", "/games/", "/sps/", "/download/", "/contact/", "/privacy/", "/terms/", "/security/"];
const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");
const pageEntries = await Promise.all(pages.map(async (route) => [
  route,
  await read(`.${route}index.html`),
]));
const source = new Map(pageEntries);
const home = source.get("/");
const sps = source.get("/sps/");
const download = source.get("/download/");
const stylesheet = await read("styles.css");
const sitemap = await read("sitemap.xml");
const previewInstaller = "https://github.com/Powerpunch777/SPS-Desktop-Preview/releases/download/v0.4.90-preview.1/SPS-Desktop-Setup-0.4.90.exe";
const brokenLinks = [];

for (const [route, page] of source) {
  const references = [...page.matchAll(/\b(?:href|src)="([^"]+)"/g)].map(([, value]) => value);
  for (const [, candidates] of page.matchAll(/\bsrcset="([^"]+)"/g)) {
    references.push(...candidates.split(",").map((candidate) => candidate.trim().split(/\s+/)[0]));
  }
  for (const reference of references) {
    const target = new URL(reference, origin + route);
    if (target.origin !== origin) continue;
    const pathname = target.pathname.replace(/index\.html$/, "");
    const targetPage = source.get(pathname);
    if (targetPage) {
      if (target.hash && !targetPage.includes(`id="${decodeURIComponent(target.hash.slice(1))}"`)) {
        brokenLinks.push(`${route} → ${reference}`);
      }
      continue;
    }
    try {
      const file = new URL(`.${pathname}`, root);
      if (!(await stat(fileURLToPath(file))).isFile()) brokenLinks.push(`${route} → ${reference}`);
    } catch {
      brokenLinks.push(`${route} → ${reference}`);
    }
  }
}

const checks = [
  ["homepage brand and project links", home.includes("We Build Worlds.") && home.includes("independent game studio") && home.includes('href="./games/"') && home.includes('href="./sps/"')],
  ["responsive WebP key art", home.includes("redon-hero-900.webp 900w") && home.includes("redon-hero-1500.webp 1500w")],
  ["SPS development screenshot", [home, sps].every((page) => page.includes("sps-desktop-host-settings.webp") && page.includes("data-alt-ko="))],
  ["shared color palette and width", ["1280px", "#0b0f17", "#438bff", "#1b2535"].every((token) => stylesheet.includes(token))],
  ["keyboard focus and reduced motion styles", stylesheet.includes(":focus-visible") && stylesheet.includes("prefers-reduced-motion: reduce")],
  ["canonical, Open Graph, and sitemap routes", pageEntries.every(([route, page]) => (
    page.includes(`rel="canonical" href="${origin}${route}"`) &&
    page.includes(`property="og:url" content="${origin}${route}"`) &&
    sitemap.includes(`<loc>${origin}${route}</loc>`)
  ))],
  ["one primary heading and main landmark per page", pageEntries.every(([, page]) => (
    (page.match(/<h1[\s>]/g) ?? []).length === 1 && (page.match(/<main[\s>]/g) ?? []).length === 1
  ))],
  ["two bilingual controls and one responsive navigation per page", pageEntries.every(([, page]) => (
    (page.match(/data-language="ko"/g) ?? []).length === 2 &&
    (page.match(/id="mobile-navigation"/g) ?? []).length === 1 &&
    page.includes('aria-controls="mobile-navigation"') &&
    page.includes("scripts/site.js")
  ))],
  ["local routes, images, and fragment links resolve", brokenLinks.length === 0],
  ["stable distribution remains paused", download.includes("Stable installers are currently unavailable on this website")],
  ["approved installation-test preview", download.includes(previewInstaller) && download.includes("installation and first-launch testing only") && download.includes("Automatic updates are disabled")],
  ["SPS private beta and workflow availability", sps.includes("Private Beta — Development in Progress") && sps.includes("Available plugins vary by build") && sps.includes("Workflow availability depends")],
  ["no public link to internal SPS services or code", pageEntries.every(([, page]) => !page.includes("app.redongames.com") && !page.includes("github.com/Powerpunch777/SPS-Source"))],
  ["no public Builder or marketplace claim", !/SPS Builder|marketplace/i.test(sps)],
  ["RG-01 development listing", source.get("/games/").includes("RG-01") && source.get("/games/").includes("In Development")],
  ["legal and security notices and reporting route", source.get("/privacy/").includes("What SPS collects") && source.get("/terms/").includes("Private beta access") && source.get("/security/").includes("Report a vulnerability") && source.get("/contact/").includes('href="../security/"')],
];

const failed = checks.filter(([, passed]) => !passed).map(([name]) => name);
if (failed.length) {
  throw new Error(`Redon Games website check failed: ${[...failed, ...brokenLinks].join(", ")}`);
}

console.log(`Redon Games website check passed (${checks.length} checks across ${pages.length} pages).`);
