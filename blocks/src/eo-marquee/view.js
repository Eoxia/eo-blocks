(function($) {

	var initializeBlock = function($block) {
		const container = $block[0];
		const track = $block.find('.eo-marquee__track')[0];
		const originalInner = $block.find('.eo-marquee__inner')[0];

		let speed = 50;
		let direction = -1;
		let offset = 0;
		let lastScrollY = window.scrollY;

		function fillMarquee() {
			const containerWidth = container.offsetWidth;
			let contentWidth = track.offsetWidth;
			let iteration = 0;
			const maxIterations = 50;

			while (contentWidth < containerWidth * 2 && iteration < maxIterations) {
				const clone = originalInner.cloneNode(true);
				track.appendChild(clone);
				contentWidth = track.offsetWidth;
				iteration++;
			}
		}

		function animate() {
			const marginRight = parseInt(getComputedStyle(originalInner).marginRight || 0);
			const unitWidth = originalInner.offsetWidth + marginRight;

			offset += direction * speed / 60;

			// Si on va vers la gauche (défilement normal)
			if (direction === -1 && Math.abs(offset) >= unitWidth) {
				offset += unitWidth; // remet au bon endroit vers la droite
			}

			// Si on va vers la droite (scroll haut)
			if (direction === 1 && offset >= 0) {
				offset -= unitWidth; // remet au bon endroit vers la gauche
			}

			track.style.transform = `translateX(${offset}px)`;
			requestAnimationFrame(animate);
		}

		function waitForTextReady(callback) {
			const check = () => {
				if (originalInner.offsetWidth > 0) {
					callback();
				} else {
					setTimeout(check, 100);
				}
			};
			check();
		}

		waitForTextReady(() => {
			fillMarquee();
			animate();
		});

		window.addEventListener('scroll', () => {
			const currentScrollY = window.scrollY;

			if (currentScrollY > lastScrollY) {
				direction = -1;
			} else if (currentScrollY < lastScrollY) {
				direction = 1;
			}

			lastScrollY = currentScrollY;
		});
	};

	$(document).ready(function() {
		$('.wp-block-eo-marquee').each(function() {
			initializeBlock($(this));
		});
	});

})(jQuery);
