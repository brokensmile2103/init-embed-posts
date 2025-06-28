<?php
defined( 'ABSPATH' ) || exit;

/**
 * Render nút embed qua shortcode [init_embed_code]
 */
function init_plugin_suite_embed_posts_render_button( $atts = [] ) {
    global $post;
    if ( ! $post || empty( $post->ID ) ) return '';

    $post_id   = (int) $post->ID;
    $post_type = get_post_type( $post_id );

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
    return ob_get_clean();
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
