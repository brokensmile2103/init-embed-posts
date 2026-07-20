(function () {
    const EMBED_CLASS = 'init-embed';
    const STYLE_ID = 'init-embed-style';

    // Escape dữ liệu trước khi chèn vào innerHTML, tránh XSS nếu title/excerpt/site_name...
    // lỡ chứa ký tự HTML lạ (từ theme/plugin khác, hoặc dữ liệu không đáng tin cậy).
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
.${EMBED_CLASS} .embed-time,
.${EMBED_CLASS} .embed-meta {
    font-size: 14px;
    color: #666;
}
.${EMBED_CLASS} .embed-info-row {
    display: flex;
    gap: 10px;
    align-items: center;
    flex-wrap: wrap;
}
.${EMBED_CLASS}[data-theme="dark"] .embed-time,
.${EMBED_CLASS}[data-theme="dark"] .embed-meta {
    color: #aaa;
}
.${EMBED_CLASS} .embed-time svg,
.${EMBED_CLASS} .embed-meta svg {
    vertical-align: middle;
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
.${EMBED_CLASS} .embed-review {
    display: flex;
    align-items: center;
    gap: 8px;
}
.${EMBED_CLASS} .init-review-info {
    font-size: 16px;
}
.${EMBED_CLASS} .embed-review-stars {
    display: flex;
    gap: 3px;
}
.${EMBED_CLASS} .embed-review-stars svg {
    flex-shrink: 0;
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
        const showReview = container.dataset.review !== '0';

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

        if (showReview) {
            lines.push(`<div class="skeleton" style="width: 50%; height: 27px;"></div>`);
        }

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
            published_at,
            comment_count,
            view_count,
            review
        } = data;

        const dateStr = escapeHTML(published_at);
        const safeTitle = escapeHTML(title);
        const safeExcerpt = escapeHTML(excerpt);
        const safeSiteName = escapeHTML(site_name);
        const safeSiteDomain = escapeHTML(site_domain);
        const safeUrl = escapeHTML(url);
        const safeFavicon = escapeHTML(favicon);
        const safeThumbnail = escapeHTML(thumbnail);

        const showMeta = container.dataset.meta !== '0';
        const showReview = container.dataset.review !== '0';
        const showFeatured = config.showFeatured;
        const showImage = config.showImage;

        const svgClock = `<svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true" fill="currentColor"><path d="M 2,3 2,17 18,17 18,3 2,3 Z M 17,16 3,16 3,8 17,8 17,16 Z M 17,7 3,7 3,4 17,4 17,7 Z"></path><rect width="1" height="3" x="6" y="2"></rect><rect width="1" height="3" x="13" y="2"></rect></svg>`;

        const svgComment = `<svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><path fill="currentColor" d="M6,18.71 L6,14 L1,14 L1,1 L19,1 L19,14 L10.71,14 L6,18.71 L6,18.71 Z M2,13 L7,13 L7,16.29 L10.29,13 L18,13 L18,2 L2,2 L2,13 L2,13 Z"></path></svg>`;

        const svgView = `<svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true"><circle fill="none" stroke="currentColor" cx="10" cy="10" r="3.45"></circle><path fill="none" stroke="currentColor" d="m19.5,10c-2.4,3.66-5.26,7-9.5,7h0,0,0c-4.24,0-7.1-3.34-9.49-7C2.89,6.34,5.75,3,9.99,3h0,0,0c4.25,0,7.11,3.34,9.5,7Z"></path></svg>`;

        // Ảnh featured
        let featuredHTML = '';
        if (showFeatured && thumbnail) {
            featuredHTML = `
                <div class="embed-featured">
                    <img src="${safeThumbnail}" loading="lazy" alt="Featured image">
                </div>`;
        }

        // Meta: ngày tháng + view + comment
        let metaInfo = '';
        if (showMeta) {
            const parts = [];
            if (typeof comment_count === 'number') {
                parts.push(`${svgComment} ${comment_count}`);
            }
            if (typeof view_count === 'number') {
                parts.push(`${svgView} ${view_count.toLocaleString()}`);
            }

            metaInfo = `
                <div class="embed-info-row">
                    <div class="embed-time">${svgClock} ${dateStr}</div>
                    ${parts.map(text => `<div class="embed-meta">${text}</div>`).join('')}
                </div>
            `;
        } else {
            metaInfo = `<div class="embed-time">${svgClock} ${dateStr}</div>`;
        }

        // Ảnh gallery
        let imgHTML = '';
        if (showImage && images && images.length) {
            imgHTML = `
                <div class="embed-images">
                    ${images.map(src => `<img src="${escapeHTML(src)}" loading="lazy">`).join('')}
                </div>`;
        }

        // Review
        let reviewHTML = '';
        if (showReview && review && review.total > 0) {
            const rating = review.average;
            const count = review.total;
            const stars = [];

            for (let i = 1; i <= 5; i++) {
                const active = i <= Math.round(rating);
                stars.push(`
                    <svg width="20" height="20" viewBox="0 0 64 64" style="color: ${active ? '#f39c12' : '#ccc'}">
                        <path fill="currentColor" d="M63.9 24.28a2 2 0 0 0-1.6-1.35l-19.68-3-8.81-18.78a2 2 0 0 0-3.62 0l-8.82 18.78-19.67 3a2 2 0 0 0-1.13 3.38l14.3 14.66-3.39 20.7a2 2 0 0 0 2.94 2.07L32 54.02l17.57 9.72a2 2 0 0 0 2.12-.11 2 2 0 0 0 .82-1.96l-3.38-20.7 14.3-14.66a2 2 0 0 0 .46-2.03"></path>
                    </svg>
                `);
            }

            reviewHTML = `
                <div class="embed-review">
                    <div class="embed-review-stars">
                        ${stars.join('')}
                    </div>
                    <div class="init-review-info">
                        <strong>${rating}</strong><sub>/5</sub> (${count})
                    </div>
                </div>
            `;
        }

        // Final render
        container.innerHTML = `
            <a class="embed-inner" href="${safeUrl}" target="_blank" rel="noopener noreferrer">
                ${featuredHTML}
                <div class="embed-header">
                    <img class="embed-favicon" src="${safeFavicon}" alt="favicon">
                    <div>
                        <div class="embed-meta">${safeSiteName} @${safeSiteDomain}</div>
                        ${metaInfo}
                    </div>
                </div>
                <div class="embed-title max-2-line">${safeTitle}</div>
                <div class="embed-excerpt max-4-line">${safeExcerpt}</div>
                ${reviewHTML}
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
    // Nếu trình duyệt không hỗ trợ IntersectionObserver thì fetch ngay như trước.
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

    // Quét 1 vùng DOM (mặc định toàn trang) để tìm embed post chưa xử lý.
    // Public API: window.IEP_Embed.scan(root) — gọi lại sau khi bro tự chèn HTML động (AJAX/SPA).
    function scan(root) {
        injectStyles();

        (root || document).querySelectorAll(`.${EMBED_CLASS}[data-id][data-origin]`).forEach(el => {
            const type = el.dataset.type || 'post';
            if (type !== 'product') {
                queueEmbed(el);
            }
        });
    }

    function watchForDynamicEmbeds() {
        if (!('MutationObserver' in window)) return;

        let scheduled = false;
        const mutationObserver = new MutationObserver((mutations) => {
            const hasAddedNodes = mutations.some(m => m.addedNodes && m.addedNodes.length);
            if (!hasAddedNodes || scheduled) return;

            // Gộp nhiều mutation liên tiếp lại thành 1 lần quét, tránh tốn CPU.
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

    window.IEP_Embed = window.IEP_Embed || {};
    window.IEP_Embed.scan = function (root) { scan(root); };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
