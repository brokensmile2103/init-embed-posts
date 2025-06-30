<?php
defined( 'WP_UNINSTALL_PLUGIN' ) || exit;

// Delete the plugin option.
delete_option( 'init_embed_insert_locations' );
