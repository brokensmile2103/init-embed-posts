<?php
defined( 'ABSPATH' ) || exit;

/**
 * Add settings page to admin menu
 */
function init_plugin_suite_embed_posts_add_settings_page() {
    add_options_page(
        __( 'Init Embed Posts Settings', 'init-embed-posts' ),
        __( 'Init Embed Posts', 'init-embed-posts' ),
        'manage_options',
        INIT_PLUGIN_SUITE_IEP_SLUG,
        'init_plugin_suite_embed_posts_render_settings_page'
    );
}
add_action( 'admin_menu', 'init_plugin_suite_embed_posts_add_settings_page' );

/**
 * Register plugin settings
 */
function init_plugin_suite_embed_posts_register_settings() {
    register_setting( 'init_embed_settings_group', 'init_embed_insert_locations', [
        'type'              => 'array',
        'sanitize_callback' => 'init_plugin_suite_embed_posts_sanitize_locations',
        'default'           => [],
    ] );

    register_setting( 'init_embed_settings_group', 'init_embed_gallery_limit', [
        'type'              => 'integer',
        'sanitize_callback' => 'init_plugin_suite_embed_posts_sanitize_gallery_limit',
        'default'           => 5,
    ] );

    register_setting( 'init_embed_settings_group', 'init_embed_default_theme', [
        'type'              => 'string',
        'sanitize_callback' => 'init_plugin_suite_embed_posts_sanitize_theme',
        'default'           => 'light',
    ] );
}
add_action( 'admin_init', 'init_plugin_suite_embed_posts_register_settings' );

/**
 * Sanitize selected locations
 */
function init_plugin_suite_embed_posts_sanitize_locations( $input ) {
    $valid = [ 'after_title', 'before_content', 'after_content' ];

    if ( class_exists( 'WooCommerce' ) ) {
        $valid[] = 'after_product_meta';
    }

    return array_values( array_intersect( (array) $input, $valid ) );
}

/**
 * Sanitize gallery image limit (1–10)
 */
function init_plugin_suite_embed_posts_sanitize_gallery_limit( $input ) {
    $value = absint( $input );

    if ( $value < 1 ) {
        $value = 1;
    } elseif ( $value > 10 ) {
        $value = 10;
    }

    return $value;
}

/**
 * Sanitize default theme (light|dark|auto)
 */
function init_plugin_suite_embed_posts_sanitize_theme( $input ) {
    $valid = [ 'light', 'dark', 'auto' ];

    return in_array( $input, $valid, true ) ? $input : 'light';
}

/**
 * Render the settings page UI
 */
function init_plugin_suite_embed_posts_render_settings_page() {
    $selected      = get_option( 'init_embed_insert_locations', [] );
    $gallery_limit = get_option( 'init_embed_gallery_limit', 5 );
    $default_theme = get_option( 'init_embed_default_theme', 'light' );
    ?>
    <div class="wrap">
        <h1><?php esc_html_e( 'Init Embed Posts Settings', 'init-embed-posts' ); ?></h1>

        <form method="post" action="options.php">
            <?php settings_fields( 'init_embed_settings_group' ); ?>

            <table class="form-table" role="presentation">
                <tr>
                    <th scope="row"><?php esc_html_e( 'Auto-insert embed button at', 'init-embed-posts' ); ?></th>
                    <td>
                        <fieldset>
                            <label>
                                <input type="checkbox" name="init_embed_insert_locations[]" value="after_title" <?php checked( in_array( 'after_title', $selected ) ); ?>>
                                <?php esc_html_e( 'After the title', 'init-embed-posts' ); ?>
                            </label><br>

                            <label>
                                <input type="checkbox" name="init_embed_insert_locations[]" value="before_content" <?php checked( in_array( 'before_content', $selected ) ); ?>>
                                <?php esc_html_e( 'Before the content', 'init-embed-posts' ); ?>
                            </label><br>

                            <label>
                                <input type="checkbox" name="init_embed_insert_locations[]" value="after_content" <?php checked( in_array( 'after_content', $selected ) ); ?>>
                                <?php esc_html_e( 'After the content', 'init-embed-posts' ); ?>
                            </label><br>

                            <?php if ( class_exists( 'WooCommerce' ) ) : ?>
                                <label>
                                    <input type="checkbox" name="init_embed_insert_locations[]" value="after_product_meta" <?php checked( in_array( 'after_product_meta', $selected ) ); ?>>
                                    <?php esc_html_e( 'After the product meta', 'init-embed-posts' ); ?>
                                </label>
                            <?php endif; ?>
                        </fieldset>
                        <p class="description">
                            <?php echo wp_kses_post( __( 'Alternatively, you can insert the embed button manually by adding the <code>[init_embed_code]</code> shortcode anywhere inside the loop.', 'init-embed-posts' ) ); ?>
                        </p>
                    </td>
                </tr>

                <tr>
                    <th scope="row">
                        <label for="init_embed_gallery_limit"><?php esc_html_e( 'Gallery image limit', 'init-embed-posts' ); ?></label>
                    </th>
                    <td>
                        <input type="number" min="1" max="10" step="1" id="init_embed_gallery_limit" name="init_embed_gallery_limit" value="<?php echo esc_attr( $gallery_limit ); ?>" class="small-text">
                        <p class="description">
                            <?php esc_html_e( 'Maximum number of images shown in the gallery row of an embed card (1–10).', 'init-embed-posts' ); ?>
                        </p>
                    </td>
                </tr>

                <tr>
                    <th scope="row">
                        <label for="init_embed_default_theme"><?php esc_html_e( 'Default embed theme', 'init-embed-posts' ); ?></label>
                    </th>
                    <td>
                        <select id="init_embed_default_theme" name="init_embed_default_theme">
                            <option value="light" <?php selected( $default_theme, 'light' ); ?>><?php esc_html_e( 'Light', 'init-embed-posts' ); ?></option>
                            <option value="dark" <?php selected( $default_theme, 'dark' ); ?>><?php esc_html_e( 'Dark', 'init-embed-posts' ); ?></option>
                            <option value="auto" <?php selected( $default_theme, 'auto' ); ?>><?php esc_html_e( 'Auto', 'init-embed-posts' ); ?></option>
                        </select>
                        <p class="description">
                            <?php esc_html_e( 'Theme pre-selected in the embed code generator modal. Visitors can still override it per embed via data-theme.', 'init-embed-posts' ); ?>
                        </p>
                    </td>
                </tr>
            </table>

            <?php submit_button(); ?>
        </form>
    </div>
    <?php
}
