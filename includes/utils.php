<?php
defined( 'ABSPATH' ) || exit;

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
        return $image_urls;
    }

    if ( preg_match_all( '/<img[^>]+src=["\']([^"\']+)["\']/i', $content, $matches ) ) {
        $image_urls = array_unique( $matches[1] );
        $image_urls = array_slice( $image_urls, 0, $limit );
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
