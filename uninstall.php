<?php
defined( 'WP_UNINSTALL_PLUGIN' ) || exit;

// Delete the plugin options.
delete_option( 'init_embed_insert_locations' );
delete_option( 'init_embed_gallery_limit' );
delete_option( 'init_embed_default_theme' );
