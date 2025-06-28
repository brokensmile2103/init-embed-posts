=== Init Embed Posts – Stylish, Fast, Portable ===
Contributors: brokensmile.2103  
Tags: embed, wordpress card, post preview, woocommerce, rest api  
Requires at least: 5.5  
Tested up to: 6.8  
Requires PHP: 7.4  
Stable tag: 1.1  
License: GPLv2 or later  
License URI: https://www.gnu.org/licenses/gpl-2.0.html  

Embed WordPress posts or products anywhere – like a Twitter Card. No iframe. No oEmbed. Just pure JS, full control, and beautiful design.

== Description ==

Init Embed Posts lets you embed WordPress content externally – with beautiful cards, real-time REST API data, and zero friction.

Instead of using iframes or clunky oEmbed, this plugin gives you clean `<div>` + `<script>` snippets, which load the post or product dynamically using WordPress REST API. Designed for speed, style, and full control – using pure JavaScript and smart caching.

**Features:**

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

== Installation ==

1. Install and activate this plugin.
2. Use the `[init_embed_code]` shortcode to show the “Copy Embed Code” button.
3. Click the button → configure your embed → copy the code.
4. Paste it anywhere: blog, site builder, static HTML, you name it.

== Filters for Developers ==

These filters give you full control over how data is rendered and returned.

**REST response filters:**

- `init_plugin_suite_embed_posts_rest_response`  
  Modify REST API response for posts.

- `init_plugin_suite_embed_products_rest_response`  
  Modify REST API response for Woo products.

**Excerpt filters:**

- `init_plugin_suite_embed_posts_excerpt`  
  Customize excerpt for posts.

- `init_plugin_suite_embed_products_excerpt`  
  Customize excerpt for products.

**Image control:**

- `init_plugin_suite_embed_posts_images`  
  Filter image list for embedded post.

- `init_plugin_suite_embed_products_images`  
  Filter image list for embedded product.

- `init_plugin_suite_embed_posts_extracted_images`  
  Filter raw image URLs extracted from post content.

**Favicon:**

- `init_plugin_suite_embed_posts_favicon_url`  
  Override favicon for posts.

- `init_plugin_suite_embed_products_favicon_url`  
  Override favicon for products.

**Auto-insert locations:**

- `init_embed_insert_locations`  
  Customize or filter valid auto-insert positions (e.g., after title, before content, etc).

== Frequently Asked Questions ==

= Does it use iframes? =  
No. It renders HTML via JS directly.

= Can I embed WooCommerce products? =  
Yes, as of v1.1. Just add `data-type="product"` and use the new script.

= Is it fast? =  
Yes. The REST JSON response is immutable and cacheable via Cloudflare or CDN for 1 year.

= Can I restyle the embed card? =  
Yes. All styles are scoped. You can override with your own CSS.

= Can I disable auto-insert button? =  
Yes. Go to Settings → Init Embed Posts and uncheck all positions.

== Screenshots ==

1. Modal code generator  
2. Embed card – post  
3. Embed card – product  

== Changelog ==

= 1.1 – June 14, 2025 =
* Add support for WooCommerce product embeds  
* New REST endpoint: `/product/{id}`  
* Product embed supports featured image, price, sale price (with strikethrough), and dark mode  
* Auto-insert embed button after product meta (if enabled)  
* Embed code now includes `data-type` to switch JS logic  
* New embed script: `init-embed-product.js`  
* Cleaned up UI styles and fixed edge cases  

= 1.0 – June 9, 2025 =
* Initial release  
* Embed any post with responsive card  
* Modal UI for embed code generation  
* REST API with cache-friendly headers  
* Vanilla JS – lightweight and dependency-free  
* Works anywhere, no iframe/oEmbed needed

== License ==

This plugin is licensed under the GPLv2 or later.  
You are free to use, modify, and distribute it under the same license.
