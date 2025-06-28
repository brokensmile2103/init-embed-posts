(function () {
    const EMBED_CLASS = 'init-embed-product';
    const STYLE_ID = 'init-embed-product-style';

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
            site_name, site_domain
        } = data;

        const theme = container.dataset.theme || 'light';
        const cartText = container.dataset.cart || 'Add to cart';

        const isDiscount = sale_price && sale_price < regular_price;
        const finalPrice = isDiscount ? sale_price : (price || regular_price);
        const badge = isDiscount
            ? `<div class="embed-badge">${Math.round(100 - (sale_price / regular_price * 100))}% OFF</div>`
            : '';

        const priceHTML = isDiscount
            ? `<div class="embed-price-wrapper">
                    <span class="embed-price">${formatPrice(sale_price, currency)}</span>
                    <del>${formatPrice(regular_price, currency)}</del>
               </div>`
            : `<div class="embed-price-wrapper">
                    <span class="embed-price">${formatPrice(finalPrice, currency)}</span>
               </div>`;

        container.innerHTML = `
            <a class="embed-inner" href="${url}" target="_blank" rel="noopener noreferrer">
                <div class="embed-image-wrapper">
                    ${badge}
                    <img src="${thumbnail}" alt="Product image" loading="lazy">
                </div>
                <div class="embed-info">
                    <div class="embed-meta">${site_name} @${site_domain}</div>
                    <div class="embed-title">${title}</div>
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

    function init() {
        document.querySelectorAll(`.${EMBED_CLASS}[data-id][data-origin][data-type="product"]`).forEach(processEmbed);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
