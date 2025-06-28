(function () {
    const EMBED_CLASS = 'init-embed';
    const STYLE_ID = 'init-embed-style';

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
    max-width: 500px;
    margin: 1em auto;
    border: 1px solid #ddd;
    border-radius: 10px;
    overflow: hidden;
    background: #fff;
    color: #111;
    font-size: 16px;
    line-height: 1.5;
    transition: box-shadow 0.2s ease, transform 0.2s ease;
}
.${EMBED_CLASS}:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
}
.${EMBED_CLASS}[data-theme="dark"]:hover {
    box-shadow: 0 4px 16px rgba(255, 255, 255, 0.05);
}
.${EMBED_CLASS}[data-theme="dark"] {
    background: #111;
    color: #eee;
    border-color: #444;
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
    padding: 16px;
    gap: 10px;
    cursor: pointer;
}
.${EMBED_CLASS} .embed-header {
    display: flex;
    align-items: center;
    gap: 10px;
}
.${EMBED_CLASS} .embed-favicon {
    width: 32px;
    height: 32px;
    border-radius: 5px;
    flex-shrink: 0;
}
.${EMBED_CLASS} .embed-meta {
    font-size: 14px;
    color: #666;
}
.${EMBED_CLASS}[data-theme="dark"] .embed-meta {
    color: #aaa;
}
.${EMBED_CLASS} .embed-time {
    font-size: 13px;
    color: #999;
}
.${EMBED_CLASS}[data-theme="dark"] .embed-time {
    color: #777;
}
.${EMBED_CLASS} .embed-featured {
    position: relative;
    width: 100%;
    aspect-ratio: 21 / 9;
    overflow: hidden;
    border-radius: 6px;
}

.${EMBED_CLASS} .embed-featured img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    max-height: 200px;
}
.${EMBED_CLASS} .embed-title {
    font-size: 18px;
    font-weight: bold;
    color: #111;
}
.${EMBED_CLASS}[data-theme="dark"] .embed-title {
    color: #fff;
}
.${EMBED_CLASS} .embed-excerpt {
    font-size: 16px;
    color: #333;
    margin: 0;
}
.${EMBED_CLASS}[data-theme="dark"] .embed-excerpt {
    color: #ccc;
}
.${EMBED_CLASS} .max-2-line,
.${EMBED_CLASS} .max-4-line {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.${EMBED_CLASS} .max-2-line {
    -webkit-line-clamp: 2;
}
.${EMBED_CLASS} .max-4-line {
    -webkit-line-clamp: 4;
}
.${EMBED_CLASS} .embed-images {
    display: flex;
    overflow-x: auto;
    gap: 4px;
    padding-bottom: 4px;
    scroll-snap-type: x mandatory;
    scrollbar-width: none;
    -ms-overflow-style: none;
}
.${EMBED_CLASS} .embed-images::-webkit-scrollbar {
    display: none;
}
.${EMBED_CLASS} .embed-images img {
    max-height: 120px;
    border-radius: 6px;
    object-fit: cover;
    flex-shrink: 0;
    scroll-snap-align: start;
}
.${EMBED_CLASS} .skeleton {
    background: #eee;
    height: 1em;
    margin-bottom: 6px;
    border-radius: 4px;
    animation: pulse 1.5s infinite ease-in-out;
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

    function renderSkeleton(container) {
        const showFeatured = container.dataset.featured !== '0';
        const showImage = container.dataset.image !== '0';

        const lines = [];

        // Ảnh bìa
        if (showFeatured) {
            lines.push(`<div class="skeleton" style="width: 100%; height: 200px;"></div>`);
        }

        // Header giả
        lines.push(`<div class="skeleton" style="width: 40%; height: 40px;"></div>`);

        // Title
        lines.push(`<div class="skeleton" style="width: 70%; height: 27px;"></div>`);

        // Excerpt (giả 3 dòng gộp lại)
        lines.push(`<div class="skeleton" style="width: 100%; height: 72px;"></div>`);

        // Image placeholder nếu có
        if (showImage) {
            lines.push(`<div class="skeleton" style="width: 100%; height: 120px; border-radius: 6px;"></div>`);
        }

        container.innerHTML = `
            <div class="embed-inner">
                ${lines.join('\n')}
            </div>
        `;
    }

    function renderCard(container, data, config) {
        const {
            favicon,
            site_name,
            site_domain,
            title,
            excerpt,
            url,
            images,
            thumbnail,
            published_at
        } = data;

        const date = new Date(published_at);
        const dateStr = date.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        let featuredHTML = '';
        if (config.showFeatured && thumbnail) {
            featuredHTML = `
                <div class="embed-featured">
                    <img src="${thumbnail}" loading="lazy" alt="Featured image">
                </div>`;
        }

        let imgHTML = '';
        if (config.showImage && images && images.length) {
            imgHTML = `
                <div class="embed-images">
                    ${images.map(src => `<img src="${src}" loading="lazy">`).join('')}
                </div>`;
        }

        container.innerHTML = `
            <a class="embed-inner" href="${url}" target="_blank" rel="noopener noreferrer">
                ${featuredHTML}
                <div class="embed-header">
                    <img class="embed-favicon" src="${favicon}" alt="favicon">
                    <div>
                        <div class="embed-meta">${site_name} @${site_domain}</div>
                        <div class="embed-time">${dateStr}</div>
                    </div>
                </div>
                <div class="embed-title max-2-line">${title}</div>
                <div class="embed-excerpt max-4-line">${excerpt}</div>
                ${imgHTML}
            </a>
        `;
    }

    async function processEmbed(el) {
        const postId = el.dataset.id;
        const origin = el.dataset.origin;
        let theme = el.dataset.theme || 'light';

        if (theme === 'auto') {
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            theme = isDark ? 'dark' : 'light';
        }

        el.dataset.theme = theme;

        const showImage = el.dataset.image !== '0';
        const showFeatured = el.dataset.featured !== '0';

        if (!postId || !origin) return;

        renderSkeleton(el);

        try {
            const res = await fetch(`${origin}/wp-json/initempo/v1/post/${postId}`);
            if (!res.ok) throw new Error('Failed to fetch');
            const data = await res.json();

            renderCard(el, data, {
                theme,
                showImage,
                showFeatured
            });
        } catch (err) {
            el.innerHTML = `<div style="padding:16px; color:red;">Failed to load embed</div>`;
        }
    }

    function init() {
        injectStyles();

        document.querySelectorAll(`.${EMBED_CLASS}[data-id][data-origin]`).forEach(el => {
            const type = el.dataset.type || 'post';
            if (type !== 'product') {
                processEmbed(el);
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
