# REDON Games Website

The bilingual static website for REDON Games, an independent game studio building original game worlds and the tools behind them. The site introduces the studio, its in-development project RG-01, and SPS, an independent AI development workspace in private beta.

## Pages

- `/` — studio identity and featured work
- `/games/` — RG-01, the studio's in-development original game project
- `/sps/` — SPS concepts, architecture, use cases, and private beta status
- `/download/` — stable distribution status and the installation-test preview
- `/studio/` — the studio's purpose and working principles
- `/contact/` — email routes for general questions, collaboration, private testing, and security reports
- `/privacy/`, `/terms/`, `/security/` — public product and security notices

The website uses static HTML, CSS, and JavaScript and is published through GitHub Pages. It does not store SPS accounts, workspace details, project files, or user data. English is the default language; the EN/KO switch keeps the current route and saves the visitor's preference when browser storage is available.

The site uses responsive WebP key art and a cropped SPS Desktop development screenshot showing Host settings. The Studio image uses a separate crop of the same key art. Keep the `/download/` status aligned with the [SPS Desktop release channel](https://github.com/Powerpunch777/SPS-Desktop-Releases/releases) and [installation-preview channel](https://github.com/Powerpunch777/SPS-Desktop-Preview/releases). The current stable download is paused; the preview is for installation and first-launch testing only.

## Editing pages

Each route is a static HTML page. Keep the English text and its Korean counterpart together in the page body with paired `data-en` and `data-ko` attributes. Base styles and design tokens live in `styles.css`, with layouts in `styles/pages.css`.

Update the shared navigation in `scripts/sync-shell.mjs` and run `node scripts/sync-shell.mjs` to regenerate the headers and footers. The site serves the committed HTML directly, including when JavaScript is disabled.

When RG-01 has approved public content for a detail page, use the existing Games artwork and project layout at `/games/rg-01/`. Include the project description, approved media and features, development status, and relevant external links. Register the page in the shell generator, site checker, and sitemap before linking the project card to it.

## Local preview

```powershell
node .\scripts\sync-shell.mjs --check
node .\scripts\check-site.mjs
node .\scripts\preview-site.mjs
```

Open `http://127.0.0.1:4173`. Request `/_shutdown` to stop the preview server.

## Publishing

GitHub Pages deploys from `main` through `.github/workflows/deploy-pages.yml`. The configured custom domain is `redongames.com`. SPS sign-in and workspace access are handled inside the desktop app, not on this public website.
