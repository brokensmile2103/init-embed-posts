<?php
defined( 'ABSPATH' ) || exit;

/**
 * Render nút embed qua shortcode [init_embed_code]
 */
function init_plugin_suite_embed_posts_render_button( $atts = [] ) {
    static $assets_loaded = false;

    global $post;
    if ( ! $post || empty( $post->ID ) ) return '';

    $post_id   = (int) $post->ID;
    $post_type = get_post_type( $post_id );

    if ( ! $assets_loaded ) {

        wp_enqueue_script(
            'init-embed-ui',
            INIT_PLUGIN_SUITE_IEP_ASSETS_URL . 'js/init-embed-ui.js',
            [],
            INIT_PLUGIN_SUITE_IEP_VERSION,
            true
        );

        wp_localize_script(
            'init-embed-ui',
            'InitEmbedPostsSettings',
            [
                'embed_url'   => INIT_PLUGIN_SUITE_IEP_ASSETS_URL . 'js/init-embed.js?v=' . INIT_PLUGIN_SUITE_IEP_VERSION,
                'product_url' => INIT_PLUGIN_SUITE_IEP_ASSETS_URL . 'js/init-embed-product.js?v=' . INIT_PLUGIN_SUITE_IEP_VERSION,
                'i18n'        => [
                    'copied'          => __( 'Embed code copied!', 'init-embed-posts' ),
                    'embed_this_post' => __( 'Embed this post', 'init-embed-posts' ),
                    'show_featured'   => __( 'Show featured image', 'init-embed-posts' ),
                    'show_meta'       => __( 'Show post meta', 'init-embed-posts' ),
                    'show_image'      => __( 'Show image', 'init-embed-posts' ),
                    'show_review'     => __( 'Show review', 'init-embed-posts' ),
                    'theme'           => __( 'Theme:', 'init-embed-posts' ),
                    'light'           => __( 'Light', 'init-embed-posts' ),
                    'dark'            => __( 'Dark', 'init-embed-posts' ),
                    'auto'            => __( 'Auto', 'init-embed-posts' ),
                    'copy'            => __( 'Copy', 'init-embed-posts' ),
                ],
            ]
        );

        $assets_loaded = true;
    }

    ob_start();
    ?>
    <div class="iep-embed-ui"
         data-id="<?php echo esc_attr( $post_id ); ?>"
         data-type="<?php echo esc_attr( $post_type ); ?>">
        <button type="button"
                class="iep-copy-btn"
                onclick="IEP.openModal(this)"
                aria-label="<?php echo esc_attr__( 'Copy embed code', 'init-embed-posts' ); ?>">
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
                <polyline fill="none" stroke="currentColor" stroke-width="1" points="13,4 19,10 13,16"></polyline>
                <polyline fill="none" stroke="currentColor" stroke-width="1" points="7,4 1,10 7,16"></polyline>
            </svg>
        </button>
    </div>
    <?php

    /**
     * Filter HTML output của embed shortcode
     * 
     * @param string $html      HTML output
     * @param int    $post_id   Post ID
     * @param string $post_type Post type
     * @param array  $atts      Shortcode attributes
     */
    return apply_filters(
        'init_plugin_suite_embed_posts_shortcode_html',
        ob_get_clean(),
        $post_id,
        $post_type,
        $atts
    );
}

/**
 * Auto inject shortcode vào nội dung bài viết
 */
function init_plugin_suite_embed_posts_maybe_inject_content( $content ) {
    if ( ! is_singular() || ! in_the_loop() || ! is_main_query() ) return $content;

    $locations = get_option( 'init_embed_insert_locations', [] );
    $locations = apply_filters( 'init_embed_insert_locations', $locations );

    if ( empty( $locations ) || ! is_array( $locations ) ) return $content;

    $embed = do_shortcode( '[init_embed_code]' );

    if ( in_array( 'after_title', $locations, true ) ) {
        $content = preg_replace( '/(<h1[^>]*?>.*?<\/h1>)/i', '$1' . $embed, $content, 1 );
    }

    if ( in_array( 'before_content', $locations, true ) ) {
        $content = $embed . $content;
    }

    if ( in_array( 'after_content', $locations, true ) ) {
        $content .= $embed;
    }

    return $content;
}

/**
 * Auto inject vào trang sản phẩm WooCommerce
 */
function init_plugin_suite_embed_posts_maybe_inject_wc_product_meta( $html ) {
    if ( ! is_singular( 'product' ) ) return $html;

    $locations = get_option( 'init_embed_insert_locations', [] );
    $locations = apply_filters( 'init_embed_insert_locations', $locations );

    if ( in_array( 'after_product_meta', $locations, true ) ) {
        $html .= do_shortcode( '[init_embed_code]' );
    }

    return $html;
}

// Hooks
add_shortcode( 'init_embed_code', 'init_plugin_suite_embed_posts_render_button' );
add_filter( 'the_content', 'init_plugin_suite_embed_posts_maybe_inject_content' );

if ( class_exists( 'WooCommerce' ) ) {
    add_filter( 'woocommerce_product_meta_end', 'init_plugin_suite_embed_posts_maybe_inject_wc_product_meta' );
}
