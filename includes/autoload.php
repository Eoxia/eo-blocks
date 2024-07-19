<?php
/**
 * Autoloader pour le plugin Mon Plugin.
 */

spl_autoload_register(function ($class) {

	// Project-specific namespace prefix
	$prefix = 'EoBlocks\\';

	// Base directory for the namespace prefix
	$base_dir = __DIR__ . '/';

	// Check if the class use the namespace prefix?
	$len = strlen($prefix);
	if (strncmp($prefix, $class, $len) !== 0) {
		return;
	}

	// Get the relative class name
	$relative_class = substr($class, $len);

	// Decompose file name and file path.
	$last_slash_pos = strrpos($relative_class, '\\');
	$class_name = substr($relative_class, $last_slash_pos + 1);
	$file_name = str_replace('_', '-', $class_name);
	$file_name = 'class-' . strtolower( $file_name ) . '.php';
	$file_path = strtolower( substr($relative_class, 0, $last_slash_pos) );

	// Replace the namespace prefix with the base directory, replace namespace
	// separators with directory separators in the relative class name, append
	// with .php
	$file = EO_BLOCKS_PATH . '\\' . $file_path . '\\' . $file_name;

	// If the file exists, require it
	if (file_exists($file)) {
		require $file;
	}
});
