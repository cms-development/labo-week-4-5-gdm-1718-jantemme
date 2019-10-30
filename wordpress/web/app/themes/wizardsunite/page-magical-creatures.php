<?php
/**
 * The Template for displaying all single posts
 *
 * Methods for TimberHelper can be found in the /lib sub-directory
 *
 * @package  WordPress
 * @subpackage  Timber
 * @since    Timber 0.1
 */

$args = array(
    // Get post type project
    'post_type' => 'post',
    );

$context         = Timber::context();
$context['post'] = Timber::get_posts(array('post_type'=>'page'));
$context['wizardsunite_logo_url'] = wp_get_attachment_image_url( get_theme_mod('custom_logo'), 'full');
$context['wizardsunite_header_image_url'] = get_header_image();
$context['creatures'] = Timber::get_posts($args);

Timber::render( 'page-magical-creatures.twig', $context );