<?php
$wrapper_attributes = get_block_wrapper_attributes();
$use_api = isset( $attributes['useApi'] ) ? $attributes['useApi'] : true;
$layout = isset( $attributes['layout'] ) ? $attributes['layout'] : 'grid';
$shape = isset( $attributes['shape'] ) ? $attributes['shape'] : 'rectangle';
$width = isset( $attributes['width'] ) ? $attributes['width'] : '100%';
$height = isset( $attributes['height'] ) ? $attributes['height'] : 'auto';
$showPhoto = isset( $attributes['showPhoto'] ) ? $attributes['showPhoto'] : true;
$showName = isset( $attributes['showName'] ) ? $attributes['showName'] : true;
$showStars = isset( $attributes['showStars'] ) ? $attributes['showStars'] : true;
$showDate = isset( $attributes['showDate'] ) ? $attributes['showDate'] : true;
$showText = isset( $attributes['showText'] ) ? $attributes['showText'] : true;
$textLimit = isset( $attributes['textLimit'] ) ? (int) $attributes['textLimit'] : 150;

$reviews = array();
if ( $use_api && class_exists( '\EoBlocks\Includes\Eoblocks_Reviews_API' ) ) {
	$api_data = \EoBlocks\Includes\Eoblocks_Reviews_API::get_google_data();
	if ( $api_data && ! empty( $api_data['reviews'] ) ) {
		$reviews = $api_data['reviews'];
	}
}

// Swiper classes if carousel
$container_class = 'eo-review-container layout-' . esc_attr( $layout ) . ' shape-' . esc_attr( $shape );
$wrapper_class = '';
$slide_class = 'eo-review-card';

if ( $layout === 'carousel' ) {
	$container_class .= ' swiper eo-review-swiper';
	$wrapper_class = 'swiper-wrapper';
	$slide_class .= ' swiper-slide';
} else {
    $wrapper_class = 'eo-review-grid';
}
?>
<div <?php echo $wrapper_attributes; ?>>
	<div class="<?php echo esc_attr( $container_class ); ?>">
		<div class="<?php echo esc_attr( $wrapper_class ); ?>">
			<?php if ( empty( $reviews ) ) : ?>
				<p><?php esc_html_e( 'Aucun avis à afficher.', 'eo-blocks' ); ?></p>
			<?php else : ?>
				<?php foreach ( $reviews as $review ) : ?>
					<div class="<?php echo esc_attr( $slide_class ); ?>" style="width: <?php echo esc_attr( $width ); ?>; height: <?php echo esc_attr( $height ); ?>;">
						<div class="eo-review-header">
							<?php if ( $showPhoto && ! empty( $review['profile_photo_url'] ) ) : ?>
								<img src="<?php echo esc_url( $review['profile_photo_url'] ); ?>" alt="<?php echo esc_attr( $review['author_name'] ); ?>" class="eo-review-photo" />
							<?php endif; ?>
							
							<div class="eo-review-info">
								<?php if ( $showName ) : ?>
									<strong class="eo-review-name"><?php echo esc_html( $review['author_name'] ); ?></strong>
								<?php endif; ?>
								
								<?php if ( $showStars ) : ?>
									<div class="eo-review-stars">
										<?php
										$rating = (int) $review['rating'];
										for ( $i = 1; $i <= 5; $i++ ) {
											if ( $i <= $rating ) {
												echo '<span class="star-full">★</span>';
											} else {
												echo '<span class="star-empty">☆</span>';
											}
										}
										?>
									</div>
								<?php endif; ?>
								
								<?php if ( $showDate && ! empty( $review['relative_time_description'] ) ) : ?>
									<small class="eo-review-date"><?php echo esc_html( $review['relative_time_description'] ); ?></small>
								<?php endif; ?>
							</div>
						</div>
						
						<?php if ( $showText && ! empty( $review['text'] ) ) : ?>
							<div class="eo-review-text">
								<?php
								$text = $review['text'];
								if ( $textLimit > 0 && mb_strlen( $text ) > $textLimit ) {
									$truncated = mb_substr( $text, 0, $textLimit ) . '...';
									?>
									<div class="eo-review-text-truncated">
										<?php echo esc_html( $truncated ); ?> 
										<span class="eo-voir-plus"><?php esc_html_e( 'Voir plus', 'eo-blocks' ); ?></span>
										<div class="eo-review-text-full"><?php echo esc_html( $text ); ?></div>
									</div>
									<?php
								} else {
									echo esc_html( $text );
								}
								?>
							</div>
						<?php endif; ?>
					</div>
				<?php endforeach; ?>
			<?php endif; ?>
		</div>
		<?php if ( $layout === 'carousel' && ! empty( $reviews ) ) : ?>
			<div class="swiper-pagination"></div>
			<div class="swiper-button-prev"></div>
			<div class="swiper-button-next"></div>
		<?php endif; ?>
	</div>
</div>