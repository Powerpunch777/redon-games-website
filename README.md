# Redon Games Website

This public repository contains only the static product website for
`https://redongames.com`. SPS product code, Core runtime, Desktop host code,
credentials, and operational configuration do not belong here.

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
from `app.redongames.com`, the authenticated SPS Hub.
