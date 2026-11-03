# Static promotional site deployment

The promotional website lives in `site/`. It is separate from the Electron browser app: GitHub Pages and Cloudflare Pages/Workers can serve this static landing page, but they cannot run or host the Electron desktop browser itself.

## GitHub Pages

The workflow at `.github/workflows/deploy-site.yml` publishes the `site/` directory when changes are pushed to `main`. In the repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**. The workflow assumes the default branch is named `main`; change the branch in the workflow if your repository uses a different default branch.

## Cloudflare Pages

Create a Pages project connected to this GitHub repository. Set the build command to empty (or no build command) and the build output directory to `site`. Pages will deploy the landing page from that directory on each push. Configure the custom domain and DNS in the Cloudflare Pages project.

## Cloudflare Workers static assets (alternative)

`wrangler.jsonc` is configured to publish the same `site/` files as static assets from a Worker. From the repository root, run `npx wrangler deploy` after authenticating Wrangler with your Cloudflare account. Use either this Workers route or the Pages custom-domain route for a given hostname; do not point the same hostname at both deployments.

## Local preview

From the repository root, run `python3 -m http.server 8000 --directory site`, then open `http://localhost:8000`.
