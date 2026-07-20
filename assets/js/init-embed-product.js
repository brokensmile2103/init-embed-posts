(function () {
    const EMBED_CLASS = 'init-embed-product';
    const STYLE_ID = 'init-embed-product-style';

    // Escape dữ liệu trước khi chèn vào innerHTML, tránh XSS nếu title/site_name...
    // lỡ chứa ký tự HTML lạ.
    function escapeHTML(value) {
        if (value === null || value === undefined) return '';
        return String(value).replace(/[&<>"']/g, (ch) => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        }[ch]));
    }

    function injectStyles() {
        if (document.getElementById(STYLE_ID)) return;

        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = `
.${EMBED_CLASS} {
    all: initial;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    box-sizing: border-box;
    display: block;
    width: 100%;
    max-width: 320px;
    margin: 1em auto;
    border-radius: 12px;
    overflow: hidden;
    background: #fff;
    color: #111;
    box-shadow: 0 4px 14px rgba(0,0,0,0.06);
    transition: transform 0.2s ease;
}
.${EMBED_CLASS}:hover {
    transform: translateY(-2px);
}
.${EMBED_CLASS} * {
    display: revert;
    box-sizing: border-box;
}
.${EMBED_CLASS} a {
    color: inherit;
    text-decoration: none;
}
.${EMBED_CLASS} .embed-inner {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    cursor: pointer;
}
.${EMBED_CLASS} .embed-image-wrapper {
    position: relative;
    aspect-ratio: 4 / 3;
    background: #f8f8f8;
    max-height: 268px;
}
.${EMBED_CLASS} .embed-image-wrapper img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}
.${EMBED_CLASS} .embed-image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #bbb;
    background: #f2f2f2;
}
.${EMBED_CLASS}[data-theme="dark"] .embed-image-placeholder {
    background: #1a1a1a;
    color: #555;
}
.${EMBED_CLASS} .embed-badge {
    position: absolute;
    top: 8px;
    left: 8px;
    background: #000;
    color: #fff;
    font-size: 13px;
    font-weight: 600;
    padding: 2px 8px;
    border-radius: 4px;
}
.${EMBED_CLASS} .embed-info {
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 6px;
}
.${EMBED_CLASS} .embed-title {
    font-size: 16px;
    font-weight: 600;
    line-height: 1.4;
    color: #111;
}
.${EMBED_CLASS} .embed-price-wrapper {
    display: flex;
    align-items: baseline;
    gap: 8px;
}
.${EMBED_CLASS} .embed-price {
    font-size: 17px;
    font-weight: bold;
    color: #e60023;
}
.${EMBED_CLASS} del {
    font-size: 15px;
    color: #888;
}
.${EMBED_CLASS} .embed-meta {
    font-size: 13px;
    color: #555;
}
.${EMBED_CLASS} .embed-cart {
    margin-top: 10px;
    display: inline-block;
    background: #0a1f44;
    color: #fff;
    text-align: center;
    padding: 10px 16px;
    border-radius: 8px;
    font-size: 15px;
    font-weight: 500;
    transition: background 0.2s ease;
}
.${EMBED_CLASS} .embed-cart:hover {
    background: #04102c;
}
.${EMBED_CLASS} .skeleton {
    background: #eee;
    height: 1em;
    margin-bottom: 6px;
    border-radius: 4px;
    animation: pulse 1.5s infinite ease-in-out;
}
.${EMBED_CLASS}[data-theme="dark"] {
    background: #111;
    color: #eee;
}
.${EMBED_CLASS}[data-theme="dark"] .embed-title {
    color: #fff;
}
.${EMBED_CLASS}[data-theme="dark"] .embed-meta {
    color: #bbb;
}
.${EMBED_CLASS}[data-theme="dark"] .embed-price {
    color: #f66;
}
.${EMBED_CLASS}[data-theme="dark"] del {
    color: #888;
}
.${EMBED_CLASS}[data-theme="dark"] .embed-cart {
    background: #333;
    color: #fff;
}
.${EMBED_CLASS}[data-theme="dark"] .embed-cart:hover {
    background: #424242;
}
.${EMBED_CLASS}[data-theme="dark"] .embed-badge {
    background: #fff;
    color: #000;
}
.${EMBED_CLASS}[data-theme="dark"] .skeleton {
    background: #333;
}
@keyframes pulse {
    0%, 100% { opacity: 1 }
    50% { opacity: 0.4 }
}
`;
        document.head.appendChild(style);
    }

    function formatPrice(amount, currency) {
        try {
            return new Intl.NumberFormat(undefined, {
                style: 'currency',
                currency
            }).format(amount);
        } catch (e) {
            return `${amount} ${currency}`;
        }
    }

    function renderSkeleton(container) {
        container.innerHTML = `
            <div class="embed-inner">
                <div class="skeleton" style="width: 100%; aspect-ratio: 4 / 3; height: 268px"></div>
                <div class="embed-info">
                    <div class="skeleton" style="width: 40%; height: 17px;"></div>
                    <div class="skeleton" style="width: 60%; height: 24px;"></div>
                    <div class="skeleton" style="width: 100%; height: 36px; border-radius: 8px;"></div>
                </div>
            </div>
        `;
    }

    function renderCard(container, data) {
        const {
            title, url, thumbnail,
            price, regular_price, sale_price, currency,
            price_min, price_max, product_type,
            site_name, site_domain
        } = data;

        const theme = container.dataset.theme || 'light';
        const cartText = escapeHTML(container.dataset.cart || 'Add to cart');

        const safeTitle = escapeHTML(title);
        const safeUrl = escapeHTML(url);
        const safeSiteName = escapeHTML(site_name);
        const safeSiteDomain = escapeHTML(site_domain);

        const isDiscount = sale_price && sale_price < regular_price;
        const finalPrice = isDiscount ? sale_price : (price || regular_price);
        const badge = isDiscount
            ? `<div class="embed-badge">${Math.round(100 - (sale_price / regular_price * 100))}% OFF</div>`
            : '';

        // Sản phẩm variable có nhiều biến thể với giá khác nhau: hiển thị khoảng giá thay vì 1 giá cố định.
        const isPriceRange = product_type === 'variable'
            && typeof price_min === 'number'
            && typeof price_max === 'number'
            && price_min !== price_max;

        let priceHTML;
        if (isPriceRange) {
            priceHTML = `<div class="embed-price-wrapper">
                    <span class="embed-price">${formatPrice(price_min, currency)} – ${formatPrice(price_max, currency)}</span>
               </div>`;
        } else if (isDiscount) {
            priceHTML = `<div class="embed-price-wrapper">
                    <span class="embed-price">${formatPrice(sale_price, currency)}</span>
                    <del>${formatPrice(regular_price, currency)}</del>
               </div>`;
        } else {
            priceHTML = `<div class="embed-price-wrapper">
                    <span class="embed-price">${formatPrice(finalPrice, currency)}</span>
               </div>`;
        }

        const svgImagePlaceholder = `<svg width="40" height="40" viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" stroke-width="1.5"></rect><circle cx="8" cy="10" r="1.5" fill="currentColor"></circle><path d="M4 17l5-5 3 3 4-4 4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>`;

        const imageHTML = thumbnail
            ? `<img src="${escapeHTML(thumbnail)}" alt="${safeTitle}" loading="lazy">`
            : `<div class="embed-image-placeholder">${svgImagePlaceholder}</div>`;

        container.innerHTML = `
            <a class="embed-inner" href="${safeUrl}" target="_blank" rel="noopener noreferrer">
                <div class="embed-image-wrapper">
                    ${badge}
                    ${imageHTML}
                </div>
                <div class="embed-info">
                    <div class="embed-meta">${safeSiteName} @${safeSiteDomain}</div>
                    <div class="embed-title">${safeTitle}</div>
                    ${priceHTML}
                    <div class="embed-cart">${cartText}</div>
                </div>
            </a>
        `;
        container.setAttribute('data-theme', theme);
    }

    async function processEmbed(el) {
        const productId = el.dataset.id;
        const origin = el.dataset.origin;
        let theme = el.dataset.theme || 'light';

        if (theme === 'auto') {
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            theme = isDark ? 'dark' : 'light';
        }

        el.dataset.theme = theme;
        if (!productId || !origin) return;

        injectStyles();
        renderSkeleton(el);

        try {
            const res = await fetch(`${origin}/wp-json/initempo/v1/product/${productId}`);
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();
            renderCard(el, data);
        } catch (err) {
            el.innerHTML = `<div style="padding:16px; color:red;">Failed to load product</div>`;
        }
    }

    let lazyObserver = null;

    function getLazyObserver() {
        if (lazyObserver || !('IntersectionObserver' in window)) return lazyObserver;

        lazyObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    obs.unobserve(entry.target);
                    processEmbed(entry.target);
                }
            });
        }, { rootMargin: '200px 0px', threshold: 0.01 });

        return lazyObserver;
    }

    // Đưa 1 phần tử embed vào hàng đợi: chỉ fetch khi sắp cuộn tới (lazy-load).
    function queueEmbed(el) {
        if (el.dataset.iepQueued === '1') return;
        el.dataset.iepQueued = '1';

        const observer = getLazyObserver();
        if (observer) {
            observer.observe(el);
        } else {
            processEmbed(el);
        }
    }

    // Quét 1 vùng DOM (mặc định toàn trang) để tìm embed product chưa xử lý.
    // Public API: window.IEP_EmbedProduct.scan(root) — gọi lại sau khi bro tự chèn HTML động (AJAX/SPA).
    function scan(root) {
        injectStyles();

        (root || document)
            .querySelectorAll(`.${EMBED_CLASS}[data-id][data-origin][data-type="product"]`)
            .forEach(queueEmbed);
    }

    function watchForDynamicEmbeds() {
        if (!('MutationObserver' in window)) return;

        let scheduled = false;
        const mutationObserver = new MutationObserver((mutations) => {
            const hasAddedNodes = mutations.some(m => m.addedNodes && m.addedNodes.length);
            if (!hasAddedNodes || scheduled) return;

            scheduled = true;
            requestAnimationFrame(() => {
                scheduled = false;
                scan(document);
            });
        });

        mutationObserver.observe(document.body, { childList: true, subtree: true });
    }

    function init() {
        scan(document);
        watchForDynamicEmbeds();
    }

    window.IEP_EmbedProduct = window.IEP_EmbedProduct || {};
    window.IEP_EmbedProduct.scan = function (root) { scan(root); };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
