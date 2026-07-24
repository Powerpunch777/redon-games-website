import { readFile, stat } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const siteDirectory = resolve(scriptDirectory, "..");
const requiredFiles = [
  "index.html",
  "styles.css",
  "robots.txt",
  "sitemap.xml",
  "assets/sps-logo.png",
];

for (const file of requiredFiles) {
  await stat(resolve(siteDirectory, file));
}

const index = await readFile(resolve(siteDirectory, "index.html"), "utf8");
const stylesheet = await readFile(resolve(siteDirectory, "styles.css"), "utf8");

const checks = [
  ["SPS title", index.includes("<title>SPS Desktop | Redon Games</title>")],
  ["canonical public domain", index.includes('href="https://redongames.com"')],
  ["Hub endpoint", index.includes("https://app.redongames.com")],
  ["brand image", index.includes("./assets/sps-logo.png")],
  ["responsive viewport", index.includes('name="viewport"')],
  ["visible focus style", stylesheet.includes(":focus-visible")],
  ["mobile layout", stylesheet.includes("@media (max-width: 620px)")],
  ["no legacy product name", !index.toLowerCase().includes("paperclip")],
  ["no product source link", !index.includes("github.com/Powerpunch777/SPS")],
  ["private beta status", index.includes("PRIVATE DESKTOP BETA")],
];

const failed = checks.filter(([, passed]) => !passed).map(([name]) => name);
if (failed.length > 0) {
  throw new Error(`SPS website check failed: ${failed.join(", ")}`);
}

console.log(`SPS website check passed (${checks.length} checks).`);
