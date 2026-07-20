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
 * Tạo ETag dựa trên ID + thời điểm sửa đổi cuối (GMT), và trả về response 304
 * nếu client đã có bản mới nhất (theo header If-None-Match).
 *
 * @param WP_REST_Request $request       Request hiện tại.
 * @param string           $cache_key     Tiền tố khoá cache, ví dụ 'post-123'.
 * @param string           $modified_gmt  post_modified_gmt (MySQL datetime) của item.
 * @return WP_REST_Response|null Trả về response 304 nếu khớp ETag, ngược lại null.
 */
function init_plugin_suite_embed_posts_maybe_304( $request, $cache_key, $modified_gmt ) {
    $etag = '"' . md5( $cache_key . '|' . $modified_gmt ) . '"';

    $if_none_match = $request->get_header( 'if_none_match' );

    if ( $if_none_match && trim( $if_none_match ) === $etag ) {
        $response = new WP_REST_Response( null, 304 );
        $response->header( 'ETag', $etag );
        $response->header( 'Cache-Control', 'public, max-age=31536000' );
        return $response;
    }

    return null;
}

/**
 * Trả về dữ liệu embed cho post
 */
function init_plugin_suite_embed_posts_get_post_data( $request ) {
    $post_id = absint( $request['id'] );
    $post    = get_post( $post_id );

    if ( ! $post || $post->post_status !== 'publish' ) {
        return new WP_REST_Response( [ 'error' => __( 'Post not found', 'init-embed-posts' ) ], 404 );
    }

    $not_modified = init_plugin_suite_embed_posts_maybe_304( $request, 'post-' . $post_id, $post->post_modified_gmt );
    if ( $not_modified ) {
        return $not_modified;
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

    $gallery_limit = init_plugin_suite_embed_posts_get_gallery_limit();

    $images = apply_filters(
        'init_plugin_suite_embed_posts_images',
        init_plugin_suite_embed_posts_extract_images( $post->post_content, $gallery_limit ),
        $post
    );

    $response = [
        'id'            => $post_id,
        'title'         => get_the_title( $post ),
        'excerpt'       => wp_trim_words( $raw_excerpt, 40, '…' ),
        'published_at'  => human_time_diff( get_post_time( 'U', true, $post_id ), current_time( 'timestamp' ) ),
        'published_date'=> get_the_date( 'c', $post_id ),
        'modified_at'   => mysql_to_rfc3339( $post->post_modified_gmt ),
        'url'           => get_permalink( $post_id ),
        'favicon'       => $favicon,
        'site_name'     => $site_name,
        'site_url'      => $site_url,
        'site_domain'   => $site_domain,
        'thumbnail'     => get_the_post_thumbnail_url( $post_id, 'medium_large' ),
        'images'        => $images,
        'comment_count' => intval( get_comments_number( $post_id ) ),
    ];

    // Xác định key lượt xem theo độ ưu tiên
    $view_keys = [
        '_init_view_count',             // Init View Count
        '_jetpack_post_views_count',    // Jetpack
        'views',                        // WP-PostViews
        '_wp_statistics_visitor',       // WP Statistics
        'post_views_count',             // Post Views Counter
    ];

    // Cho phép filter bổ sung/thay đổi thứ tự key
    $view_keys = apply_filters( 'init_plugin_suite_embed_posts_view_count_keys', $view_keys, $post_id );

    // Lặp qua key và lấy cái đầu tiên có giá trị hợp lệ
    foreach ( $view_keys as $key ) {
        $val = get_post_meta( $post_id, $key, true );
        if ( is_numeric( $val ) ) {
            $response['view_count'] = intval( $val );
            break;
        }
    }

    if ( defined( 'INIT_PLUGIN_SUITE_RS_VERSION' ) && function_exists( 'init_plugin_suite_review_system_get_rating_data' ) ) {
        $response['review'] = init_plugin_suite_review_system_get_rating_data( $post_id );
    }

    $response = apply_filters( 'init_plugin_suite_embed_posts_rest_response', $response, $post );

    $etag = '"' . md5( 'post-' . $post_id . '|' . $post->post_modified_gmt ) . '"';

    return new WP_REST_Response( $response, 200, [
        // Không dùng "immutable": dữ liệu có thể thay đổi khi bài viết được sửa,
        // ETag ở trên giúp trình duyệt/CDN revalidate thay vì phục vụ bản cache cũ suốt 1 năm.
        'Cache-Control' => 'public, max-age=31536000',
        'ETag'           => $etag,
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

    $not_modified = init_plugin_suite_embed_posts_maybe_304( $request, 'product-' . $product_id, $post->post_modified_gmt );
    if ( $not_modified ) {
        return $not_modified;
    }

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

    $gallery_limit = init_plugin_suite_embed_posts_get_gallery_limit();

    $images = apply_filters(
        'init_plugin_suite_embed_products_images',
        init_plugin_suite_embed_posts_extract_images( $post->post_content, $gallery_limit ),
        $product
    );

    $price         = (float) $product->get_price();
    $regular_price = (float) $product->get_regular_price();
    $sale_price    = (float) $product->get_sale_price();
    $currency      = get_woocommerce_currency();

    // Khoảng giá cho sản phẩm variable (các biến thể có giá khác nhau).
    $price_min = null;
    $price_max = null;

    if ( $product->is_type( 'variable' ) ) {
        $variation_min = $product->get_variation_price( 'min', true );
        $variation_max = $product->get_variation_price( 'max', true );

        if ( $variation_min !== '' ) {
            $price_min = max( 0, (float) $variation_min );
        }

        if ( $variation_max !== '' ) {
            $price_max = max( 0, (float) $variation_max );
        }
    }

    $response = [
        'id'            => $product_id,
        'title'         => $product->get_name(),
        'excerpt'       => wp_trim_words( $raw_excerpt, 40, '…' ),
        'published_at'  => get_the_date( 'c', $product_id ),
        'modified_at'   => mysql_to_rfc3339( $post->post_modified_gmt ),
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
        'price_min'     => $price_min,
        'price_max'     => $price_max,
        'currency'      => $currency,
        'sku'           => $product->get_sku(),
        'on_sale'       => $product->is_on_sale(),
        'product_type'  => $product->get_type(),
    ];

    $response = apply_filters( 'init_plugin_suite_embed_products_rest_response', $response, $product );

    $etag = '"' . md5( 'product-' . $product_id . '|' . $post->post_modified_gmt ) . '"';

    return new WP_REST_Response( $response, 200, [
        'Cache-Control' => 'public, max-age=31536000',
        'ETag'           => $etag,
    ] );
}
