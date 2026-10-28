=== EO Blocks ===
Contributors:      Eoxia
Tags:              block, gutenberg
Requires at least: 7.0.0
Tested up to:      7.1.0
Requires PHP:      7.4
Stable tag:        2.1.0
License:           GPL-3.0
License URI:       https://www.gnu.org/licenses/gpl-3.0.html

A collection of Gutenberg blocks for WordPress made by Eoxia

== Description ==

Transform your WordPress experience with our versatile Gutenberg Block Collection Plugin.
EO Blocks offers an extensive range of customizable blocks, making it easier than ever to create dynamic, professional websites and interfaces.

- Wide Variety of Blocks
- Compatible with Dolibarr
- User-Friendly Interface
- Highly Customizable
- Responsive Design

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/eo-blocks` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress

== Frequently Asked Questions ==

= Where can I contribute to the plugin? =

All development for this plugin is open source and handled via [GitHub](https://github.com/Eoxia/eo-blocks) any issues or pull requests should be posted there.

== Changelog ==

= 2.1.0 =
* New block EO Gallery: images and videos displayed as a grid, a masonry or a carousel, with a lightbox (zoom, keyboard navigation), captions, crop/aspect ratio, hover zoom and normal/reverse/random order.
* Add a "Convert to EO Gallery" button on the native Gallery block (two-way transform, same media and order).
* New Reviews blocks: Google Reviews (count, rating, review card and review prompt), Trustpilot, TripAdvisor and TheFork, with a dedicated settings page and live preview in the editor.
* Add Google Business Profile API (OAuth 2.0) to bypass the native 5 reviews limit, and a setting to choose the number of reviews to display.
* New Map block features: multilingual OpenFreeMap basemap with a design picker, min/max zoom range, advanced marker options (type, color, animation), markdown headings/descriptions and custom link labels for markers.
* Redesign the Carousel block editing UX: drag the dots to reorder slides, insertion bars, virtual "add a slide" slot.
* Add center, autoHeight and arrows position (over or outside the slides) settings on the Carousel block.
* Add entrance/exit CSS animations to the Styles panel of all blocks.
* Add responsive breakpoint display control on all blocks.
* Add responsive columns control on the Columns block.
* Add mobile breakpoint control on the Navigation block.
* Add a "Text shadow" control on Paragraph blocks (Border & Shadow panel): presets and custom offsets, blur and color.
* Add optional FAQPage schema.org markup on the Accordion block.
* Add WPML compatibility.
* Fix Carousel entrance/exit animations.
* Fix nested carousels picking up the arrows of their parent carousel.
* Fix Google OAuth tokens being lost when saving the reviews settings.
* Fix plugin assets being kept in browser cache after an update.

= 2.0.0 =
* New block Map: OpenStreetMap maps (Leaflet) with a map manager in the admin.
* Add mobile options and span element support on the Summary block.
* Fix scroll on the Summary block.

= 1.2.0 =
* New naming convention for blocks: eo/ becomes eo-blocks/ to comply with the WordPress standard. Migration script added.
* New block Search: opens a search bar in a popup, with the ability to filter by post type.
* New block Tabs: organize content in tabbed sections directly in the editor.
* New block Marquee: display scrolling content with a configurable marquee effect.
* Add thumbnail pagination option on the Carousel block.
* Add custom link support on Group blocks.
* Add custom link support on Cover blocks.
* Add custom title size option on the Accordion block.
* Fix rendering issue with shortcodes and external blocks (e.g. Gravity Forms) inside the Tabs block.
* Fix search results display in the Search block.
* Remove Dashicons dependency in the Accordion block, replaced by an inline SVG (performance improvement).

= 1.1.0 =
* New block Carousel.
* New block Summary.
* New block Sticky.
* New block FAQ.
* New block Accordion.
* New block Digirisk - List risk.
* Add new block category named "EO Blocks" containing all blocks.
* Fix bug notice in settings page.
* Fix fatal error with autoloading file.

= 1.0.0 =
* Release

== Upgrade Notice ==

= 1.1.0 =
A lot of new blocks added.

= 1.0.0 =
Release of the plugin.
