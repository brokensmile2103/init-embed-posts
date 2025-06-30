<?php
/**
 * Plugin Name: Init Embed Posts
 * Plugin URI: https://inithtml.com/plugin/init-embed-posts/
 * Description: Embed any WordPress post externally like a Twitter Card. No iframe, no shortcode – just pure magic.
 * Version: 1.2
 * Author: Init HTML
 * Author URI: https://inithtml.com/
 * Text Domain: init-embed-posts
 * Domain Path: /languages
 * Requires at least: 5.5
 * Tested up to: 6.8
 * Requires PHP: 7.4
 * License: GPLv2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 */

defined( 'ABSPATH' ) || exit;

// Define constants.
define( 'INIT_PLUGIN_SUITE_IEP_VERSION',        '1.2' );
define( 'INIT_PLUGIN_SUITE_IEP_SLUG',           'init-embed-posts' );
define( 'INIT_PLUGIN_SUITE_IEP_OPTION',         'init_plugin_suite_embed_posts_settings' );
define( 'INIT_PLUGIN_SUITE_IEP_NAMESPACE',      'initempo/v1' );

define( 'INIT_PLUGIN_SUITE_IEP_URL',            plugin_dir_url( __FILE__ ) );
define( 'INIT_PLUGIN_SUITE_IEP_PATH',           plugin_dir_path( __FILE__ ) );
define( 'INIT_PLUGIN_SUITE_IEP_ASSETS_URL',     INIT_PLUGIN_SUITE_IEP_URL . 'assets/' );
define( 'INIT_PLUGIN_SUITE_IEP_ASSETS_PATH',    INIT_PLUGIN_SUITE_IEP_PATH . 'assets/' );
define( 'INIT_PLUGIN_SUITE_IEP_TEMPLATES_PATH', INIT_PLUGIN_SUITE_IEP_PATH . 'templates/' );
define( 'INIT_PLUGIN_SUITE_IEP_INCLUDES_PATH',  INIT_PLUGIN_SUITE_IEP_PATH . 'includes/' );

// Load includes.
require_once INIT_PLUGIN_SUITE_IEP_INCLUDES_PATH . 'rest-api.php';
require_once INIT_PLUGIN_SUITE_IEP_INCLUDES_PATH . 'embed-generator.php';
require_once INIT_PLUGIN_SUITE_IEP_INCLUDES_PATH . 'utils.php';

if ( is_admin() ) {
    require_once INIT_PLUGIN_SUITE_IEP_INCLUDES_PATH . 'settings-page.php';
}

/**
 * Enqueue frontend assets.
 */
function init_plugin_suite_embed_posts_enqueue_assets() {
    wp_enqueue_style(
        'init-embed-ui',
        INIT_PLUGIN_SUITE_IEP_ASSETS_URL . 'css/style.css',
        [],
        INIT_PLUGIN_SUITE_IEP_VERSION
    );

    wp_enqueue_script(
        'init-embed-ui',
        INIT_PLUGIN_SUITE_IEP_ASSETS_URL . 'js/init-embed-ui.js',
        [],
        INIT_PLUGIN_SUITE_IEP_VERSION,
        true
    );

    $config = [
        'embed_url'        => INIT_PLUGIN_SUITE_IEP_ASSETS_URL . 'js/init-embed.js?v=' . INIT_PLUGIN_SUITE_IEP_VERSION,
        'product_url'      => INIT_PLUGIN_SUITE_IEP_ASSETS_URL . 'js/init-embed-product.js?v=' . INIT_PLUGIN_SUITE_IEP_VERSION,
        'i18n'             => [
            'copied' => __( 'Embed code copied!', 'init-embed-posts' ),
        ],
    ];

    wp_localize_script( 'init-embed-ui', 'InitEmbedPostsSettings', $config );
}
add_action( 'wp_enqueue_scripts', 'init_plugin_suite_embed_posts_enqueue_assets' );

/**
 * Render embed modal in footer.
 */
function init_plugin_suite_embed_posts_render_modal() {
    include INIT_PLUGIN_SUITE_IEP_TEMPLATES_PATH . 'modal-embed-code.php';
}
add_action( 'wp_footer', 'init_plugin_suite_embed_posts_render_modal', 20 );
