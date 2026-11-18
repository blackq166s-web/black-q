# Black Q — Projects & Play

Personal portfolio for black-q.com. The deployed static website is in `site/`.

## Preview locally

```sh
python -m http.server 4173 --bind 127.0.0.1 --directory site
```

Edit project cards in `site/content/projects.json`. Keep page dependencies and images inside `site/`. This website requires no runtime secrets or database.

## Deployment

Vercel reads `vercel.json`: framework Other, no dependency installation or build step, output directory `site`. A non-production Git branch creates a preview; the production branch is `main`.

`PORTFOLIO_MANIFEST.json` records the runtime file hashes at this publication. Refresh it when updating runtime files.

The former Next.js application is retained in the repository for reference and rollback. It is outside the selected static output and is not served by the current deployment configuration. Its previous production commit is `21eb12504054e18c4a903d0332b7747e8573df5c`.

## Project pages and domains

Keep the personal hub at `black-q.com`. Add ordinary static project pages under `site/projects/<slug>/`, with their own `index.html` and dependencies. Keep project assets scoped to their own folders and preserve them when updating the hub.

Projects needing independent releases or backend services can be deployed separately and use a dedicated subdomain such as `ai.black-q.com`. Add individual DNS records only when that project is ready. Keep existing project URLs usable when moving a project.

The present release contains four project cases. The planned nine cards and additional project pages are added as their materials become available.
