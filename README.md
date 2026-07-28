# Redon Games Website

This public repository contains the static studio website for
`https://redongames.com`. It introduces Redon Games, its in-development game
work, and SPS as a separate technology product. SPS product code, Core
runtime, Desktop host code, credentials, and operational configuration do not
belong here.

## Site map

- `/` - studio-facing home and current private-beta framing
- `/studio/` - Redon's working principles
- `/games/` - the first in-development game project
- `/sps/` - SPS product overview
- `/download/` - the current SPS Desktop Windows installer and post-install sign-in guidance
- `/contact/` - feedback and beta access contact
- `/privacy/`, `/terms/`, `/security/` - private-beta privacy, use, and security reporting notices

The website is English-first. The EN/KO switch persists the selected language
while a visitor moves between pages.

## Local check

```powershell
node .\scripts\check-site.mjs
node .\scripts\preview-site.mjs
```

Open `http://127.0.0.1:4173`. Request `/_shutdown` to stop the preview.

## Hosting

GitHub Pages deploys from the `main` branch through
`.github/workflows/deploy-pages.yml`. Configure `redongames.com` as the
repository's Custom domain in GitHub Pages settings, then use the GitHub Pages
apex DNS records in Cloudflare. The static site remains deliberately separate
from SPS workspaces. It links to a versioned SPS Desktop release asset;
authentication and workspace access begin only inside the installed app.
