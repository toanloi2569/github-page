# Hugo Starter – Personal Blog

A Hugo starter tailored for personal blogging with code highlighting, a lightweight dark mode, and a GitHub Pages deployment workflow.

## Key features
- Hugo (extended) configuration with Markdown tweaks, `dracula` highlighting, line numbers, and automatic TOC.
- Custom layouts: hero, post cards, tag listing, and an `alert` shortcode.
- Dark-mode toggle that remembers the preference in localStorage to avoid flashing.
- Markdown-first content (shortcodes friendly) living inside `content/posts`.
- GitHub Actions workflow that builds and deploys to `gh-pages`.

## Folder structure
```
.
├── archetypes/        # Default front matter for new posts
├── assets/css/        # Primary stylesheet (fingerprinted via Hugo pipeline)
├── content/           # Markdown pages and posts
├── layouts/           # Templates and partials (base, list, single, taxonomy)
├── static/            # Static assets (images, JS)
└── .github/workflows/ # CI for GitHub Pages deployment
```

## Local setup
1. Install Hugo extended: https://gohugo.io/getting-started/installing/
2. Clone the repo and start the dev server:
   ```bash
   hugo server -D
   ```
   - `-D` keeps draft posts visible.
   - The site runs at `http://localhost:1313/` with live reload.

3. Create a new post:
   ```bash
   hugo new posts/post-name.md
   ```
   - Write content under `content/posts`.
   - Add code blocks with triple backticks.
   - Use the shortcode `{{< alert type="warning" >}}...{{< /alert >}}` for callouts.

## Build & deploy to GitHub Pages
1. Enable GitHub Pages for the repository and choose “GitHub Actions” as the source.
2. Push to the `main` branch; the `Deploy Hugo site to GitHub Pages` workflow will:
   - Install Hugo extended.
   - Build the site (output in `public/`).
   - Upload the artifact and deploy to `gh-pages`.
3. Add a custom domain later by committing `static/CNAME` and configuring DNS.

## Customization
- **Styling**: adjust `assets/css/main.css` or introduce SCSS/Tailwind (Hugo extended supports PostCSS).
- **Navigation / profile**: update `hugo.toml` (`[params]`, social links).
- **Shortcodes**: drop new ones in `layouts/shortcodes/` (YouTube embeds, code tabs, etc.).
- **Images**: store them in `static/images`. For a CDN, point the `cover` field to an absolute URL.

## Suggested next steps
1. Replace `author`, `subtitle`, and social links inside `hugo.toml`.
2. Publish more posts, tagging them to explore the `tags/` listing.
3. If you prefer a full theme like PaperMod later, add it as a submodule and switch the `theme` value in the config.
