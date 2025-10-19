---
title: "Getting Started with Hugo"
date: 2024-07-01T10:00:00+07:00
description: "Spin up a personal blog with Hugo, add code highlighting, and ship it to GitHub Pages."
tags: ["hugo", "static-site", "github-pages"]
categories: ["guide"]
featuredImage: "/images/social-card.svg"
featuredImagePreview: "/images/social-card.svg"
draft: false
---

`Hugo` is a static site generator written in Go with blazing fast builds and a clean structure. With just a handful of Markdown files you can launch a complete website. Pair it with the LoveIt theme and you get a polished UI, syntax highlighting, and dark mode without extra work.

{{< alert type="success" >}}
You're looking at a starter that already includes a friendly layout, dark mode, and shortcodes for lively embeds.
{{< /alert >}}

## Create a new post

Posts live inside `content/posts`. Generate a fresh entry with:

```bash
hugo new posts/hugo-tips.md
```

`hugo` creates the default front matter so you can start writing immediately. To render code, wrap the block with triple backticks like this:

```go
package main

import "fmt"

func main() {
    fmt.Println("Hello from Hugo!")
}
```

## Run the local server

While drafting, run:

```bash
hugo server -D
```

The `-D` flag keeps drafts visible. The site appears at `http://localhost:1313/` with live reload for every edit.

## Deploy to GitHub Pages

The repository already ships with a build workflow. Each push to `main` triggers GitHub Actions to compile the static HTML into the `gh-pages` branch. Flip the Pages switch and you're live.

Happy writing!
