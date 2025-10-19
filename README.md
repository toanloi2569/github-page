# Hugo Starter – LoveIt Theme

A Hugo starter configured with the [LoveIt](https://github.com/dillonzq/LoveIt) theme, syntax highlighting, and a GitHub Pages deployment workflow.

## Key features
- Hugo (extended) configuration with the LoveIt theme imported as a Hugo Module.
- Ready-to-use profile homepage, tags listing, and reading-time toggle powered by LoveIt's configuration options.
- Markdown-first content (shortcodes friendly) living inside `content/posts`, including a custom `alert` shortcode.
- GitHub Actions workflow that builds and deploys to `gh-pages`.

## Folder structure
```
.
├── archetypes/        # Default front matter for new posts
├── assets/            # Assets for Hugo pipelines (override LoveIt if needed)
├── content/           # Markdown pages and posts
├── layouts/           # Custom shortcodes/overrides (LoveIt handles the base layouts)
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

3. (Lần đầu) tải LoveIt module:
   ```bash
   hugo mod get github.com/dillonzq/LoveIt
   ```
   hoặc
   ```bash
   hugo mod tidy
   ```

4. Create a new post:
   ```bash
   hugo new posts/post-name.md
   ```
   - Write content under `content/posts`.
   - Add code blocks with triple backticks.
   - Use the shortcode `{{< alert type="warning" >}}...{{< /alert >}}` for callouts.
   - Add `featuredImage` / `featuredImagePreview` in the front matter for LoveIt cover art.

## Build & deploy to GitHub Pages
1. Enable GitHub Pages for the repository and choose “GitHub Actions” as the source.
2. Push to the `main` branch; the `Deploy Hugo site to GitHub Pages` workflow will:
   - Install Hugo extended.
   - Build the site (output in `public/`).
   - Upload the artifact and deploy to `gh-pages`.
3. Add a custom domain later by committing `static/CNAME` and configuring DNS.

## Customization
- **Theme config**: edit `hugo.toml` to tweak LoveIt options (profile card, menus, social links, reading time).
- **Styling**: override styles via `assets/` (SCSS/CSS) or place custom partials in `layouts/`.
- **Shortcodes**: drop new ones in `layouts/shortcodes/` (YouTube embeds, code tabs, etc.).
- **Images**: store them in `static/images`. Reference them in front matter with `featuredImage`.

## Suggested next steps
1. Replace profile text, author details, and social links inside `hugo.toml`.
2. Publish more posts and explore LoveIt's built-in taxonomies and widgets.
3. Consider adding additional LoveIt modules (e.g., comments, analytics) by toggling the relevant params.
