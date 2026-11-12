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

Artwork and the SPS logo are provided as responsive WebP assets, with the original PNG artwork retained as a fallback. Keep the `/download/` status aligned with the [SPS Desktop release channel](https://github.com/Powerpunch777/SPS-Desktop-Releases/releases) and [installation-preview channel](https://github.com/Powerpunch777/SPS-Desktop-Preview/releases). The current stable download is paused; the preview is for installation and first-launch testing only.

## Local preview

```powershell
node .\scripts\check-site.mjs
node .\scripts\preview-site.mjs
```

Open `http://127.0.0.1:4173`. Request `/_shutdown` to stop the preview server.

## Publishing

GitHub Pages deploys from `main` through `.github/workflows/deploy-pages.yml`. The configured custom domain is `redongames.com`. SPS sign-in and workspace access are handled inside the desktop app, not on this public website.
