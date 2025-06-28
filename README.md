# Init Embed Posts – Stylish, Fast, Portable

> Embed WordPress posts or products anywhere – like a Twitter Card. No iframe. No oEmbed. Just pure JS, full control, and beautiful design.

**Pure JavaScript. Beautiful Cards. Works Anywhere.**

[![Version](https://img.shields.io/badge/stable-v1.1-blue.svg)](https://wordpress.org/plugins/init-embed-posts/)
[![License](https://img.shields.io/badge/license-GPLv2-blue.svg)](https://www.gnu.org/licenses/gpl-2.0.html)
![Made with ❤️ in HCMC](https://img.shields.io/badge/Made%20with-%E2%9D%A4%EF%B8%8F%20in%20HCMC-blue)

## Overview

Init Embed Posts lets you embed WordPress content externally – with beautiful cards, real-time REST API data, and zero friction.

Instead of using iframes or clunky oEmbed, this plugin gives you clean `<div>` + `<script>` snippets, which load the post or product dynamically using WordPress REST API. Designed for speed, style, and full control – using pure JavaScript and smart caching.

## Features

- Embed any public post or WooCommerce product
- Works anywhere: raw HTML, CMS, blog, landing page…
- Beautiful card layout:
  - Site name + favicon
  - Title, excerpt, date (for posts)
  - Featured image, horizontal gallery (optional)
  - Product name, price, sale price with strikethrough
  - "Add to cart" styled button (optional)
  - Auto dark mode, adapts to embedding site
- Hover effects and modern UI
- Skeleton loader while waiting for data
- JS-only, no iframe, no jQuery, no dependency
- Modal UI to generate personalized embed code
- Smart `<script>` switching:
  - `init-embed.js` for posts
  - `init-embed-product.js` for Woo products
- Embed attributes:
  - `data-theme="light|dark|auto"` – force or auto-detect theme
  - `data-image`, `data-featured`, `data-cart` – control content
- Cached REST API (immutable, 1 year)
- Developer filters to customize data and HTML

## Shortcode

### `[init_embed_code]`

Displays the Embed Generator button.

**Attributes:**

- `text`: Button text label
- `class`: CSS class for wrapper
- `post_id`: Optional post override

## REST API Endpoints

### `GET /wp-json/initempo/v1/post/{id}`

Returns data for embedding a post.

### `GET /wp-json/initempo/v1/product/{id}`

Returns data for embedding a WooCommerce product.

## Developer Filters

### REST response filters

- `init_plugin_suite_embed_posts_rest_response`
- `init_plugin_suite_embed_products_rest_response`

### Excerpt filters

- `init_plugin_suite_embed_posts_excerpt`
- `init_plugin_suite_embed_products_excerpt`

### Image filters

- `init_plugin_suite_embed_posts_images`
- `init_plugin_suite_embed_products_images`
- `init_plugin_suite_embed_posts_extracted_images`

### Favicon

- `init_plugin_suite_embed_posts_favicon_url`
- `init_plugin_suite_embed_products_favicon_url`

### Auto-insert

- `init_embed_insert_locations`

## Installation

1. Upload to `/wp-content/plugins/init-embed-posts`
2. Activate in WordPress admin
3. Use `[init_embed_code]` to enable generator
4. Copy + paste the embed wherever you like

## License

GPLv2 or later — free, open source, developer-first.

## Part of Init Plugin Suite

Init Embed Posts is part of the [Init Plugin Suite](https://en.inithtml.com/init-plugin-suite-minimalist-powerful-and-free-wordpress-plugins/) — a collection of blazing-fast, no-bloat plugins made for WordPress developers who care about quality and speed.
