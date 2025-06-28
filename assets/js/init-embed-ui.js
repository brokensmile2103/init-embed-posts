const IEP = {
    postId: null,
    scriptUrl: InitEmbedPostsSettings?.embed_url || location.origin + '/wp-content/plugins/init-embed-posts/assets/js/init-embed.js',
    productScriptUrl: InitEmbedPostsSettings?.product_url || location.origin + '/wp-content/plugins/init-embed-posts/assets/js/init-embed-product.js',

    openModal(buttonEl) {
        const modal = document.getElementById('iep-modal');
        const featuredCheckbox = document.getElementById('iep-show-featured');
        const checkbox = document.getElementById('iep-show-image');
        const themeSelect = document.getElementById('iep-theme');

        if (!modal || !checkbox || !themeSelect || !featuredCheckbox) {
            console.warn('[IEP] Modal or inputs not found.');
            return;
        }

        const wrapper = buttonEl.closest('.iep-embed-ui');
        if (!wrapper) {
            console.warn('[IEP] Embed UI wrapper not found.');
            return;
        }

        const postId = wrapper.dataset.id;
        if (!postId) {
            console.warn('[IEP] data-id missing in wrapper.');
            return;
        }

        IEP.postId = postId;
        modal.style.display = 'block';

        IEP.updateCode();

        featuredCheckbox.onchange = IEP.updateCode;
        checkbox.onchange = IEP.updateCode;
        themeSelect.onchange = IEP.updateCode;
    },

    closeModal() {
        const modal = document.getElementById('iep-modal');
        if (modal) {
            modal.style.display = 'none';
        }
    },

    updateCode() {
        const id = IEP.postId;
        const checkbox = document.getElementById('iep-show-image');
        const featuredCheckbox = document.getElementById('iep-show-featured');
        const themeSelect = document.getElementById('iep-theme');
        const textarea = document.getElementById('iep-code');

        if (!checkbox || !featuredCheckbox || !themeSelect || !textarea || !id) return;

        const showImage = checkbox.checked;
        const showFeatured = featuredCheckbox.checked;
        const theme = themeSelect.value;
        const origin = location.origin;

        const wrapper = document.querySelector(`.iep-embed-ui[data-id="${id}"]`);
        const type = wrapper?.dataset?.type || 'post';
        const cartText = wrapper?.dataset?.cart;

        let attrs = `data-id="${id}" data-origin="${origin}"`;

        if (!showImage) attrs += ` data-image="0"`;
        if (!showFeatured) attrs += ` data-featured="0"`;
        if (theme === 'dark') attrs += ` data-theme="dark"`;
        if (theme === 'auto') attrs += ` data-theme="auto"`;
        if (type !== 'post') attrs += ` data-type="${type}"`;
        if (cartText) attrs += ` data-cart="${cartText}"`;

        const scriptSrc = type === 'product' ? IEP.productScriptUrl : IEP.scriptUrl;
        const embedClass = type === 'product' ? 'init-embed-product' : 'init-embed';

        const html = `<div class="${embedClass}" ${attrs}></div>\n<script async src="${scriptSrc}"></script>`;

        textarea.value = html;
    },

    copyCode() {
        const textarea = document.getElementById('iep-code');
        if (!textarea) return;

        textarea.select();
        document.execCommand('copy');
        IEP.toast(InitEmbedPostsSettings?.i18n?.copied || 'Embed code copied!');
    },

    toast(message = 'Copied!') {
        const existing = document.getElementById('iep-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'iep-toast';
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.bottom = '30px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.background = '#111';
        toast.style.color = '#fff';
        toast.style.padding = '10px 20px';
        toast.style.fontSize = '14px';
        toast.style.borderRadius = '6px';
        toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
        toast.style.zIndex = '10000';
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '1';
        }, 10);

        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};

// ESC để đóng modal
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        IEP.closeModal();
    }
});

// Dark mode auto
function getEffectiveTheme() {
    const theme = window.InitPluginSuiteEmbedPostsConfig?.theme;
    return theme === 'dark' || theme === 'light'
        ? theme
        : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
}

// DOM loaded: gán theme + xử lý click ngoài modal
document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('iep-modal');
    const wrappers = document.querySelectorAll('.iep-embed-ui');

    const theme = getEffectiveTheme();

    if (theme === 'dark') {
        wrappers.forEach(w => w.classList.add('iep-dark'));
        if (modal) modal.classList.add('iep-dark');
    }

    if (modal) {
        modal.addEventListener('click', function (e) {
            const isOutsideModal = !e.target.closest('.iep-modal-content');
            if (isOutsideModal) {
                IEP.closeModal();
            }
        });
    }
});
