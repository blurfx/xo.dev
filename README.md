# Ambienxo

![Ambienxo](https://raw.githubusercontent.com/blurfx/ambienxo/static/thumbnail.png)

Ambienxo is a modern personal blog theme for minimalists built on top of [Next.js](https://nextjs.org/).

## Features

- Minimalist design
- Responsive layout
- SEO-friendly
- Dark mode
- Syntax highlighting
- Markdown and MDX support
- [utterances](https://utteranc.es/) and [giscus](https://giscus.app/) integration
- [Google Analytics](https://analytics.google.com) integration
- RSS feed(xml, json, atom) and Sitemap
 
## Getting Started

Before using this theme, there are a few things you need to set up:

1. Edit the name, title, description and url in `blog.config.ts` (url without the trailing slash).
2. if you want to use giscus or utterances comments on your blog, change `comment` in `blog.config.ts`. If you don't want to use comments, set `comment` to `null`.
3. In `next-sitemap.config.js`, change `siteUrl` to be the same as in `blog.config.ts`.
4. change your blog's main page `pages/index.tsx` to your favour.

## Local Development

Ambienxo uses pnpm.

Install dependencies:
```bash
pnpm install
```

Run the development server:
```bash
pnpm dev
```