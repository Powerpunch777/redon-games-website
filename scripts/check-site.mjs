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
  ["studio", "games", "sps", "download", "contact"].map((page) =>
    readFile(resolve(siteDirectory, page, "index.html"), "utf8"),
  ),
);
const allPages = [index, ...pages];
const installerUrl = "https://github.com/Powerpunch777/SPS-Desktop-Releases/releases/download/v0.4.29/SPS-Desktop-Setup-0.4.29.exe";

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
  ["download page links to SPS Desktop installer", pages[3].includes(installerUrl)],
  ["current SPS Desktop version", pages[3].includes("0.4.29")],
  ["private beta status", index.includes("Private feedback build")],
  ["no legacy Paperclip product name", !index.toLowerCase().includes("paperclip")],
  ["no public product source link", !index.includes("github.com/Powerpunch777/SPS")],
];

const failed = checks.filter(([, passed]) => !passed).map(([name]) => name);
if (failed.length > 0) {
  throw new Error(`Redon Games website check failed: ${failed.join(", ")}`);
}

console.log(`Redon Games website check passed (${checks.length} checks).`);
