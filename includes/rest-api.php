<?php
defined( 'ABSPATH' ) || exit;

/**
 * Đăng ký REST API endpoints cho post và product
 */
function init_plugin_suite_embed_posts_register_rest_routes() {
    register_rest_route( INIT_PLUGIN_SUITE_IEP_NAMESPACE, '/post/(?P<id>\d+)', [
        'methods'             => 'GET',
        'callback'            => 'init_plugin_suite_embed_posts_get_post_data',
        'permission_callback' => '__return_true',
    ] );

    register_rest_route( INIT_PLUGIN_SUITE_IEP_NAMESPACE, '/product/(?P<id>\d+)', [
        'methods'             => 'GET',
        'callback'            => 'init_plugin_suite_embed_posts_get_product_data',
        'permission_callback' => '__return_true',
    ] );
}
add_action( 'rest_api_init', 'init_plugin_suite_embed_posts_register_rest_routes' );

/**
 * Trả về dữ liệu embed cho post
 */
function init_plugin_suite_embed_posts_get_post_data( $request ) {
    $post_id = absint( $request['id'] );
    $post    = get_post( $post_id );

    if ( ! $post || $post->post_status !== 'publish' ) {
        return new WP_REST_Response( [ 'error' => __( 'Post not found', 'init-embed-posts' ) ], 404 );
    }

    $site_name   = get_bloginfo( 'name' );
    $site_url    = home_url();
    $site_domain = wp_parse_url( $site_url, PHP_URL_HOST );

    $favicon = apply_filters(
        'init_plugin_suite_embed_posts_favicon_url',
        get_site_icon_url( 64 ),
        $post
    ) ?: INIT_PLUGIN_SUITE_IEP_URL . 'assets/img/default-favicon.svg';

    $raw_excerpt = apply_filters(
        'init_plugin_suite_embed_posts_excerpt',
        get_the_excerpt( $post ),
        $post
    );

    $images = apply_filters(
        'init_plugin_suite_embed_posts_images',
        init_plugin_suite_embed_posts_extract_images( $post->post_content, 5 ),
        $post
    );

    $response = [
        'id'            => $post_id,
        'title'         => get_the_title( $post ),
        'excerpt'       => wp_trim_words( $raw_excerpt, 40, '…' ),
        'published_at'  => get_the_date( 'c', $post_id ),
        'url'           => get_permalink( $post_id ),
        'favicon'       => $favicon,
        'site_name'     => $site_name,
        'site_url'      => $site_url,
        'site_domain'   => $site_domain,
        'thumbnail'     => get_the_post_thumbnail_url( $post_id, 'medium_large' ),
        'images'        => $images,
    ];

    $response = apply_filters( 'init_plugin_suite_embed_posts_rest_response', $response, $post );

    return new WP_REST_Response( $response, 200, [
        'Cache-Control' => 'public, max-age=31536000, immutable',
    ] );
}

/**
 * Trả về dữ liệu embed cho sản phẩm WooCommerce
 */
function init_plugin_suite_embed_posts_get_product_data( $request ) {
    $product_id = absint( $request['id'] );
    $product    = wc_get_product( $product_id );

    if ( ! $product || $product->get_status() !== 'publish' ) {
        return new WP_REST_Response( [ 'error' => __( 'Product not found', 'init-embed-posts' ) ], 404 );
    }

    $post = get_post( $product_id );

    $site_name   = get_bloginfo( 'name' );
    $site_url    = home_url();
    $site_domain = wp_parse_url( $site_url, PHP_URL_HOST );

    $favicon = apply_filters(
        'init_plugin_suite_embed_products_favicon_url',
        get_site_icon_url( 64 ),
        $product
    ) ?: INIT_PLUGIN_SUITE_IEP_URL . 'assets/img/default-favicon.svg';

    $raw_excerpt = apply_filters(
        'init_plugin_suite_embed_products_excerpt',
        get_the_excerpt( $product_id ),
        $product
    );

    $images = apply_filters(
        'init_plugin_suite_embed_products_images',
        init_plugin_suite_embed_posts_extract_images( $post->post_content, 5 ),
        $product
    );

    $price         = (float) $product->get_price();
    $regular_price = (float) $product->get_regular_price();
    $sale_price    = (float) $product->get_sale_price();
    $currency      = get_woocommerce_currency();

    $response = [
        'id'            => $product_id,
        'title'         => $product->get_name(),
        'excerpt'       => wp_trim_words( $raw_excerpt, 40, '…' ),
        'published_at'  => get_the_date( 'c', $product_id ),
        'url'           => get_permalink( $product_id ),
        'favicon'       => $favicon,
        'site_name'     => $site_name,
        'site_url'      => $site_url,
        'site_domain'   => $site_domain,
        'thumbnail'     => get_the_post_thumbnail_url( $product_id, 'medium_large' ),
        'images'        => $images,

        // Woo-specific fields
        'price'         => max( 0, $price ),
        'regular_price' => max( 0, $regular_price ),
        'sale_price'    => max( 0, $sale_price ),
        'currency'      => $currency,
        'sku'           => $product->get_sku(),
        'on_sale'       => $product->is_on_sale(),
        'product_type'  => $product->get_type(),
    ];

    $response = apply_filters( 'init_plugin_suite_embed_products_rest_response', $response, $product );

    return new WP_REST_Response( $response, 200, [
        'Cache-Control' => 'public, max-age=31536000, immutable',
    ] );
}
