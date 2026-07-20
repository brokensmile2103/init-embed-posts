=== Init Embed Posts – Stylish, Fast, Portable ===
Contributors: brokensmile.2103
Tags: embed, wordpress card, post preview, woocommerce, rest api
Requires at least: 5.5
Tested up to: 7.0
Requires PHP: 7.4
Stable tag: 1.7
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Embed WordPress posts or products anywhere – like a Twitter Card. No iframe. No oEmbed. Just pure JS, full control, and beautiful design.

== Description ==

Init Embed Posts lets you embed WordPress content externally – with beautiful cards, real-time REST API data, and zero friction.

Instead of using iframes or clunky oEmbed, this plugin gives you clean `<div>` + `<script>` snippets, which load the post or product dynamically using WordPress REST API. Designed for speed, style, and full control – using pure JavaScript and smart caching.

This plugin is part of the [Init Plugin Suite](https://en.inithtml.com/init-plugin-suite-minimalist-powerful-and-free-wordpress-plugins/) — a collection of minimalist, fast, and developer-focused tools for WordPress.

GitHub repository: [https://github.com/brokensmile2103/init-embed-posts](https://github.com/brokensmile2103/init-embed-posts)

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
- Lazy-loads embed cards as they scroll into view
- Auto-detects embeds inserted dynamically after page load (AJAX/SPA)
- Modal UI to generate personalized embed code
- Smart `<script>` switching:
  - `init-embed.js` for posts
  - `init-embed-product.js` for Woo products
- Embed attributes:
  - `data-theme="light|dark|auto"` – force or auto-detect theme
  - `data-image`, `data-featured`, `data-cart` – control content
- Cached REST API (1 year, revalidated via ETag when the post/product is updated)
- Price range display for WooCommerce variable products
- Configurable gallery image limit and default embed theme (Settings page)
- Developer filters to customize data and HTML

== Installation ==

1. Install and activate this plugin.
2. Use the `[init_embed_code]` shortcode to show the “Copy Embed Code” button.
3. Click the button → configure your embed → copy the code.
4. Paste it anywhere: blog, site builder, static HTML, you name it.

== Filters for Developers ==

These filters give you full control over how data is rendered and returned.

**JS config override (highest priority):**

- `window.InitPluginSuiteEmbedPostsConfig`  
  Set this object before the page renders (e.g. via `wp_add_inline_script` in a theme) to override embed UI settings in JS, taking priority over the plugin's Settings page. Currently supports:
  - `theme` – `"light"`, `"dark"`, or `"auto"`. Overrides the "Default embed theme" setting for the embed code generator button/modal.

  Example:
  `<script>window.InitPluginSuiteEmbedPostsConfig = { theme: 'dark' };</script>`

**REST response filters:**

- `init_plugin_suite_embed_posts_rest_response`  
  Modify REST API response for posts.

- `init_plugin_suite_embed_products_rest_response`  
  Modify REST API response for Woo products.

- `init_plugin_suite_embed_posts_view_count_keys`  
  Customize the list of post meta keys used to detect view count. Supports array of meta keys, ordered by priority.

- `init_plugin_suite_embed_posts_gallery_limit`  
  Override the gallery image limit (defaults to the Settings page value, 1–10) used for both post and product embeds.

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

**HTML output filters:**

- `init_plugin_suite_embed_posts_shortcode_html`  
  Customize HTML output of the `[init_embed_code]` shortcode. Allows complete control over button markup, styling, and attributes.

**Auto-insert locations:**

- `init_embed_insert_locations`  
  Customize or filter valid auto-insert positions (e.g., after title, before content, etc).

== Frequently Asked Questions ==

= Does it use iframes? =  
No. It renders HTML via JS directly.

= Can I embed WooCommerce products? =  
Yes, as of v1.1. Just add `data-type="product"` and use the new script.

= Is it fast? =  
Yes. The REST JSON response is cacheable via Cloudflare or CDN for up to 1 year, and includes an ETag so caches automatically revalidate and pick up fresh data as soon as the post or product is updated.

= Can I restyle the embed card? =  
Yes. All styles are scoped. You can override with your own CSS.

= Can I disable auto-insert button? =  
Yes. Go to Settings → Init Embed Posts and uncheck all positions.

== Screenshots ==

1. Modal code generator  
2. Embed card – post  
3. Embed card – product  
4. Embed card – post with images 

== Changelog ==

= 1.7 – July 20, 2026 =
- Fix stale embed cards: REST responses no longer use `immutable` caching; added `ETag` + `modified_at` (based on post/product last-modified time) so browsers/CDNs revalidate instead of serving year-old data after a post is edited
- Add lazy-loading for embed cards via `IntersectionObserver`: cards only fetch data when scrolled near the viewport
- Add public `scan()` API (`IEP_Embed.scan()` for posts, `IEP_EmbedProduct.scan()` for products) plus automatic `MutationObserver` support, so embeds inserted dynamically after page load (AJAX/SPA) are picked up
- Escape title, excerpt, site name, and other dynamic fields before rendering to prevent HTML/script injection in embed cards
- Add placeholder icon for product embeds when no thumbnail is available, instead of a broken image
- Add price range display (e.g. "100.000₫ – 150.000₫") for WooCommerce variable products with `price_min`/`price_max` in the REST response
- Add new setting: gallery image limit (1–10), replacing the previous hard-coded limit of 5
- Add new setting: default embed theme, pre-selected in the embed code generator modal (`window.InitPluginSuiteEmbedPostsConfig.theme` still takes top priority when set by a theme/site, falling back to this setting, then to `light`)

= 1.6 – December 23, 2025 =
- Prevent duplicated `InitEmbedPostsSettings` output when shortcode is rendered multiple times on the same page  
- Ensure embed UI scripts and localized settings are loaded only once per request  
- Improve shortcode rendering stability when auto-injected at multiple locations  
- Minor internal optimization to reduce redundant processing during content rendering  

= 1.5 – November 14, 2025 =
- Improved image extraction logic in REST response for more consistent embed visuals  
- Enhanced `init_plugin_suite_embed_posts_extract_images()` with URL sanitization, duplication checks, and safer handling of invalid sources  
- Ensured embed cards always return clean, valid image URLs and respect the requested limit  
- Minor REST performance refinements and internal hardening  
- Code cleanup for better long-term maintainability 

= 1.4 – August 22, 2025 =
- Add `init_embed_posts_shortcode_html` filter for customizing shortcode button HTML
- Allow developers to completely override embed button markup and styling
- Improved extensibility for theme and plugin developers

= 1.3 – July 9, 2025 =
- Refactor embed modal: now fully rendered via JavaScript, no PHP template used
- Add two new toggle options in modal: "Show post meta" and "Show review"
- Post meta now displays published time, view count, and comment count with icons
- Review support: renders 5-star rating and average score if Init Review System is active
- Enhance REST API:
  - Add `comment_count`, `view_count`, and `review` data
  - Support multiple view count plugins (Jetpack, WP-PostViews, WP Statistics, Post Views Counter)
  - Allow custom view field via `init_plugin_suite_embed_posts_view_count_keys` filter
- `published_at` now returns human-readable time difference (e.g. `2 days`) instead of ISO
- Minor UI adjustments and cleaner card layout

= 1.2 – June 30, 2025 =
- Add `uninstall.php` to clean up settings on deletion  
- Change default theme from `auto` to `light` for better compatibility  

= 1.1 – June 14, 2025 =
- Add support for WooCommerce product embeds  
- New REST endpoint: `/product/{id}`  
- Product embed supports featured image, price, sale price (with strikethrough), and dark mode  
- Auto-insert embed button after product meta (if enabled)  
- Embed code now includes `data-type` to switch JS logic  
- New embed script: `init-embed-product.js`  
- Cleaned up UI styles and fixed edge cases  

= 1.0 – June 9, 2025 =
- Initial release  
- Embed any post with responsive card  
- Modal UI for embed code generation  
- REST API with cache-friendly headers  
- Vanilla JS – lightweight and dependency-free  
- Works anywhere, no iframe/oEmbed needed

== License ==

This plugin is licensed under the GPLv2 or later.  
You are free to use, modify, and distribute it under the same license.
