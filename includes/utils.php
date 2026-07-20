<?php
defined( 'ABSPATH' ) || exit;

/**
 * Lấy số lượng ảnh gallery tối đa cho embed card (post & product).
 *
 * @return int Giới hạn số ảnh, trong khoảng 1–10.
 */
function init_plugin_suite_embed_posts_get_gallery_limit() {
    $limit = (int) get_option( 'init_embed_gallery_limit', 5 );

    if ( $limit < 1 || $limit > 10 ) {
        $limit = 5;
    }

    /**
     * Filters the gallery image limit used when extracting images for embed cards.
     *
     * @param int $limit Number of images to include.
     */
    return (int) apply_filters( 'init_plugin_suite_embed_posts_gallery_limit', $limit );
}

/**
 * Extract image URLs from post content.
 *
 * @param string $content HTML content.
 * @param int    $limit   Max number of images to return.
 * @return array Array of image URLs.
 */
function init_plugin_suite_embed_posts_extract_images( $content, $limit = 3 ) {
    $image_urls = [];

    if ( empty( $content ) ) {
        return apply_filters(
            'init_plugin_suite_embed_posts_extracted_images',
            $image_urls,
            $content,
            $limit
        );
    }

    $limit = max( 1, absint( $limit ) );

    if ( preg_match_all( '/<img[^>]+src=["\']([^"\']+)["\']/i', $content, $matches ) ) {
        foreach ( $matches[1] as $url ) {
            if ( count( $image_urls ) >= $limit ) {
                break;
            }

            $url = trim( $url );

            if ( $url === '' ) {
                continue;
            }

            // Tránh base64 / blob nếu lỡ có trong content
            if ( strpos( $url, 'data:' ) === 0 || strpos( $url, 'blob:' ) === 0 ) {
                continue;
            }

            $url = esc_url_raw( $url );

            if ( $url && ! in_array( $url, $image_urls, true ) ) {
                $image_urls[] = $url;
            }
        }
    }

    /**
     * Filters the extracted image URLs from post content.
     *
     * @param array  $image_urls Extracted image URLs.
     * @param string $content    Original post content.
     * @param int    $limit      Max number of images to return.
     */
    return apply_filters(
        'init_plugin_suite_embed_posts_extracted_images',
        $image_urls,
        $content,
        $limit
    );
}
