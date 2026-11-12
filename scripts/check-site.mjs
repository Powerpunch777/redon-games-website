import { readFile, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const siteDirectory = resolve(scriptDirectory, "..");
const requiredFiles = [
  "index.html",
  "styles.css",
  "scripts/site.js",
  "studio/index.html",
  "games/index.html",
  "sps/index.html",
  "download/index.html",
  "contact/index.html",
  "privacy/index.html",
  "terms/index.html",
  "security/index.html",
  "robots.txt",
  "sitemap.xml",
  "assets/redon-hero-keyart.png",
  "assets/redon-hero-900.webp",
  "assets/redon-hero-1500.webp",
  "assets/sps-logo.webp",
];

for (const file of requiredFiles) {
  await stat(resolve(siteDirectory, file));
}

const index = await readFile(resolve(siteDirectory, "index.html"), "utf8");
const stylesheet = await readFile(resolve(siteDirectory, "styles.css"), "utf8");
const script = await readFile(resolve(siteDirectory, "scripts/site.js"), "utf8");
const pageNames = ["studio", "games", "sps", "download", "contact", "privacy", "terms", "security"];
const pages = await Promise.all(pageNames.map((page) =>
  readFile(resolve(siteDirectory, page, "index.html"), "utf8"),
));
const pageByName = Object.fromEntries(pageNames.map((name, index) => [name, pages[index]]));
const allPages = [index, ...pages];
const previewInstallerUrl = "https://github.com/Powerpunch777/SPS-Desktop-Preview/releases/download/v0.4.90-preview.1/SPS-Desktop-Setup-0.4.90.exe";
const sourceFiles = ["index.html", ...pageNames.map((page) => `${page}/index.html`)];
const missingLocalTargets = [];
for (const sourceFile of sourceFiles) {
  const source = sourceFile === "index.html" ? index : pageByName[sourceFile.split("/")[0]];
  const sourceDirectory = dirname(resolve(siteDirectory, sourceFile));
  const references = [...source.matchAll(/(?:href|src)="([^"]+)"/g)].map((match) => match[1]);
  for (const reference of references) {
    if (!reference.startsWith("./") && !reference.startsWith("../")) continue;
    const cleanReference = decodeURIComponent(reference.split(/[?#]/, 1)[0]);
    let target = resolve(sourceDirectory, cleanReference);
    try {
      const targetInfo = await stat(target);
      if (targetInfo.isDirectory()) target = resolve(target, "index.html");
      await stat(target);
    } catch {
      missingLocalTargets.push(`${sourceFile} -> ${reference}`);
    }
  }
}

const checks = [
  ["brand message and studio identity", index.includes("We Build Worlds.") && index.includes("Independent game studio")],
  ["canonical home URL", index.includes('href="https://redongames.com/"')],
  ["responsive WebP hero image", index.includes("redon-hero-900.webp") && index.includes("redon-hero-1500.webp")],
  ["content max width and palette", stylesheet.includes("1280px") && stylesheet.includes("#0b0f17") && stylesheet.includes("#438bff")],
  ["visible keyboard focus", stylesheet.includes(":focus-visible")],
  ["mobile navigation and accessible toggle", index.includes('id="mobile-navigation"') && script.includes('event.key === "Escape"')],
  ["reduced motion support", stylesheet.includes("prefers-reduced-motion: reduce")],
  ["language switch and stored preference", index.includes('data-language="ko"') && script.includes('localStorage.setItem("redon-language"')],
  ["language switch in every page header and footer", allPages.every((page) => page.includes('class="footer-locale language-switch"') && (page.match(/data-language="ko"/g) ?? []).length >= 2)],
  ["consistent primary navigation on every page", allPages.every((page) => {
    const navigation = page.match(/<nav class="desktop-nav"[^>]*>(.*?)<\/nav>/s)?.[1] ?? "";
    return navigation.includes('data-en="Games"') && navigation.includes('data-en="SPS"') && navigation.includes('data-en="Studio"') && navigation.includes('data-en="Contact"') && !navigation.includes("Technology") && !navigation.includes("Download");
  })],
  ["main navigation uses SPS, not Technology or Download", index.includes('data-en="SPS"') && !index.includes('data-en="Technology"') && !index.includes('data-en="Download"')],
  ["all existing public routes are present", pageNames.every((name) => pageByName[name].includes("<main") || name === "studio")],
  ["local page and asset links resolve", missingLocalTargets.length === 0],
  ["shared interaction script on each page", pages.every((page) => page.includes("../scripts/site.js"))],
  ["no browser link to the SPS server", allPages.every((page) => !page.includes("app.redongames.com"))],
  ["stable downloads stay paused", pageByName.download.includes("There is no approved stable installer available right now")],
  ["preview points to the approved installation-test build", pageByName.download.includes(previewInstallerUrl)],
  ["preview is clearly testing-only", pageByName.download.includes("installation and first-launch testing only") && pageByName.download.includes("Automatic updates are disabled")],
  ["SPS private-beta status", pageByName.sps.includes("Private Beta — Development in Progress")],
  ["SPS feature scope is qualified", pageByName.sps.includes("Available plugins vary by build") && pageByName.sps.includes("does not promise that every workflow is available")],
  ["no public builder or marketplace claim", !pageByName.sps.includes("SPS Builder") && !pageByName.sps.toLowerCase().includes("marketplace")],
  ["RG-01 only, with no invented game title", pageByName.games.includes("RG-01") && !pageByName.games.includes("Untitled world project")],
  ["legal and security routes retained", pageByName.privacy.includes("What SPS collects") && pageByName.terms.includes("Private beta access") && pageByName.security.includes("Report a vulnerability")],
  ["security reporting route retained", pageByName.contact.includes("../security/")],
  ["no private SPS source link", allPages.every((page) => !page.includes("github.com/Powerpunch777/SPS-Source"))],
];

const failed = checks.filter(([, passed]) => !passed).map(([name]) => name);
if (failed.length > 0) {
  throw new Error(`Redon Games website check failed: ${failed.join(", ")}`);
}

console.log(`Redon Games website check passed (${checks.length} checks).`);
