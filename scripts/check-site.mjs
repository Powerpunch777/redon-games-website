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
];

for (const file of requiredFiles) {
  await stat(resolve(siteDirectory, file));
}

const index = await readFile(resolve(siteDirectory, "index.html"), "utf8");
const stylesheet = await readFile(resolve(siteDirectory, "styles.css"), "utf8");
const pages = await Promise.all(
  ["studio", "games", "sps", "download", "contact", "privacy", "terms", "security"].map((page) =>
    readFile(resolve(siteDirectory, page, "index.html"), "utf8"),
  ),
);
const allPages = [index, ...pages];
const previewInstallerUrl = "https://github.com/Powerpunch777/SPS-Desktop-Preview/releases/download/v0.4.90-preview.1/SPS-Desktop-Setup-0.4.90.exe";

const checks = [
  ["Redon title", index.includes("<title>Redon Games</title>")],
  ["canonical public domain", index.includes('href="https://redongames.com"')],
  ["generated hero image", index.includes("./assets/redon-hero-keyart.png")],
  ["responsive viewport", index.includes('name="viewport"')],
  ["visible focus style", stylesheet.includes(":focus-visible")],
  ["mobile navigation", index.includes('id="mobile-navigation"')],
  ["language toggle", index.includes('data-language="ko"')],
  ["independent page navigation", index.includes('href="./studio/"') && index.includes('href="./download/"')],
  ["all pages include shared interaction script", pages.every((page) => page.includes("../scripts/site.js"))],
  ["no browser link to SPS server", allPages.every((page) => !page.includes("app.redongames.com"))],
  ["unsigned stable installer stays quarantined", !pages[3].includes("SPS-Desktop-Releases/releases/download/")],
  ["stable download security hold", pages[3].includes("Stable download temporarily paused")],
  ["download page links to the installation-test preview", pages[3].includes(previewInstallerUrl)],
  ["preview build warning", pages[3].includes("does not participate in SPS automatic updates")],
  ["private beta status", index.includes("Private feedback build")],
  ["privacy notice", pages[5].includes("What SPS collects")],
  ["beta terms", pages[6].includes("Private beta access")],
  ["security contact", pages[7].includes("Report a vulnerability")],
  ["no legacy Paperclip product name", !index.toLowerCase().includes("paperclip")],
  ["public SPS overview link", pages[2].includes("https://github.com/Powerpunch777/SPS")],
  ["no private product source link", allPages.every((page) => !page.includes("github.com/Powerpunch777/SPS-Source"))],
];

const failed = checks.filter(([, passed]) => !passed).map(([name]) => name);
if (failed.length > 0) {
  throw new Error(`Redon Games website check failed: ${failed.join(", ")}`);
}

console.log(`Redon Games website check passed (${checks.length} checks).`);
