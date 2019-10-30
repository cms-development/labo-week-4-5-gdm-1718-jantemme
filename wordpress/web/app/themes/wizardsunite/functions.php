<?php
/**
 * Timber starter-theme
 * https://github.com/timber/starter-theme
 *
 * @package  WordPress
 * @subpackage  Timber
 * @since   Timber 0.1
 */

/**
 * If you are installing Timber as a Composer dependency in your theme, you'll need this block
 * to load your dependencies and initialize Timber. If you are using Timber via the WordPress.org
 * plug-in, you can safely delete this block.
 */
$composer_autoload = __DIR__ . '/vendor/autoload.php';
if ( file_exists( $composer_autoload ) ) {
	require_once $composer_autoload;
	$timber = new Timber\Timber();
}

remove_filter ('the_content', 'wpautop'); 

add_action('rest_api_init', 'register_rest_images' );
function register_rest_images(){
    register_rest_field( array('post'),
        'fimg_url',
        array(
            'get_callback'    => 'get_rest_featured_image',
            'update_callback' => null,
            'schema'          => null,
        )
    );
}
function get_rest_featured_image( $object, $field_name, $request ) {
    if( $object['featured_media'] ){
        $img = wp_get_attachment_image_src( $object['featured_media'], 'app-thumb' );
        return $img[0];
    }
    return false;
}

function init() {
	add_filter( 'rest_prepare_creatures', [ $this, 'add_featured_image' ], 10, 2 );

}
function add_featured_image( $data, $post ) {
	$sizes        = [ 'thumbnail' => '', 'medium' => '', 'large' => '', 'full' => '' ];
	$_data        = $data->data;
	$thumbnail_id = get_post_thumbnail_id( $post->ID );
	foreach ( $sizes as $size => $src ) {
		$sizes[ $size ] = wp_get_attachment_image_src( $thumbnail_id, $size )[0];
	}
	$_data['featured_image_url'] = $sizes;
	$data->data                  = $_data;
	return $data;
}

add_theme_support( 'custom-logo' );

function create_posttype() {
	register_post_type( 'creatures',
	// CPT Options
	array(
	  'labels' => array(
	   'name' => __( 'creatures' ),
	   'singular_name' => __( 'Creatures' )
	  ),
	  'public' => true,
	  'has_archive' => false,
	  'rewrite' => array('slug' => 'creatures'),
	 )
	);
	}
	// Hooking up our function to theme setup
	add_action( 'init', 'create_posttype' );

function cw_post_type_news() {
	$supports = array(
	'title', // post title
	'editor', // post content
	'author', // post author
	'thumbnail', // featured images
	'featured-images',
	'custom-fields', // custom fields
	'revisions', // post revisions
	'post-formats', // post formats
	);
	$labels = array(
	'name' => _x('creatures', 'plural'),
	'singular_name' => _x('creature', 'singular'),
	'menu_name' => _x('creatures', 'admin menu'),
	'name_admin_bar' => _x('creatures', 'admin bar'),
	'add_new' => _x('Add New', 'add new'),
	'add_new_item' => __('Add New Creature'),
	'new_item' => __('New creatures'),
	'edit_item' => __('Edit creatures'),
	'view_item' => __('View creatures'),
	'all_items' => __('All creatures'),
	'search_items' => __('Search creatures'),
	'not_found' => __('No creatures found.'),
	);
	$args = array(
	'supports' => $supports,
	'labels' => $labels,
	'public' => true,
	'query_var' => true,
	'rewrite' => array('slug' => 'news'),
	'has_archive' => true,
	'hierarchical' => false,
	);
	register_post_type('news', $args);
}
		
	
add_action( 'init', 'my_creatures_cpt' );
function my_creatures_cpt() {
    $args = array(
      'public'       => true,
      'show_in_rest' => true,
      'label'        => 'Creatures'
    );
    register_post_type( 'creatures', $args );
}

add_action( 'rest_api_init', 'add_custom_fields' );
function add_custom_fields() {
	register_rest_field(
	'creatures', 
	'custom_fields', //New Field Name in JSON RESPONSEs
	array(
		'get_callback'    => 'get_custom_fields', // custom function name 
		'update_callback' => 'update_custom_fields',
		'schema'          => null,
		)
	);
}

add_action( 'rest_api_init', 'add_custom_fields_posts' );
function add_custom_fields_posts() {
	register_rest_field(
	'post', 
	'custom_fields', //New Field Name in JSON RESPONSEs
	array(
		'get_callback'    => 'get_custom_fields', // custom function name 
		'update_callback' => 'update_custom_fields',
		'schema'          => null,
		)
	);
}

function get_custom_fields( $object, $field_name, $request ) {
	$Id = $object['id'];
	return get_fields($Id);
}

function update_custom_fields( $value, $object, $field_name ) {

	if ( ! $value ) {
		return;
	}
	
	return update_post_meta( $object->ID, $field_name, $value );
}

/**
 * This ensures that Timber is loaded and available as a PHP class.
 * If not, it gives an error message to help direct developers on where to activate
 */
if ( ! class_exists( 'Timber' ) ) {

	add_action(
		'admin_notices',
		function() {
			echo '<div class="error"><p>Timber not activated. Make sure you activate the plugin in <a href="' . esc_url( admin_url( 'plugins.php#timber' ) ) . '">' . esc_url( admin_url( 'plugins.php' ) ) . '</a></p></div>';
		}
	);

	add_filter(
		'template_include',
		function( $template ) {
			return get_stylesheet_directory() . '/static/no-timber.html';
		}
	);
	return;
}

/**
 * Sets the directories (inside your theme) to find .twig files
 */
Timber::$dirname = array( 'templates', 'views' );

/**
 * By default, Timber does NOT autoescape values. Want to enable Twig's autoescape?
 * No prob! Just set this value to true
 */
Timber::$autoescape = false;


/**
 * We're going to configure our theme inside of a subclass of Timber\Site
 * You can move this to its own file and include here via php's include("MySite.php")
 */
class StarterSite extends Timber\Site {
	/** Add timber support. */
	public function __construct() {
		add_action( 'after_setup_theme', array( $this, 'theme_supports' ) );
		add_filter( 'timber/context', array( $this, 'add_to_context' ) );
		add_filter( 'timber/twig', array( $this, 'add_to_twig' ) );
		add_action( 'init', array( $this, 'register_post_types' ) );
		add_action( 'init', array( $this, 'register_taxonomies' ) );
		add_action( 'wp_enqueue_scripts', array( $this, 'loadScripts' ) );
		parent::__construct();
	}

	public function loadScripts() {
		// die('test');
		wp_enqueue_style('main', get_template_directory_uri() . '/assets/css/main.css', array(), '1.0.0');
	} 
	

	/** This is where you can register custom post types. */
	public function register_post_types() {

	}
	/** This is where you can register custom taxonomies. */
	public function register_taxonomies() {

	}

	/** This is where you add some context
	 *
	 * @param string $context context['this'] Being the Twig's {{ this }}.
	 */
	public function add_to_context( $context ) {
		$context['foo']   = 'bar';
		$context['stuff'] = 'I am a value set in your functions.php file';
		$context['notes'] = 'These values are available everytime you call Timber::context();';
		$context['menu']  = new Timber\Menu();
		$context['site']  = $this;
		return $context;
	}

	public function theme_supports() {
		// Add default posts and comments RSS feed links to head.
		add_theme_support( 'automatic-feed-links' );

		/*
		 * Let WordPress manage the document title.
		 * By adding theme support, we declare that this theme does not use a
		 * hard-coded <title> tag in the document head, and expect WordPress to
		 * provide it for us.
		 */
		add_theme_support( 'title-tag' );

		/*
		 * Enable support for Post Thumbnails on posts and pages.
		 *
		 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
		 */
		add_theme_support( 'post-thumbnails' );

		/*
		 * Switch default core markup for search form, comment form, and comments
		 * to output valid HTML5.
		 */
		add_theme_support(
			'html5',
			array(
				'comment-form',
				'comment-list',
				'gallery',
				'caption',
			)
		);

		/*
		 * Enable support for Post Formats.
		 *
		 * See: https://codex.wordpress.org/Post_Formats
		 */
		add_theme_support(
			'post-formats',
			array(
				'aside',
				'image',
				'video',
				'quote',
				'link',
				'gallery',
				'audio',
			)
		);

		add_theme_support( 'menus' );
	}

	/** This Would return 'foo bar!'.
	 *
	 * @param string $text being 'foo', then returned 'foo bar!'.
	 */
	public function myfoo( $text ) {
		$text .= ' bar!';
		return $text;
	}

	/** This is where you can add your own functions to twig.
	 *
	 * @param string $twig get extension.
	 */
	public function add_to_twig( $twig ) {
		$twig->addExtension( new Twig\Extension\StringLoaderExtension() );
		$twig->addFilter( new Twig\TwigFilter( 'myfoo', array( $this, 'myfoo' ) ) );
		return $twig;
	}

}

new StarterSite();
