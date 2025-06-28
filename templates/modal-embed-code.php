<?php if ( ! defined( 'ABSPATH' ) ) exit; ?>

<div id="iep-modal" class="iep-modal">
    <div class="iep-modal-content">
        <button type="button" class="iep-modal-close" onclick="IEP.closeModal()"><svg width="20" height="20" viewBox="0 0 24 24"><path d="m21 21-9-9m0 0L3 3m9 9 9-9m-9 9-9 9" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" stroke-linejoin="round"></path></svg></button>

        <h3 class="init-embed-title"><?php echo esc_html__( 'Embed this post', 'init-embed-posts' ); ?></h3>

        <label>
            <input type="checkbox" id="iep-show-featured" checked>
            <?php echo esc_html__( 'Show featured image', 'init-embed-posts' ); ?>
        </label>

        <label>
            <input type="checkbox" id="iep-show-image" checked>
            <?php echo esc_html__( 'Show image', 'init-embed-posts' ); ?>
        </label>

        <label>
            <?php echo esc_html__( 'Theme:', 'init-embed-posts' ); ?>
            <select id="iep-theme">
                <option value="light"><?php echo esc_html__( 'Light', 'init-embed-posts' ); ?></option>
                <option value="dark"><?php echo esc_html__( 'Dark', 'init-embed-posts' ); ?></option>
                <option value="auto"><?php echo esc_html__( 'Auto', 'init-embed-posts' ); ?></option>
            </select>
        </label>

        <textarea id="iep-code" readonly></textarea>

        <button type="button" onclick="IEP.copyCode()">
            <?php echo esc_html__( 'Copy', 'init-embed-posts' ); ?>
        </button>
    </div>
</div>
