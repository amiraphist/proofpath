# ProofPath Free Deployment

## GitHub Pages

The free public address is:

```text
https://amiraphist.github.io/proofpath
```

The repository includes `.github/workflows/deploy-pages.yml`. Each push to `main` installs dependencies, runs `pnpm build:classroom`, and deploys the generated `classroom-dist/` artifact to GitHub Pages.

## First activation

The repository owner must allow GitHub Pages deployments from GitHub Actions. Once enabled, the workflow publishes the static classroom edition at the address above. Subsequent pushes to `main` rebuild and redeploy automatically.

## What the free address provides

The Pages address is a free subpath under the GitHub account domain. It serves the standalone ProofPath classroom game without a backend, login, database, payment integration, or custom domain purchase.

## Custom domain later

To use a custom address such as `proofpath.com`, purchase the domain from a registrar in the owner account first. Then add the domain in the GitHub Pages settings and point its DNS records to GitHub Pages. The static build and deployment workflow do not need to change.
