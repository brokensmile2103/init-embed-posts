const IEP = {
    postId: null,
    scriptUrl: InitEmbedPostsSettings?.embed_url || '',
    productScriptUrl: InitEmbedPostsSettings?.product_url || '',

    openModal(buttonEl) {
        const wrapper = buttonEl.closest('.iep-embed-ui');
        const id = wrapper?.dataset?.id;
        if (!wrapper || !id) return;

        this.postId = id;

        if (!document.getElementById('iep-modal')) {
            this.renderModal();
        }

        const modal = document.getElementById('iep-modal');
        modal.classList.add('is-active');
        IEP.justOpened = true;
        setTimeout(() => IEP.justOpened = false, 100);

        this.updateCode();

        modal.querySelector('#iep-show-featured').onchange = this.updateCode.bind(this);
        modal.querySelector('#iep-show-image').onchange = this.updateCode.bind(this);
        modal.querySelector('#iep-show-meta')?.addEventListener('change', this.updateCode.bind(this));
        modal.querySelector('#iep-show-review')?.addEventListener('change', this.updateCode.bind(this));
        modal.querySelector('#iep-theme').onchange = this.updateCode.bind(this);
    },

    closeModal() {
        const modal = document.getElementById('iep-modal');
        modal.classList.remove('is-active');
    },

    renderModal() {
        const i18n = InitEmbedPostsSettings?.i18n || {};

        // Determine theme for modal
        let modalClass = 'iep-modal';
        const globalTheme = window.InitPluginSuiteEmbedPostsConfig?.theme || 'light';

        if (
            globalTheme === 'dark' ||
            (globalTheme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)
        ) {
            modalClass += ' iep-dark';
        }

        const html = `
            <div id="iep-modal" class="${modalClass}">
                <div class="iep-modal-content">
                    <button type="button" class="iep-modal-close" onclick="IEP.closeModal()">
                        <svg width="20" height="20" viewBox="0 0 24 24"><path d="m21 21-9-9m0 0L3 3m9 9 9-9m-9 9-9 9" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"></path></svg>
                    </button>
                    <h3 class="init-embed-title">${i18n.embed_this_post || 'Embed this post'}</h3>

                    <label><input type="checkbox" id="iep-show-featured" checked> ${i18n.show_featured || 'Show featured image'}</label>
                    <label><input type="checkbox" id="iep-show-meta" checked> ${i18n.show_meta || 'Show post meta'}</label>
                    <label><input type="checkbox" id="iep-show-image" checked> ${i18n.show_image || 'Show image'}</label>
                    ${document.querySelector('.init-review-system') ? `
                    <label><input type="checkbox" id="iep-show-review" checked> ${i18n.show_review || 'Show review'}</label>
                    ` : ''}

                    <label>
                        ${i18n.theme || 'Theme:'}
                        <select id="iep-theme">
                            <option value="light">${i18n.light || 'Light'}</option>
                            <option value="dark">${i18n.dark || 'Dark'}</option>
                            <option value="auto">${i18n.auto || 'Auto'}</option>
                        </select>
                    </label>

                    <textarea id="iep-code" readonly></textarea>
                    <button type="button" onclick="IEP.copyCode()">${i18n.copy || 'Copy'}</button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', html);
    },

    updateCode() {
        const id = this.postId;
        const featuredCheckbox = document.getElementById('iep-show-featured');
        const imageCheckbox = document.getElementById('iep-show-image');
        const themeSelect = document.getElementById('iep-theme');
        const textarea = document.getElementById('iep-code');

        if (!id || !featuredCheckbox || !imageCheckbox || !themeSelect || !textarea) return;

        const showFeatured = featuredCheckbox.checked;
        const metaCheckbox = document.getElementById('iep-show-meta');
        const showImage = imageCheckbox.checked;
        const reviewCheckbox = document.getElementById('iep-show-review');
        const theme = themeSelect.value;

        const wrapper = document.querySelector(`.iep-embed-ui[data-id="${id}"]`);
        const type = wrapper?.dataset?.type || 'post';
        const cartText = wrapper?.dataset?.cart;
        const origin = location.origin;

        let attrs = `data-id="${id}" data-origin="${origin}"`;
        if (!showFeatured) attrs += ` data-featured="0"`;
        if (metaCheckbox && !metaCheckbox.checked) attrs += ` data-meta="0"`;
        if (!showImage) attrs += ` data-image="0"`;
        if (reviewCheckbox && !reviewCheckbox.checked) attrs += ` data-review="0"`;
        if (theme !== 'light') attrs += ` data-theme="${theme}"`;
        if (type !== 'post') attrs += ` data-type="${type}"`;
        if (cartText) attrs += ` data-cart="${cartText}"`;

        const script = type === 'product' ? this.productScriptUrl : this.scriptUrl;
        const wrapperClass = type === 'product' ? 'init-embed-product' : 'init-embed';

        const embed = `<div class="${wrapperClass}" ${attrs}></div>\n<script async src="${script}"></script>`;
        textarea.value = embed;
    },

    copyCode() {
        const textarea = document.getElementById('iep-code');
        if (!textarea) return;
        textarea.select();
        document.execCommand('copy');
        this.toast(InitEmbedPostsSettings?.i18n?.copied || 'Embed code copied!');
    },

    toast(message = 'Copied!') {
        const existing = document.getElementById('iep-toast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'iep-toast';
        toast.textContent = message;
        Object.assign(toast.style, {
            position: 'fixed',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#111',
            color: '#fff',
            padding: '10px 20px',
            fontSize: '14px',
            borderRadius: '6px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: '10000',
            opacity: '0',
            transition: 'opacity 0.3s ease'
        });

        document.body.appendChild(toast);
        setTimeout(() => toast.style.opacity = '1', 10);
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
};

// ESC để đóng modal
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') IEP.closeModal();
});

// Click ngoài modal
document.addEventListener('click', e => {
    const modal = document.getElementById('iep-modal');

    if (!modal || !modal.classList.contains('is-active') || IEP.justOpened) return;

    const content = modal.querySelector('.iep-modal-content');
    if (content && !content.contains(e.target)) {
        IEP.closeModal();
    }
});
