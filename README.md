# Redon Games Website

This repository is Redon's bilingual public website. It introduces the studio, its games, and SPS—the local-first Desktop workspace product for teams who want AI capability, durable project context, and control over where work lives.

## Pages

- `/` — Redon Games home
- `/studio/` — studio direction and working principles
- `/games/` — game projects
- `/sps/` — SPS product description, Workspace and plugin model, and feedback access
- `/download/` — approved Desktop release and installation-preview links
- `/contact/` — studio contact and beta access requests
- `/privacy/`, `/terms/`, `/security/` — product notices and security reporting

The site is English-first with a Korean language switch. The SPS page describes the product; it does not host SPS Desktop, user accounts, Host services, Workspace data, or project source code. Keep download status tied to the actual [SPS Desktop release channel](https://github.com/Powerpunch777/SPS-Desktop-Releases/releases) and [Preview channel](https://github.com/Powerpunch777/SPS-Desktop-Preview/releases).

## Local preview

```powershell
node .\scripts\check-site.mjs
node .\scripts\preview-site.mjs
```

Open `http://127.0.0.1:4173`. Request `/_shutdown` to stop the preview server.

## Publishing

GitHub Pages deploys from `main` through `.github/workflows/deploy-pages.yml`. Configure `redongames.com` as the repository's Custom domain and set the corresponding DNS records. Product authentication and Workspace access begin inside the installed Desktop app, not on this static site.
