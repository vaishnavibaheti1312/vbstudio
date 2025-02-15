(function ($) {

'use strict';

/*!==========================================================================
 * ==========================================================================
 * ==========================================================================
 *
 * Rubenz – Creative Portfolio AJAX Template
 *
 * [Table of Contents]
 *
 * 1. PJAX Animate Clonned Image
 * 2. PJAX Animate Masthead
 * 3. PJAX Finish Loading
 * 4. PJAX Init New Page
 * 5. PJAX Prepare Transition
 * 6. PJAX Transition Fullscreen Slider
 * 7. PJAX Transition General
 * 8. PJAX Transition Halfscreen Slider
 * 9. PJAX Transition Masonry Grid
 * 10. PJAX Transition Nav Projects
 * 11. PJAX Transition Overlay Menu
 * 12. PJAX Update Trackers
 * 13. PJAX
 * 14. Aside Counters
 * 15. Counter
 * 16. Cursor
 * 17. Figure Property
 * 18. Form
 * 19. Figure Portfolio
 * 20. Gmap
 * 21. Grid
 * 22. Header
 * 23. Lazy Load
 * 24. Menu Overlay
 * 25. Preloader
 * 26. Parallax
 * 27. Project Backgrounds
 * 28. Smooth Scroll
 * 29. Create OS Scene
 * 30. Get Scroll Stop
 * 31. Lock Scroll
 * 32. Restore Scroll Top
 * 33. Scroll To Very Top
 * 34. Section Composition
 * 35. Section Content
 * 36. Section Half Screen Slider
 * 37. Section Headings Slider
 * 38. Section Intro
 * 39. Section Masthead
 * 40. Section Nav Projects
 * 41. Section Text Slider
 * 42. Slider Backgrounds
 * 43. Render Slider Counter
 * 44. Slider Half Screen
 * 45. Slider Headings
 * 46. Slider Images
 * 47. Slider Testimonials
 * 48. Slider Text
 * 49. Social
 * 50. Animate Lines
 * 51. Animate Words
 * 52. Do Split Text
 * 53. Hide Lines
 * 54. Hide Words
 * 55. Hide Words Vertical
 * 56. Set Lines
 * 57. Debounce
 * 58. Fix Mobile Bar Height
 * 59. Run On High Performance GPU
 *
 * ==========================================================================
 * ==========================================================================
 * ==========================================================================
 */

window.$document = $(document);
window.$pageWrapper = $('.page-wrapper');
window.$pageHeader = $('.header__wrapper-overlay-menu');
window.$barbaWrapper = $('[data-barba="wrapper"]');
window.$body = $('body');
window.$wrapperBackgrounds = $('.project-backgrounds');
window.$backgroundsOverlay = $('.project-backgrounds__overlay');
window.$overlay = $('.header__wrapper-overlay-menu');
window.$backgrounds = $('.project-backgrounds__background');
window.$backgroundLinks = $('a[data-post-id]');
window.$burger = $('#js-burger');
window.$header = $('.header');
window.$preloader = $('.preloader');
window.$curtains = $('.preloader__curtain');
window.$spinner = $('.js-spinner');

/**
 * Try to use high performance GPU on dual-GPU systems
 */
runOnHighPerformanceGPU();

/**
 * Default Theme Options
 * Used to prevent errors if there is
 * no data provided from backend
 */

if (typeof window.theme === 'undefined') {
	window.theme = {
		typography: {
			fontPrimary: 'Poppins',
			fontSecondary: 'Oswald'
		},
		smoothScroll: {
			damping: 0.08,
			renderByPixels: true,
			continuousScrolling: false,
			plugins: {
				edgeEasing: true
			}
		}
	}
}

/**
 * ScrollMagic Setup
 */
window.SMController = new ScrollMagic.Controller();
window.SMController.enabled(false);
window.SMSceneTriggerHook = 0.8;
window.SMSceneReverse = false;

/**
 * Theme Fonts
 */
window.fontPrimaryObserver = new FontFaceObserver(window.theme.typography.fontPrimary);
window.fontSecondaryObserver = new FontFaceObserver(window.theme.typography.fontSecondary);

/**
 * Don't save scroll position
 * after AJAX transition
 */
if ('scrollRestoration' in history) {
	history.scrollRestoration = 'manual';
}

$document.ready(function () {

	Preloader().then(function () {

		/**
		 * Split text only after ensuring
		 * that fonts are rendered
		 */
		Promise
			.all([window.fontPrimaryObserver.load(), window.fontSecondaryObserver.load()])
			.then(doSplitText($document))
			.then(setLines($document))
			.then(function () {
				window.SMController.enabled(true);
				window.SMController.update(true);
				initComponents($document);
			});

	});

	new PJAX();
	new ProjectBackgrounds();
	window.InteractiveCursor = new Cursor();

});

function initComponents($scope = $document) {

	new SmoothScroll();

	window.PageHeader = new Header();
	if (typeof window.PageMenu === 'undefined') {
		window.PageMenu = new MenuOverlay();
	}

	lazyLoad($scope);
	new Parallax($scope);
	new Grid();
	new Form();
	new SliderImages($scope);
	new SliderTestimonials($scope);
	new AsideCounters($scope);
	new GMap($scope);
	new SectionMasthead($scope);
	new SectionContent($scope);
	new SectionIntro($scope);
	new SectionTextSlider($scope);
	new SectionHeadingsSlider($scope);
	new SectionHalfScreenSlider($scope)
	new SectionNavProjects($scope)
	new SectionComposition($scope);
	new FigurePortfolio($scope);
	$('.js-video').magnificPopup();
	fixMobileBarHeight();

}

/*!========================================================================
	1. PJAX Animate Clonned Image
	======================================================================!*/
function PJAXAnimateClonnedImage(data, $customPositionElement) {

	return new Promise(function (resolve, reject) {
		var
			tl = new TimelineMax(),
			$trigger = $(data.trigger),
			$postId = $trigger.data('post-id'),
			$targetBackground = window.$backgrounds.filter('[data-background-for=' + $postId + ']'),
			$img = $customPositionElement ? $customPositionElement : $trigger.find('img[src]');

		if (!$img.length) {
			resolve(true);
		}

		var
			$clone = $img.clone(),
			imgPosition = $img.get(0).getBoundingClientRect();

		tl.timeScale(1.25);

		tl
			.set($clone, {
				position: 'fixed',
				top: imgPosition.top,
				left: imgPosition.left,
				width: imgPosition.width,
				height: imgPosition.height,
				className: '+=of-cover',
				zIndex: 300
			})
			.add(function () {
				$targetBackground.addClass('selected');
				$clone.appendTo(window.$body);
			})
			.set(window.$backgroundsOverlay, {
				autoAlpha: 0
			})
			.to($clone, 1.2, {
				transition: 'none',
				transform: 'none',
				top: 0,
				left: 0,
				width: '100%',
				height: '100%',
				ease: Expo.easeInOut
			})
			.set(window.$wrapperBackgrounds, {
				backgroundColor: 'transparent',
				scaleX: 1,
				zIndex: 400,
				autoAlpha: 1
			})
			.add(function () {

				scrollToVeryTop();
				setTimeout(function () {
					$clone.remove();
					resolve(true);
				}, 100);

			});

	});

}

/*!========================================================================
	2. PJAX Animate Masthead
	======================================================================!*/
function PJAXAnimateMasthead(data) {

	return new Promise(function (resolve, reject) {

		var
			$nextContainer = $(data.next.container),
			$nextMasthead = $nextContainer.find('.section-masthead').first(),
			$nextBgWrapper = $nextMasthead.find('.section-masthead__background'),
			tl = new TimelineMax(),
			$selectedBackground = window.$backgrounds.filter('.selected');

		if (!$selectedBackground.length || !$nextBgWrapper.length) {
			resolve(true);
		}

		var
			$nextBg = $nextBgWrapper.find('.art-parallax__bg'),
			$nextOverlay = $nextMasthead.find('.section-masthead__overlay'),
			nextBgWrapperPosition = $nextBgWrapper.get(0).getBoundingClientRect(),
			transformMatrix = $nextBg.css('transform');

		tl.timeScale(1.25);
		scrollToVeryTop();

		if ($nextOverlay.length) {

			tl.to(window.$backgroundsOverlay, 0.6, {
				autoAlpha: 0.6,
				ease: Expo.easeInOut
			}, '0');

		} else {

			tl.set(window.$backgroundsOverlay, {
				autoAlpha: 0
			}, '0');

		}

		tl.add([
				TweenMax.to(window.$wrapperBackgrounds, 1.2, {
					top: nextBgWrapperPosition.top,
					left: nextBgWrapperPosition.left,
					width: nextBgWrapperPosition.width,
					height: nextBgWrapperPosition.height,
					ease: Expo.easeInOut,
				}),
				TweenMax.to($selectedBackground, 1.2, {
					transition: 'none',
					transform: transformMatrix,
					ease: Expo.easeInOut,
				})
			], '0')
			.set(window.$wrapperBackgrounds, {
				autoAlpha: 0
			})
			.add(function () {
				resolve(true);
			});

	});

}

/*!========================================================================
	3. PJAX Finish Loading
	======================================================================!*/
function PJAXFinishLoading(data) {

	return new Promise(function (resolve, reject) {

		window.SMController.enabled(true);
		window.SMController.update(true);
		window.$backgrounds.removeClass('selected active');
		window.$header.removeClass('header_lock-submenus');
		window.InteractiveCursor.finishLoading();

		lockScroll(false);

		TweenMax.to(window.$spinner, 1.2, {
			autoAlpha: 0
		});

		TweenMax.set(window.$preloader, {
			autoAlpha: 0
		});

		TweenMax.set(window.$wrapperBackgrounds, {
			autoAlpha: 0,
			zIndex: -1,
			clearProps: 'width,height,left,right,top,bottom,backgroundColor',
		});

		TweenMax.set(window.$backgroundsOverlay, {
			autoAlpha: 1
		});

		TweenMax.set(window.$backgrounds, {
			transition: '',
			clearProps: 'transform,width,height',
		});

		setTimeout(function () {
			window.$overlay.removeClass('intransition lockhover opened');
		}, 300);

		resolve(true);

	});

}

/*!========================================================================
	4. PJAX Init New Page
	======================================================================!*/
function PJAXInitNewPage(data) {

	return new Promise(function (resolve, reject) {

		var
			tl = new TimelineMax(),
			$nextContainer = $(data.next.container);

		tl
			.add(function () {

				// clear & re-init ScrollMagic
				window.SMController.destroy(true);
				window.SMController = new ScrollMagic.Controller();

				// split text lines in new container
				doSplitText($nextContainer).then(setLines($nextContainer)).then(function () {

					// scroll to the top
					setTimeout(function () {
						scrollToVeryTop();
					}, 100);

					// re-init components
					initComponents($nextContainer);
					window.SMController.enabled(false);

					// update ad trackers
					PJAXUpdateTrackers();

				});

				// change header color if needed
				switch (data.next.namespace) {
					case 'light': {
						window.$header.removeClass('header_white').addClass('header_black');
						break;
					}
					case 'dark': {
						window.$header.removeClass('header_black').addClass('header_white');
						break;
					}
				}

			})
			.add(function () {
				resolve(true);
			});

	});

}

/*!========================================================================
	5. PJAX Prepare Transition
	======================================================================!*/
function PJAXPrepareTransition(data) {

	return new Promise(function (resolve, reject) {

		var $trigger = $(data.trigger);

		window.InteractiveCursor.drawLoading();
		window.$overlay.addClass('intransition lockhover');
		$trigger.addClass('selected');

		TweenMax.set(window.$curtains, {
			scaleX: 0,
			transformOrigin: 'left center'
		});

		TweenMax.set(window.$preloader, {
			autoAlpha: 1
		});

		if (window.$spinner.length) {
			TweenMax.to(window.$spinner, 0.6, {
				autoAlpha: 1
			});
		}

		resolve(true);

	});

}

/*!========================================================================
	6. PJAX Transition Fullscreen Slider
	======================================================================!*/
var PJAXTransitionFullscreenSlider = {
	name: 'fullscreenSlider',
	custom: ({
		current,
		next,
		trigger
	}) => {
		return $(trigger).data('pjax-link') == 'fullscreenSlider';
	},
	before: (data) => {

		return new Promise(function (resolve, reject) {

			PJAXPrepareTransition(data).then(function () {
				resolve(true);
			});

		});

	},
	beforeLeave: (data) => {

		return new Promise(function (resolve, reject) {

			var
				tl = new TimelineMax(),
				$target = $('.section-fullscreen-slider'),
				$backgroundOverlay = $target.find('.slider__background-overlay');

			tl
				.set(window.$wrapperBackgrounds, {
					zIndex: -1,
					scaleX: 1,
					autoAlpha: 1,
					backgroundColor: 'transparent',
				})
				.set(window.$backgroundsOverlay, {
					autoAlpha: 0
				})
				.to($backgroundOverlay, 1.2, {
					autoAlpha: 0,
					ease: Expo.easeInOut
				}, '0.6')
				.to($target, 1.2, {
					autoAlpha: 0,
					ease: Expo.easeInOut
				}, '0')
				.to(window.$wrapperBackgrounds, 1.2, {
					autoAlpha: 1,
					zIndex: 400,
					ease: Expo.easeInOut
				}, '0.6')
				.add(function () {
					resolve(true);
				});

		});

	},
	enter: (data) => {

		return new Promise(function (resolve, reject) {

			PJAXInitNewPage(data).then(function () {
				resolve(true)
			});

		});

	},
	afterEnter: (data) => {

		return new Promise(function (resolve, reject) {

			PJAXAnimateMasthead(data).then(function () {
				resolve(true);
			});

		});

	},
	after: (data) => {

		return new Promise(function (resolve, reject) {

			PJAXFinishLoading(data).then(function () {
				resolve(true);
			});

		});

	}
}

/*!========================================================================
	7. PJAX Transition General
	======================================================================!*/
var PJAXTransitionGeneral = {

	before() {
		window.InteractiveCursor.drawLoading();
	},

	beforeLeave: (data) => {

		return new Promise(function (resolve, reject) {

			PJAXPrepareTransition(data).then(function () {
				resolve(true)
			});

		});

	},

	leave: (data) => {

		return new Promise(function (resolve, reject) {

			var
				tl = new TimelineMax(),
				$currentContainer = $(data.current.container);

			tl.timeScale(1.5);

			if (!$overlay.hasClass('opened')) {

				tl.to($currentContainer, 1.2, {
					x: '10vw',
					force3D: true,
					transformOrigin: 'left center',
					ease: Expo.easeInOut
				});

				tl
					.to($curtains, 0.6, {
						scaleX: 1,
						transformOrigin: 'left center',
						ease: Expo.easeInOut
					}, '0.2');

			}

			tl
				.add(function () {
					window.$header.removeClass('header_black').addClass('header_white');
				}, '0')
				.add(function () {
					$currentContainer.remove();
					resolve(true);
				});

		});

	},

	enter: (data) => {

		return new Promise(function (resolve, reject) {

			PJAXInitNewPage(data).then(function () {
				resolve(true)
			});

		});

	},

	afterEnter: (data) => {

		return new Promise(function (resolve, reject) {

			var
				tl = new TimelineMax(),
				$nextContainer = $(data.next.container),
				$nextMasthead = $nextContainer.find('.section-masthead').first(),
				$nextBg = $nextMasthead.find('.section-masthead__background .art-parallax__bg');

			tl
				.set($burger, {
					className: '-=header__burger_opened'
				})
				.set($nextContainer, {
					autoAlpha: 1,
					x: '-5vw',
					force3D: true,
					transformOrigin: 'right center',
				});

			// animate (close) header if it's opened
			if (window.$pageHeader.hasClass('opened')) {

				var tlClose = $nextBg.length ? window.PageHeader.hideOverlayMenu(false) : window.PageHeader.hideOverlayMenu(true);

				tl
					.add(tlClose, '0')
					.set(window.$overlay, {
						className: '+=intransition'
					})
					.to($nextContainer, 1.2, {
						x: '0vw',
						force3D: true,
						ease: Expo.easeInOut
					});

			} else {

				tl
					.to($nextContainer, 1.2, {
						x: '0vw',
						force3D: true,
						ease: Expo.easeInOut
					})
					.to(window.$curtains, 0.6, {
						scaleX: 0,
						transformOrigin: 'right center',
						ease: Expo.easeInOut
					}, '0.3');

			}

			tl
				.set(window.$overlay, {
					className: '+=intransition'
				})
				.add(function () {
					resolve(true);
				}, '-=0.3');


		});

	},

	after: (data) => {

		return new Promise(function (resolve, reject) {
			PJAXFinishLoading(data).then(function () {
				resolve(true);
			});

		});

	}

}

/*!========================================================================
	8. PJAX Transition Halfscreen Slider
	======================================================================!*/
var PJAXTransitionHalfscreenSlider = {
	name: 'halfscreenSlider',
	custom: ({
		current,
		next,
		trigger
	}) => {
		return $(trigger).data('pjax-link') == 'halfscreenSlider';
	},
	before: (data) => {

		return new Promise(function (resolve, reject) {

			PJAXPrepareTransition(data).then(function () {
				resolve(true);
			});

		});

	},
	beforeLeave: (data) => {

		return new Promise(function (resolve, reject) {

			var
				tl = new TimelineMax(),
				$sliderContent = $('.slider-halfscreen__content'),
				$wrapperImg = $('.slider-halfscreen__images-slide.swiper-slide-active .slider-halfscreen__images-slide-inner'),
				$mobileOverlay = $('.slider-halfscreen__overlay'),
				$customPositionElement = $('.slider-halfscreen__images-slide.swiper-slide-active .slider-halfscreen__bg');

			tl
				.to($wrapperImg, 0.6, {
					scale: 1
				})
				.to($sliderContent, 1.2, {
					x: '10vw',
					autoAlpha: 0,
					ease: Expo.easeInOut
				}, '0.6')
				.to($mobileOverlay, 0.6, {
					autoAlpha: 0
				}, '0')
				.set(window.$wrapperBackgrounds, {
					zIndex: 400,
					scaleX: 1,
					autoAlpha: 1,
					backgroundColor: 'transparent',
				})
				.set(window.$backgroundsOverlay, {
					autoAlpha: 0
				})
				.add(function () {
					PJAXAnimateClonnedImage(data, $customPositionElement).then(function () {
						resolve(true);
					});
				}, '0.6');

		});

	},
	enter: (data) => {

		return new Promise(function (resolve, reject) {

			PJAXInitNewPage(data).then(function () {
				resolve(true)
			});

		});

	},
	afterEnter: (data) => {

		return new Promise(function (resolve, reject) {

			PJAXAnimateMasthead(data).then(function () {
				resolve(true);
			});

		});

	},
	after: (data) => {

		return new Promise(function (resolve, reject) {

			PJAXFinishLoading(data).then(function () {
				resolve(true);
			});

		});

	}
}

/*!========================================================================
	9. PJAX Transition Masonry Grid
	======================================================================!*/
var PJAXTransitionMasonryGrid = {
	name: 'masonryGrid',
	custom: ({
		current,
		next,
		trigger
	}) => {
		return $(trigger).data('pjax-link') == 'masonryGrid';
	},
	before: (data) => {

		return new Promise(function (resolve, reject) {

			PJAXPrepareTransition(data).then(function () {
				resolve(true);
			});

		});

	},
	beforeLeave: (data) => {

		return new Promise(function (resolve, reject) {

			PJAXAnimateClonnedImage(data).then(function () {
				resolve(true)
			});

		});

	},
	enter: (data) => {

		return new Promise(function (resolve, reject) {

			PJAXInitNewPage(data).then(function () {
				resolve(true)
			});

		});

	},
	afterEnter: (data) => {

		return new Promise(function (resolve, reject) {

			PJAXAnimateMasthead(data).then(function () {
				resolve(true);
			});

		});

	},
	after: (data) => {

		return new Promise(function (resolve, reject) {

			PJAXFinishLoading(data).then(function () {
				resolve(true);
			});

		});

	}
}

/*!========================================================================
	10. PJAX Transition Nav Projects
	======================================================================!*/
var PJAXTransitionNavProjects = {
	name: 'navProjects',
	custom: ({
		current,
		next,
		trigger
	}) => {
		return $(trigger).data('pjax-link') == 'navProjects';
	},
	before: (data) => {

		return new Promise(function (resolve, reject) {

			PJAXPrepareTransition(data).then(function () {
				resolve(true);
			});

		});

	},
	beforeLeave: (data) => {

		return new Promise(function (resolve, reject) {

			var
				tl = new TimelineMax(),
				$customPositionElement = $('.section-nav-projects__backgrounds'),
				$inner = $('.section-nav-projects__inner'),
				$backgroundOverlay = $('.section-nav-projects__overlay');

			tl
				.to($inner, 0.3, {
					transition: 'none',
					autoAlpha: 0,
					ease: Expo.easeInOut,
				}, '0')
				.to($backgroundOverlay, 0.3, {
					transition: 'none',
					autoAlpha: 0,
					ease: Expo.easeInOut,
				}, '0')
				.add(function () {
					PJAXAnimateClonnedImage(data, $customPositionElement).then(function () {
						resolve(true);
					});
				});

		});

	},
	enter: (data) => {

		return new Promise(function (resolve, reject) {

			PJAXInitNewPage(data).then(function () {
				resolve(true)
			});

		});

	},
	afterEnter: (data) => {

		return new Promise(function (resolve, reject) {

			PJAXAnimateMasthead(data).then(function () {
				resolve(true);
			});

		});

	},
	after: (data) => {

		return new Promise(function (resolve, reject) {

			PJAXFinishLoading(data).then(function () {
				resolve(true);
			});

		});

	}
}

/*!========================================================================
	11. PJAX Transition Overlay Menu
	======================================================================!*/
var PJAXTransitionOverlayMenu = {
	name: 'overlayMenu',
	custom: ({
		current,
		next,
		trigger
	}) => {
		return $(trigger).data('pjax-link') == 'overlayMenu';
	},

	before: (data) => {

		return new Promise(function (resolve, reject) {

			PJAXPrepareTransition(data).then(function () {
				lockScroll(false);
				resolve(true);
			});

		});

	},

	enter: (data) => {

		return new Promise(function (resolve, reject) {

			PJAXInitNewPage(data).then(function () {

				var
					tl = new TimelineMax(),
					$nextContainer = $(data.next.container),
					$nextMasthead = $nextContainer.find('.section-masthead').first(),
					$nextBg = $nextMasthead.find('.section-masthead__background .art-parallax__bg'),
					tlClose = $nextBg.length ? window.PageHeader.hideOverlayMenu(false) : window.PageHeader.hideOverlayMenu(true),
					$nextOverlay = $nextMasthead.find('.section-masthead__overlay');

				if ($nextBg.length) {

					if ($nextOverlay.length) {

						tl.to(window.$backgroundsOverlay, 1.2, {
							autoAlpha: 0.6,
							transition: 'none',
							ease: Expo.easeInOut,
						});

					} else {

						tl.to(window.$backgroundsOverlay, 1.2, {
							autoAlpha: 0,
							transition: 'none',
							ease: Expo.easeInOut,
						});

					}

				}

				tl
					.add(tlClose, '0')
					// .add(function () {
					// 	lockScroll(false);
					// }, '0.4')
					.to($nextContainer, 1.2, {
						x: '0vw',
						force3D: true,
						ease: Expo.easeInOut
					}, '0.4')
					.set(window.$preloader, {
						autoAlpha: 0
					})
					.set(window.$overlay, {
						className: '+=intransition'
					})
					.set(window.$wrapperBackgrounds, {
						backgroundColor: 'transparent'
					})
					.add(function () {
						resolve(true);
					});

			});

		});

	},

	afterEnter: (data) => {

		return new Promise(function (resolve, reject) {

			PJAXAnimateMasthead(data).then(function () {
				resolve(true);
			});

		});

	},
	after: (data) => {

		return new Promise(function (resolve, reject) {

			PJAXFinishLoading(data).then(function () {
				resolve(true);
			});

		});

	}
}

/*!========================================================================
	12. PJAX Update Trackers
	======================================================================!*/
function PJAXUpdateTrackers() {

	updateGA();
	updateFBPixel();
	updateYaMetrika();

	/**
	 * Google Analytics
	 */
	function updateGA() {

		if (typeof gtag === 'function') {

			if (window.gaData && Object.keys(window.gaData)[0] !== 'undefined') {

				var
					trackingID = Object.keys(window.gaData)[0],
					pageRelativePath = (window.location.href).replace(location.origin, '');

				gtag('js', new Date());
				gtag('config', trackingID, {
					'page_title': document.title,
					'page_path': pageRelativePath
				});

			}

		}

	}

	/**
	 * Facebook Pixel
	 */
	function updateFBPixel() {

		if (typeof fbq === 'function') {
			fbq('track', 'PageView');
		}

	}

	/**
	 * Yandex Metrika
	 */
	function updateYaMetrika() {

		if (typeof ym === 'function') {

			var trackingID = getYmTrackingNumber();

			ym(trackingID, 'hit', window.location.href, {
				title: document.title
			});

		}

		function getYmTrackingNumber() {

			if (typeof window.Ya !== 'undefined' && typeof window.Ya.Metrika2) {
				return window.Ya.Metrika2.counters()[0].id || null;
			}

			if (typeof window.Ya !== 'undefined' && typeof window.Ya.Metrika) {
				return window.Ya.Metrika.counters()[0].id || null;
			}

			return null;

		}

	}

}

/*!========================================================================
	13. PJAX
	======================================================================!*/
var PJAX = function () {

	var $barbaWrapper = $('[data-barba="wrapper"]');

	if (!$barbaWrapper.length) {
		return;
	}

	barba.init({

		transitions: [
			PJAXTransitionGeneral,
			PJAXTransitionMasonryGrid,
			PJAXTransitionFullscreenSlider,
			PJAXTransitionHalfscreenSlider,
			PJAXTransitionOverlayMenu,
			PJAXTransitionNavProjects,
		]

	});


}

/*!========================================================================
	14. Aside Counters
	======================================================================!*/
var AsideCounters = function ($scope = $document) {

	var $target = $scope.find('.aside-counters');

	if (!$target.length) {
		return;
	}

	var $counter = $scope.find('.js-counter');

	$counter.each(function () {

		new Counter($(this));

	});

}

/*!========================================================================
	15. Counter
	======================================================================!*/
var Counter = function ($target) {

	var $num = $target.find('.js-counter__number');

	if (!$target.length || !$num.length) {
		return;
	}

	var
		numberStart = $target.data('counter-start') || 0,
		numberTarget = $target.data('counter-target') || 100,
		animDuration = $target.data('counter-duration') || 4,
		counter = {
			val: numberStart
		};

	setCounterUp();
	animateCounterUp();

	function setCounterUp() {

		var value = numberStart.toFixed(0);

		if (value < 10) {
			value = '0' + value;
		}

		$num.text(value);

	}

	function animateCounterUp() {

		var tl = new TimelineMax();
		var value;

		tl.to(counter, animDuration, {
			val: numberTarget.toFixed(0),
			ease: Power4.easeOut,
			onUpdate: function () {
				value = counter.val.toFixed(0);
				if (value < 10) {
					value = '0' + value;
				}
				$num.text(value);
			}
		});

		createOSScene($target, tl);

	}

}

/*!========================================================================
	16. Cursor
	======================================================================!*/
var Cursor = function () {

	var $cursor = $('#js-cursor');

	this.drawLoading = function () {
		window.$barbaWrapper.addClass('cursor-progress');
		drawLoading();
	};

	this.finishLoading = function () {
		window.$barbaWrapper.removeClass('cursor-progress');
		finishLoading();
	};

	// don't launch on mobiles
	if (!$cursor.length || Modernizr.touchevents) {
		return;
	}

	var
		tl = new TimelineMax(),
		$follower = $('.cursor__follower'),
		// $inner = $follower.find('svg'),
		$inner = $follower.find('#inner'),
		$outter = $follower.find('#outter'),
		$triggers = $('#js-burger, a'),
		posX = 0,
		posY = 0,
		mouseX = 0,
		mouseY = 0;

	start();

	function start() {

		if (!$cursor.length || Modernizr.touchevents) {
			return;
		}

		TweenMax.set($cursor, {
			display: 'block',
			y: '-50%',
			x: '-50%'
		});

		TweenMax.to({}, 0.01, {
			repeat: -1,
			onRepeat: function () {

				posX += (mouseX - posX) / 6;
				posY += (mouseY - posY) / 6;

				TweenMax.set($cursor, {
					left: posX,
					top: posY,
					// opacity: .5
				});

			}
		});

		TweenMax.set($outter, {
			drawSVG: '0%',
		});

		$document.on('mousemove', function (e) {
			mouseX = e.pageX;
			mouseY = e.pageY;
		});

		$document.on('mouseenter', 'a, #js-burger', function () {

				TweenMax.to($cursor, 1.2, {
					scale: 1.5,
					ease: Elastic.easeOut.config(1, 0.4),
				});

				TweenMax.to($inner, 0.6, {
					opacity: 1
				});

			})
			.on('mouseleave', 'a, #js-burger', function () {

				TweenMax.to($cursor, 1.2, {
					scale: 1,
					ease: Elastic.easeOut.config(1, 0.4),
				});

				TweenMax.to($inner, 0.6, {
					opacity: .6
				});

			});

		$document.on('mouseenter', '.slider__arrow, .slider__dot, .social__item a, .section-video__link', function () {

				TweenMax.to($cursor, 0.3, {
					scale: 0,
					ease: Expo.easeInOut
					// ease: Elastic.easeOut.config(1, 0.4),
				});

				TweenMax.to($inner, 0.3, {
					opacity: 1
				});

			})
			.on('mouseleave', '.slider__arrow, .slider__dot, .social__item a, .section-video__link', function () {

				TweenMax.to($cursor, 1.2, {
					scale: 1,
					ease: Elastic.easeOut.config(1, 0.4),
					// delay: 0.3
				});

				TweenMax.to($inner, 0.6, {
					opacity: .6,
					// delay: 0.3
				});

			});

	}

	function drawLoading() {

		if (!$cursor.length || Modernizr.touchevents) {
			return;
		}

		tl
			.stop().clear().play()
			.add(TweenMax.to($cursor, 1.2, {
				scale: 1.5,
				ease: Elastic.easeOut.config(1, 0.4)
			}))
			.fromTo($outter, 1.2, {
				drawSVG: '0%',
			}, {
				drawSVG: '100%',
				ease: Expo.easeInOut
			}, '0');

	}

	function finishLoading() {

		if (!$cursor.length || Modernizr.touchevents) {
			return;
		}

		tl.stop().clear().play()
			.to($outter, 0.6, {
				drawSVG: '100%',
				ease: Expo.easeInOut
			})
			.to($outter, 0.6, {
				autoAlpha: 0
			}, '0')
			.set($outter, {
				drawSVG: '0%',
				autoAlpha: 1
			})
			.to($cursor, 1.2, {
				scale: 1,
				ease: Elastic.easeOut.config(1, 0.4),
			});

	}

}

/*!========================================================================
	17. Figure Property
	======================================================================!*/
// var FigureProperty = function ($target) {

// 	if (!$target.length) {
// 		return;
// 	}

// 	var $headline = $target.find('.figure-property__headline');

// 	prepare();
// 	animate();

// 	function prepare() {

// 		TweenMax.set($headline, {
// 			scaleX: 0,
// 			transformOrigin: 'left center'
// 		});

// 	}

// 	function animate() {

// 		var tl = new TimelineMax();

// 		tl
// 			.to($headline, 0.6, {
// 				scaleX: 1,
// 				ease: Expo.easeInOut
// 			})
// 			.add(animateLines($target), '0.4');

// 		createOSScene($target, tl);

// 	}

// }

/*!========================================================================
	18. Form
	======================================================================!*/
var Form = function () {

	floatLabels();
	ajaxForm();

	function floatLabels() {

		var
			INPUT_CLASS = '.input-float__input',
			INPUT_NOT_EMPTY = 'input-float__input_not-empty',
			INPUT_FOCUSED = 'input-float__input_focused';

		if (!$(INPUT_CLASS).length) {
			return;
		}

		$(INPUT_CLASS).each(function () {

			var
				$currentField = $(this),
				$currentControlWrap = $currentField.parent('.wpcf7-form-control-wrap');

			if ($currentField.val()) {
				$currentField.addClass(INPUT_NOT_EMPTY);
				$currentControlWrap.addClass(INPUT_NOT_EMPTY);
			} else {
				$currentField.removeClass([INPUT_FOCUSED, INPUT_NOT_EMPTY]);
				$currentControlWrap.removeClass([INPUT_FOCUSED, INPUT_NOT_EMPTY]);
			}

		});

		$(document).on('focusin', INPUT_CLASS, function () {

			var
				$currentField = $(this),
				$currentControlWrap = $currentField.parent('.wpcf7-form-control-wrap');

			$currentField.addClass(INPUT_FOCUSED).removeClass(INPUT_NOT_EMPTY);
			$currentControlWrap.addClass(INPUT_FOCUSED).removeClass(INPUT_NOT_EMPTY);

		}).on('focusout', INPUT_CLASS, function () {

			var
				$currentField = $(this),
				$currentControlWrap = $currentField.parent('.wpcf7-form-control-wrap');

			if ($currentField.val()) {
				$currentField.removeClass(INPUT_FOCUSED).addClass(INPUT_NOT_EMPTY);
				$currentControlWrap.removeClass(INPUT_FOCUSED).addClass(INPUT_NOT_EMPTY);
			} else {
				$currentField.removeClass(INPUT_FOCUSED);
				$currentControlWrap.removeClass(INPUT_FOCUSED);
			}

		});

	}

	function ajaxForm() {

		var $form = $('.js-ajax-form');

		if (!$form.length) {
			return;
		}

		$form.validate({
			errorElement: 'span',
			errorPlacement: function (error, element) {
				error.appendTo(element.parent()).addClass('form__error');
			},
			submitHandler: function (form) {
				ajaxSubmit(form);
			}
		});

		function ajaxSubmit(form) {

			$.ajax({
				type: $form.attr('method'),
				url: $form.attr('action'),
				data: $form.serialize()
			}).done(function () {
				alert($form.attr('data-message-success'));
				$form.trigger('reset');
				floatLabels();
			}).fail(function () {
				alert($form.attr('data-message-error'));
			});
		}

	}

}

/*!========================================================================
	19. Figure Portfolio
	======================================================================!*/
var FigurePortfolio = function ($scope) {

	var $target = $scope.find('.figure-portfolio');

	$target.each(function () {

		var
			$current = $(this),
			$img = $current.find('img'),
			transformMatrix = $img.css('transform');

		$current
			.on('mouseenter', function () {
				TweenMax.to($img, 0.6, {
					transform: 'none',
					ease: Expo.easeInOut
				})
			})
			.on('mouseleave', function () {
				TweenMax.to($img, 0.6, {
					transform: transformMatrix,
					ease: Expo.easeInOut
				})
			});

	});

}

/*!========================================================================
	20. Gmap
	======================================================================!*/
var GMap = function ($scope) {

	var
		$wrapper = $scope.find('.gmap'),
		prevInfoWindow = false;

	if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
		return;
	}

	createMap($wrapper);

	/**
	 * 
	 * @param {Map jQuery Object} $wrapper 
	 */
	function createMap($wrapper) {

		var $mapContainer = $wrapper.find('.gmap__container');

		if (!$mapContainer.length) {
			return;
		}

		var
			$markers = $wrapper.find('.gmap__marker'),
			ZOOM = parseInt($wrapper.attr('data-gmap-zoom')),
			SNAZZY_STYLES = $wrapper.attr('data-gmap-snazzy-styles');

		var argsMap = {
			center: new google.maps.LatLng(0, 0),
			zoom: ZOOM,
			scrollwheel: false
		};

		if (SNAZZY_STYLES) {

			try {
				SNAZZY_STYLES = JSON.parse(SNAZZY_STYLES);
				$.extend(argsMap, {
					styles: SNAZZY_STYLES
				});
			} catch (err) {
				console.error('Google Map: Invalid Snazzy Styles');
			}

		};

		var map = new google.maps.Map($mapContainer[0], argsMap);

		map.markers = [];

		$markers.each(function () {
			createMarker($(this), map);
		});

		centerMap(ZOOM, map);

	}

	/**
	 * 
	 * @param {Marker jQuery object} $marker 
	 * @param {Google Map Instance} map
	 */
	function createMarker($marker, map) {

		if (!$marker.length) {
			return;
		}

		var
			MARKER_LAT = parseFloat($marker.attr('data-marker-lat')),
			MARKER_LON = parseFloat($marker.attr('data-marker-lon')),
			MARKER_IMG = $marker.attr('data-marker-img'),
			MARKER_WIDTH = $marker.attr('data-marker-width'),
			MARKER_HEIGHT = $marker.attr('data-marker-height'),
			MARKER_CONTENT = $marker.attr('data-marker-content');

		/**
		 * Marker
		 */
		var argsMarker = {
			position: new google.maps.LatLng(MARKER_LAT, MARKER_LON),
			map: map
		};

		if (MARKER_IMG) {

			$.extend(argsMarker, {
				icon: {
					url: MARKER_IMG
				}
			});

		}

		if (MARKER_IMG && MARKER_WIDTH && MARKER_HEIGHT) {

			$.extend(argsMarker.icon, {
				scaledSize: new google.maps.Size(MARKER_WIDTH, MARKER_HEIGHT)
			});

		}

		var marker = new google.maps.Marker(argsMarker)

		map.markers.push(marker);

		/**
		 * Info Window (Content)
		 */
		if (MARKER_CONTENT) {

			var infoWindow = new google.maps.InfoWindow({
				content: MARKER_CONTENT
			});

			marker.addListener('click', function () {

				if (prevInfoWindow) {
					prevInfoWindow.close();
				}

				prevInfoWindow = infoWindow;

				infoWindow.open(map, marker);

			});

		}

	}

	/**
	 * 
	 * @param {Map Zoom} zoom 
	 * @param {Google Map Instance} map
	 */
	function centerMap(zoom, map) {

		var
			bounds = new google.maps.LatLngBounds(),
			newZoom;

		$.each(map.markers, function () {

			var item = this;

			if (typeof item.position === 'undefined') {
				return;
			}

			newZoom = new google.maps.LatLng(item.position.lat(), item.position.lng());
			bounds.extend(newZoom);

		});

		if (map.markers.length == 1) {

			map.setCenter(bounds.getCenter());
			map.setZoom(zoom);

		} else {

			map.fitBounds(bounds);

		}
	}

}

/*!========================================================================
	21. Grid
	======================================================================!*/
var Grid = function ($grid = $('.js-grid')) {

	if (!$grid.length) {
		return;
	}

	this.masonryGrid = $grid.masonry({
		itemSelector: '.js-grid__item',
		columnWidth: '.js-grid__sizer',
		percentPosition: true
	});

}

/*!========================================================================
	22. Header
	======================================================================!*/
var Header = function () {

	var $overlay = $('.header__wrapper-overlay-menu');

	if (!$overlay.length) {
		return;
	}

	var
		tl = new TimelineMax(),
		$menuLinks = $overlay.find('.menu-overlay > li > a'),
		$allLinks = $overlay.find('a'),
		$submenu = $overlay.find('.menu-overlay .sub-menu'),
		$submenuButton = $('#js-submenu-back'),
		$submenuLinks = $submenu.find('> li > a'),
		$overlayWidgets = $overlay.find('.header__wrapper-overlay-widgets'),
		$widgets = $overlay.find('.figure-property'),
		$headerLeft = $('.header__col-left'),
		OPEN_CLASS = 'header__burger_opened';

	clickBurger();
	prepare();
	setOverlayMenu();

	function prepare() {

		TweenMax.set($menuLinks.find('.split-chars__char'), {
			x: '-100px',
			autoAlpha: 0
		});

		TweenMax.set($submenuLinks.find('.split-chars__char'), {
			x: '-30px',
			autoAlpha: 0
		});

	}

	function setOverlayMenu() {

		getScrollTop();
		window.$overlay.removeClass('intransition lockhover opened has-opened-submenu');
		$submenu.removeClass('opened');
		$allLinks.removeClass('selected');

		TweenMax.set(window.$overlay, {
			scaleX: 0,
			autoAlpha: 0,
		});

		TweenMax.set([$submenu, $submenuButton], {
			autoAlpha: 0
		});

		TweenMax.set($overlayWidgets, {
			scaleY: 0,
			transformOrigin: 'bottom center',
		});

		TweenMax.set(window.$wrapperBackgrounds, {
			clearProps: 'width,height,left,right,top,bottom,backgroundColor',
		});

		setLines($widgets);

	}

	function closeOverlayMenu(hideBackgrounds) {

		var
			$submenuLinksCurrent = $submenu.filter('.opened').find($submenuLinks),
			$pageWrapper = $('.page-wrapper'),
			$layers = [];

		$layers.push(window.$overlay);

		if (hideBackgrounds == true) {
			$layers.push(window.$wrapperBackgrounds);
		}

		tl.timeScale(1.5);

		return tl
			.clear()
			.add([
				TweenMax.set(window.$overlay, {
					className: '+=intransition',
					transformOrigin: 'right center',
					zIndex: 500
				}),
				TweenMax.set(window.$wrapperBackgrounds, {
					transformOrigin: 'right center',
					zIndex: 100,
				}),
				TweenMax.set($burger, {
					className: '-=header__burger_opened'
				}),
				TweenMax.set($pageWrapper, {
					clearProps: 'overflow,height',
					x: '-5vw',
					force3D: true,
					transformOrigin: 'right center',
				}),
				function () {
					restoreScrollTop();
				}
			])
			.add([
				hideWords($menuLinks, 1.2, 0.01, '100px', true, 'start'),
				hideWords($submenuLinksCurrent, 1.2, 0.01, '30px', true, 'start'),
				hideLines($widgets, 0.6),
			], '0.3')
			.to($overlayWidgets, 0.6, {
				scaleY: 0,
				transformOrigin: 'top center',
				ease: Expo.easeInOut
			}, '1')
			.to($layers, 1.2, {
				scaleX: 0,
				ease: Expo.easeInOut
			}, '1')
			.fromTo($pageWrapper, 2.4, {
				autoAlpha: 1,
			}, {
				x: '0vw',
				force3D: true,
				autoAlpha: 1,
				ease: Expo.easeInOut,
			}, '0.3')
			.to($submenuButton, 0.6, {
				x: '-10px',
				autoAlpha: 0
			}, '0.3')
			.fromTo($headerLeft, 2.4, {
				x: '-50px',
			}, {
				x: '0px',
				autoAlpha: 1,
				ease: Expo.easeInOut
			}, '0.3')
			.add(function () {
				setOverlayMenu();
				prepare();
			});
	};

	function openOverlayMenu() {

		var $pageWrapper = $('.page-wrapper');

		tl.timeScale(1);

		tl
			.clear()
			.add(function () {
				getScrollTop();
				window.$overlay.addClass('intransition opened');
			})
			.set(window.$overlay, {
				autoAlpha: 1,
				transformOrigin: 'left center',
				zIndex: 500
			})
			.set(window.$wrapperBackgrounds, {
				scaleX: 0,
				transformOrigin: 'left center',
				autoAlpha: 1,
				zIndex: 100,
			})
			.set(window.$backgroundsOverlay, {
				autoAlpha: 0.6
			})
			.to($pageWrapper, 1.2, {
				x: '10vw',
				force3D: true,
				transformOrigin: 'left center',
				ease: Expo.easeInOut,
				onComplete: function () {
					TweenMax.set($pageWrapper, {
						autoAlpha: 0
					});
				}
			})
			.to($headerLeft, 1.2, {
				x: '50px',
				autoAlpha: 0,
				ease: Expo.easeInOut
			}, '0')
			.to([window.$overlay, window.$wrapperBackgrounds], 0.6, {
				scaleX: 1,
				ease: Expo.easeInOut
			}, '0.2')
			.add(animateWords($menuLinks, 1.8, 0.01, true, false, '-=1.5'), '0.6')
			.to($overlayWidgets, 1.2, {
				scaleY: 1,
				ease: Expo.easeInOut,
			}, '0.4')
			.add(animateLines($widgets), '1.0')
			.add(function () {
				window.$overlay.removeClass('intransition');
			}, '0.9');
	};

	function clickBurger() {

		window.$burger.off().on('click', function (e) {

			e.preventDefault();

			if (!$overlay.hasClass('intransition')) {

				if (window.$burger.hasClass(OPEN_CLASS)) {
					closeOverlayMenu(true);
					window.$burger.removeClass(OPEN_CLASS);
				} else {
					openOverlayMenu();
					window.$burger.addClass(OPEN_CLASS);
				}

			}

		});

	}

	this.hideOverlayMenu = function (hideBackgrounds) {

		return closeOverlayMenu(hideBackgrounds);

	}

}

/*!========================================================================
	23. Lazy Load
	======================================================================!*/
function lazyLoad($scope = document, $elements = $document.find('.lazy')) {

	var $images = $elements.find('img[data-src]');
	var $backgrounds = $scope.find('.lazy-bg[data-src]');

	setResponsivePaddingBottom($images).then(loadImages());

	function setResponsivePaddingBottom($images) {

		return new Promise(function (resolve, reject) {

			$images.each(function () {

				var
					$el = $(this),
					elWidth = $el.attr('width'),
					elHeight = $el.attr('height');

				// we need both width and height of element
				// to calculate proper value for "padding-bottom" hack
				if (!elWidth || !elHeight) {
					return;
				}

				var elPB = (elHeight / elWidth) * 100 + '%';

				$el.removeAttr('width').removeAttr('height').removeAttr('src');

				$el.parent().css({
					'padding-bottom': elPB,
					'animation-name': 'loading',
					'width': '100%',
					'height': '0'
				});

			});

			resolve();

		});

	};

	function loadImages() {

		return new Promise(function (resolve, reject) {

			var instance = $images.Lazy({
				chainable: false,
				afterLoad: function (el) {

					$(el).parent().css({
						'padding-bottom': '',
						'width': '',
						'height': '',
						'animation-name': 'none',
						'background-color': 'initial'
					});

					setTimeout(function () {
						new Grid();
					}, 300);

				}

			});

			var instanceBackgrounds = $backgrounds.Lazy({
				chainable: false
			});

			// update lazy load instance when smooth scroll is enabled
			if (window.SB !== undefined && instance.config && instance.config('delay') !== 0) {

				window.SB.addListener(function () {
					instance.update(true);
					instanceBackgrounds.update(true);
				});

			}

			resolve(true);

		});
	};

}

/*!========================================================================
	24. Menu Overlay
	======================================================================!*/
var MenuOverlay = function () {

	var $menu = $('.js-menu-overlay');

	if (!$menu.length) {
		return;
	}

	var
		$overlay = $('.header__wrapper-overlay-menu'),
		$widgets = $overlay.find('.figure-property'),
		$links = $menu.find('.menu-item-has-children > a'),
		$allLinks = $menu.find('a'),
		$submenus = $menu.find('.sub-menu'),
		$submenuButton = $('#js-submenu-back'),
		OPEN_CLASS = 'opened',
		SELECTED_CLASS = 'selected',
		HOVER_CLASS = 'menu-overlay_hover',
		tl = new TimelineMax();

	function openSubmenu($submenu, $currentMenu) {

		var
			$currentLinks = $currentMenu.find('> li > a .menu-overlay__item-wrapper'),
			$submenuLinks = $submenu.find('> li > a .menu-overlay__item-wrapper');

		tl
			.clear()
			.add([
				TweenMax.set($submenu, {
					autoAlpha: 1
				}),
				function () {

					$overlay.addClass('intransition lockhover');
					$submenus.removeClass(OPEN_CLASS);
					$submenu.not($menu).addClass(OPEN_CLASS);

					if (Modernizr.mq('(max-width: 991px)')) {
						if ($submenus.hasClass(OPEN_CLASS)) {
							hideLines($widgets, 0.6);
						} else {
							animateLines($widgets);
						}
					}

					if ($submenus.hasClass(OPEN_CLASS)) {
						$overlay.addClass('has-opened-submenu');

						tl.to($submenuButton, 0.3, {
							autoAlpha: 1,
							x: '0px'
						}, '-=1.2');
					} else {
						$overlay.removeClass('has-opened-submenu');

						tl.to($submenuButton, 0.3, {
							autoAlpha: 0,
							x: '-10px'
						}, '-=1.2');
					}

				}
			], '0')
			.add(hideWords($currentLinks, 1.2, 0, '50px', true, '0.2'))
			.add(animateWords($submenuLinks, 1.2, 0.005), '-=0.6')
			.set($submenu, {
				zIndex: 100
			})
			.add(function () {
				$allLinks.removeClass(SELECTED_CLASS);
				$overlay.removeClass('intransition lockhover');
			}, '-=0.6');
	}

	function closeSubmenu($submenu, $currentMenu) {

		var
			$currentLinks = $currentMenu.find('> li > a .menu-overlay__item-wrapper'),
			$submenuLinks = $submenu.find('> li > a .menu-overlay__item-wrapper');

		tl
			.clear()
			.add([
				TweenMax.set($submenu, {
					zIndex: -1
				}),
				function () {

					$overlay.addClass('intransition lockhover');
					$submenus.removeClass(OPEN_CLASS);
					$currentMenu.not($menu).addClass(OPEN_CLASS);

					if (Modernizr.mq('(max-width: 991px)')) {
						if ($submenus.hasClass(OPEN_CLASS)) {
							hideLines($widgets, 0.6);
						} else {
							animateLines($widgets, 1.2, 0.02, 0.4);
						}
					}

					if ($submenus.hasClass(OPEN_CLASS)) {
						$overlay.addClass('has-opened-submenu');

						TweenMax.to($submenuButton, 0.3, {
							autoAlpha: 1,
							x: '0px'
						});
					} else {
						$overlay.removeClass('has-opened-submenu');

						TweenMax.to($submenuButton, 0.3, {
							autoAlpha: 0,
							x: '-10px'
						});
					}

				}
			])
			.add(hideWords($submenuLinks, 0.6, 0.005, '-50px'))
			.add(animateWords($currentLinks), '-=0.6')
			.add([
				TweenMax.set($submenu, {
					autoAlpha: 0
				}),
				function () {
					$overlay.removeClass('intransition lockhover');
				}
			], '-=0.6');
	}

	$links.on('click', function (e) {

		e.preventDefault();

		if (!$overlay.hasClass('intransition')) {

			var
				$el = $(this),
				$currentMenu = $el.parents('ul'),
				$submenu = $el.next('.sub-menu');

			$el.addClass(SELECTED_CLASS);
			openSubmenu($submenu, $currentMenu);
		}

	});

	$submenuButton.on('click', function (e) {

		e.preventDefault();

		if (!$overlay.hasClass('intransition')) {

			var $openedMenu = $submenus.filter('.' + OPEN_CLASS),
				$prevMenu = $openedMenu.parent('li').parent('ul');
			closeSubmenu($openedMenu, $prevMenu);

		}
	});

	$allLinks
		.on('mouseenter touchstart', function () {

			if ($submenus.filter('.opened').length) {
				$submenus.filter('.opened').addClass(HOVER_CLASS);
			} else {
				$menu.addClass(HOVER_CLASS);
			}

		})
		.on('mouseleave touchend', function () {

			$('.menu-overlay_hover').removeClass(HOVER_CLASS);

		});
}

/*!========================================================================
	25. Preloader
	======================================================================!*/
function Preloader() {

	var tl = new TimelineMax();

	return new Promise(function (resolve) {

		tl
			.add(function () {
				resolve(true);
			}, '0.3');


	});

}

/*!========================================================================
	26. Parallax
	======================================================================!*/
var Parallax = function ($scope) {

	var $wrapper = $scope.find('[data-art-parallax]');

	if (!$wrapper.length) {
		return;
	}

	$wrapper.each(function () {

		var
			$current = $(this),
			$img = $current.find('img, .art-parallax__bg'),
			factor = parseFloat($current.data('art-parallax-factor')) || 0.3,
			factorTo = Math.abs(factor) * 100,
			factorFrom = -1 * factor * 100,
			factorScale = 1 + Math.abs(factor),
			sceneDuration = window.innerHeight + $current.height();

		if ($img.is('img')) {
			sceneDuration = window.innerHeight + $current.parent().height();
		}

		if (!$img.length) {
			return;
		}

		if (factorFrom > 0) {
			factorScale = factorScale * factorScale;
			factorTo = factor * 100;
		}

		var tl = new TimelineMax();

		TweenMax.set($img, {
			scale: factorScale,
			transformOrigin: 'center center',
			force3D: true,
			rotationZ: 0.01,
			ease: Expo.easeInOut
		});

		tl.fromTo($img, 0.3, {
			y: factorFrom + '%',
			force3D: true,
			ease: Linear.easeNone,
		}, {
			y: factorTo + '%',
			force3D: true,
			ease: Linear.easeNone,
		});

		var scene = new ScrollMagic.Scene({
				triggerElement: $current,
				triggerHook: 1,
				duration: sceneDuration
			})
			.setTween(tl)
			.addTo(window.SMController)
			.update(true);

		// update scene when smooth scroll is enabled
		if (window.SB !== undefined) {

			window.SB.addListener(function () {
				scene.refresh();
			});

		}

	});

}

/*!========================================================================
	27. Project Backgrounds
	======================================================================!*/
var ProjectBackgrounds = function () {

	if (!window.$backgrounds.length) {
		return;
	}

	$document
		.on('mouseenter touchstart', '.header a[data-post-id]', function () {
			var
				postId = $(this).data('post-id'),
				$targetBackground = window.$backgrounds.filter('[data-background-for="' + postId + '"]');

			if (!$targetBackground.length) {
				return;
			}

			window.$backgrounds.filter('active').removeClass('active');
			$targetBackground.addClass('active');

		})
		.on('mouseleave touchend', '.header a[data-post-id]', function () {

			window.$backgrounds.filter('.active').removeClass('active');

		})
		.on('click', 'a[data-post-id]', function () {

			var
				postId = $(this).data('post-id'),
				$targetBackground = window.$backgrounds.filter('[data-background-for="' + postId + '"]');

			if (!$targetBackground.length) {
				return;
			}

			window.$backgrounds.filter('active').removeClass('active');
			$targetBackground.addClass('selected');

		});

}

/*!========================================================================
	28. Smooth Scroll
	======================================================================!*/
var SmoothScroll = function () {

	var $smoothScroll = $('#js-smooth-scroll');

	// don't launch on mobiles
	if (!$smoothScroll.length || Modernizr.touchevents) {
		return;
	}

	$smoothScroll.addClass('smooth-scroll');

	if (window.theme.smoothScroll.plugins.edgeEasing) {
		Scrollbar.use(window.EdgeEasingPlugin);
	}

	window.SB = Scrollbar.init($smoothScroll[0], window.theme.smoothScroll);

	// handle smooth anchor scrolling
	$('a[href^=\\#]:not([href=\\#])').each(function () {

		var
			$current = $(this),
			$el = $($current.attr('href'));

		if ($el.length) {
			$current.on('click', function () {
				window.SB.scrollIntoView($el.get(0));
			});
		}

	});


}

/*!========================================================================
	29. Create OS Scene
	======================================================================!*/
function createOSScene($el, tl, $customTrigger, noReveal) {

	var
		$trigger = $el,
		masterTL = new TimelineMax();

	if ($customTrigger && $customTrigger.length) {
		$trigger = $customTrigger;
	}

	if (!noReveal) {
		// reveal hidden element first
		masterTL.add(TweenMax.set($el, {
			autoAlpha: 1
		}));
	}

	masterTL.add(tl);

	masterTL.add(function () {
		$el.attr('data-os-animation', 'animated');
	});

	var scene = new $.ScrollMagic.Scene({
			triggerElement: $trigger,
			triggerHook: window.SMSceneTriggerHook,
			reverse: window.SMSceneReverse
		})
		.setTween(masterTL)
		.addTo(window.SMController);


	// update scene when smooth scroll is enabled
	if (window.SB !== undefined) {

		window.SB.addListener(function () {
			scene.refresh();
		});

	}

}

/*!========================================================================
	30. Get Scroll Stop
	======================================================================!*/
function getScrollTop() {
	if (window.SB !== undefined) {
		window.lastTop = window.SB.scrollTop;
	} else {
		window.lastTop = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
	}
	return window.lastTop;
}

/*!========================================================================
	31. Lock Scroll
	======================================================================!*/
function lockScroll(enabled) {

	var
		$window = $(window),
		lastTop = $window.scrollTop();

	if (enabled === true) {

		TweenMax.set(window.$body, {
			className: '+=body_lock-scroll',
			top: -lastTop
		});

	} else {

		var
			offset = parseInt(window.$body.css('top'), 10),
			offsetValue = Math.abs(offset);

		TweenMax.set(window.$body, {
			className: '-=body_lock-scroll',
			top: ''
		});

		$window.scrollTop(offsetValue);

	}

}

/*!========================================================================
	32. Restore Scroll Top
	======================================================================!*/
function restoreScrollTop() {
	if (window.SB !== undefined) {
		setTimeout(function () {
			window.SB.scrollTop = window.lastTop;
		}, 100);
	} else {
		$('html, body').animate({
			scrollTop: window.lastTop
		}, 100);
	}
}

/*!========================================================================
	33. Scroll To Very Top
	======================================================================!*/
function scrollToVeryTop() {

	window.scrollTo(0, 0);

	try {
		window.top.scrollTo(0, 0);
	} catch (error) {}
	if (window.SB !== undefined) {
		window.SB.scrollTop = 0;
	}

}

/*!========================================================================
	34. Section Composition
	======================================================================!*/
var SectionComposition = function ($scope) {

	var $target = $scope.find('.section-composition__content[data-os-animation]');

	if (!$target.length) {

		return;

	}

	$target.each(function () {

		var
			tl = new TimelineMax(),
			$current = $(this),
			$headlineProperty = $current.find('.figure-property__headline'),
			$property = $current.find('.figure-property');

		prepare();
		animate();

		function prepare() {

			TweenMax.set($headlineProperty, {
				scaleX: 0,
				transformOrigin: 'left center'
			});

		}

		function animate() {

			tl
				.to($headlineProperty, 1.2, {
					scaleX: 1,
					ease: Expo.easeInOut,
					transformOrigin: 'left center'
				})
				.add(animateLines($property, 0.8, 0.03), '-=1.2');

			createOSScene($current, tl, $property);

		}

	})

}

/*!========================================================================
	35. Section Content
	======================================================================!*/
var SectionContent = function ($scope) {

	var $target = $scope.find('.section-content[data-os-animation]');

	if (!$target.length) {

		return;

	}

	$target.each(function () {

		var
			tl = new TimelineMax(),
			$current = $(this),
			$headline = $current.find('.section__headline'),
			$headlineProperty = $current.find('.figure-property__headline'),
			$heading = $current.find('h2'),
			$subheading = $current.find('h3'),
			$property = $current.find('.figure-property');

		prepare();
		animate();

		function prepare() {

			hideWords($heading, 0.6, 0.02, '50px');

			TweenMax.set($headlineProperty, {
				scaleX: 0,
				transformOrigin: 'left center'
			});

			TweenMax.set($headline, {
				scaleX: 0,
				transformOrigin: 'left center'
			});

		}

		function animate() {

			if ($heading.length) {

				tl.add(animateWords($heading));

			}
			if ($headline.length) {

				tl.to($headline, 1.2, {
					scaleX: 1,
					ease: Expo.easeInOut
				}, '0');

			}

			if ($subheading.length) {

				tl.add(animateLines($subheading, 1.2, 0.01), '-=0.8')

			}

			if ($property.length) {

				$property.each(function () {
					tl.add(animateLines($(this), 1.2, 0.01), '-=1.8');
					tl.to($(this).find($headlineProperty), 1.2, {
						scaleX: 1,
						ease: Expo.easeInOut,
						transformOrigin: 'left center'
					}, '0');
				});

			}

			createOSScene($current, tl);

		}

	})

}

/*!========================================================================
	36. Section Half Screen Slider
	======================================================================!*/
var SectionHalfScreenSlider = function ($scope) {

	var $target = $scope.find('.section-halfscreen-slider[data-os-animation]');

	if (!$target.length) {

		return;

	}

	var
		$slider = $target.find('.js-slider-halfscreen'),
		$wrapperImg = $('.slider-halfscreen__images-slide .slider-halfscreen__images-slide-inner'),
		$heading = $slider.find('h2'),
		$description = $slider.find('p'),
		$link = $slider.find('.slider-halfscreen__link span'),
		$linkLine = $slider.find('.slider-halfscreen__link-line'),
		$prev = $slider.find('.slider-halfscreen__arrow_prev .slider__arrow-inner'),
		$next = $slider.find('.slider-halfscreen__arrow_next .slider__arrow-inner');

	prepare().then(function () {
		animate();
	});

	function prepare() {

		return new Promise(function (resolve, reject) {

			var tl = new TimelineMax();

			tl
				.add(function () {
					new SliderHalfScreen($slider);
				})
				.set($prev, {
					y: '-50px',
					autoAlpha: 0
				})
				.set($next, {
					y: '50px',
					autoAlpha: 0
				})
				.set($wrapperImg, {
					autoAlpha: 0,
					scale: 1.1
				})
				.add(hideWords($link, '0', '0', '30px'))
				.set($linkLine, {
					scaleX: 0,
					transformOrigin: 'left center'
				})
				.add(function () {
					setLines($description);
				})
				.add(hideWords($heading, '0', '0', '-50px'))
				.add(function () {
					resolve(true);
				});

		});

	}

	function animate() {

		var tl = new TimelineMax();

		tl
			.add(animateWords($slider.find('.swiper-slide-active h2'), 1.2, 0.02, true), '0')
			.add(animateLines($slider.find('.swiper-slide-active p'), 1.2, 0.01), '0.6')
			.add(animateWords($link, 1.2, 0.02), '1.2')
			.to($linkLine, 1.2, {
				scaleX: 1,
				ease: Expo.easeInOut
			}, '1.2')
			.to($wrapperImg, 1.2, {
				scale: 1,
			}, '0.3')
			.to($wrapperImg, 1.2, {
				autoAlpha: 1,
			}, '0.3')
			.to([$prev, $next], 1.2, {
				autoAlpha: 1,
				y: '0px'
			}, '0');

		createOSScene($target, tl);

	}


}

/*!========================================================================
	37. Section Headings Slider
	======================================================================!*/
var SectionHeadingsSlider = function ($scope) {

	var $target = $scope.find('.section-headings-slider[data-os-animation]');

	if (!$target.length) {

		return;

	}

	var
		$slider = $target.find('.js-slider-headings'),
		$counter = $slider.find('.slider-headings__counter'),
		$heading = $slider.find('h2'),
		$prev = $slider.find('.slider-headings__arrow_prev .slider__arrow-inner'),
		$next = $slider.find('.slider-headings__arrow_next .slider__arrow-inner'),
		$dots = $slider.find('.slider__dots'),
		$backgrounds = $slider.find('.slider__background');

	prepare().then(function () {
		animate();
	})

	function prepare() {

		return new Promise(function (resolve, reject) {

			var tl = new TimelineMax();

			tl
				.add(function () {
					new SliderHeadings($slider);
				})
				.set($prev, {
					x: '-50px',
					autoAlpha: 0
				})
				.set($next, {
					x: '50px',
					autoAlpha: 0
				})
				.add(hideWords($heading, '0', '0', '-100px'))
				.set($counter, {
					autoAlpha: 0,
				})
				.set($dots, {
					autoAlpha: 0,
					y: '50px'
				})
				.add(function () {
					resolve(true);
				});

		});

	}

	function animate() {

		var tl = new TimelineMax();

		tl
			.add(animateWords($slider.find('.swiper-slide-active h2'), 1.2, 0.02, true), '0')
			.to([$prev, $next], 1.2, {
				autoAlpha: 1,
				x: '0px'
			}, '0')
			.to($dots, 1.2, {
				autoAlpha: 1,
				y: '0px'
			}, '0')
			.to($counter, 1.2, {
				autoAlpha: 1,
			}, '0.3')
			.add(function () {
				new SliderBackgrounds($backgrounds);
			}, '0.6');

		createOSScene($target, tl);

	}


}

/*!========================================================================
	38. Section Intro
	======================================================================!*/
var SectionIntro = function ($scope) {

	var $target = $scope.find('.section-intro[data-os-animation]');

	if (!$target.length) {

		return;

	}

	var
		$headline = $target.find('.section-intro__headline'),
		$heading = $target.find('h1');

	prepare();
	animate();

	function prepare() {

		TweenMax.set($headline, {
			scaleX: 0,
			transformOrigin: 'left center'
		});

	}

	function animate() {

		var tl = new TimelineMax();

		tl
			.add(animateLines($heading, 1.2, 0.01))
			.to($headline, 0.6, {
				scaleX: 1,
				ease: Expo.easeInOut
			}, '0.3')

		createOSScene($target, tl);

	}

}

/*!========================================================================
	39. Section Masthead
	======================================================================!*/
var SectionMasthead = function ($scope) {

	var $target = $scope.find('.section-masthead[data-os-animation]');

	if (!$target.length) {

		return;

	}

	var
		$headline = $target.find('.section__headline'),
		$heading = $target.find('h1'),
		$subheading = $target.find('h2'),
		$properties = $target.find('.figure-property');

	prepare();
	animate();

	function prepare() {

		TweenMax.set($headline, {
			scaleX: 0,
			transformOrigin: 'left center'
		});

		hideWords($heading, 0, 0);

	}

	function animate() {

		var tl = new TimelineMax();

		// if ($headline.length) {

		tl.to($headline, 1.2, {
			scaleX: 1,
			ease: Expo.easeInOut
		}, '0');

		// }

		// if ($heading.length) {
		tl.add(animateWords($heading, 1.2, 0.03, true), '0');
		// }

		// if ($subheading.length) {
		tl.add(animateLines($subheading, 1.2, 0.01), '0.6');
		// }

		// if ($properties.length) {
		tl.add(animateLines($properties, 1.2, 0.02), '0.6');
		// }

		// if ($overlay.length) {
		// 	tl.to($overlay, 1.2, {
		// 		opacity: initialOpacity,
		// 		ease: Expo.easeInOut
		// 	}, '0');
		// }

		createOSScene($target, tl);

	}

}

/*!========================================================================
	40. Section Nav Projects
	======================================================================!*/
var SectionNavProjects = function ($scope) {

	var $target = $scope.find('.section-nav-projects');

	if (!$target.length) {

		return;

	}

	var $backgrounds = $target.find('.section-nav-projects__background');

	$document
		.on('mouseenter touchstart', '.section-nav-projects__inner[data-post-id]', function () {
			var
				postId = $(this).data('post-id'),
				$targetBackground = $backgrounds.filter('[data-background-for="' + postId + '"]');

			if (!$targetBackground.length) {
				return;
			}

			$backgrounds.filter('active').removeClass('active');
			$targetBackground.addClass('active');

		})
		.on('mouseleave touchend', '.section-nav-projects__inner[data-post-id]', function () {

			$backgrounds.filter('.active').removeClass('active');

		})
		.on('click', 'a[data-post-id]', function () {

			var
				postId = $(this).data('post-id'),
				$targetBackground = $backgrounds.filter('[data-background-for="' + postId + '"]'),
				$targetBackgroundGlobal = window.$backgrounds.filter('[data-background-for="' + postId + '"]');

			if (!$targetBackground.length) {
				return;
			}

			$backgrounds.filter('active').removeClass('active');
			$targetBackgroundGlobal.addClass('selected');
			$targetBackground.addClass('selected');

		});

}

/*!========================================================================
	41. Section Text Slider
	======================================================================!*/
var SectionTextSlider = function ($scope) {

	var $target = $scope.find('.section-text-slider[data-os-animation]');

	if (!$target.length) {

		return;

	}

	var
		$slider = $target.find('.js-slider-text'),
		$backgrounds = $slider.find('.slider__background'),
		$helper = $target.find('.slider-text__helper'),
		$helperNormal = $target.find('.slider-text__helper-label-normal'),
		$helperView = $target.find('.slider-text__helper-label-view'),
		$helperIconLeft = $slider.find('.slider-text__helper-icon_left'),
		$helperIconRight = $slider.find('.slider-text__helper-icon_right');

	prepare().then(function () {
		animate();
	});

	function prepare() {

		return new Promise(function (resolve, reject) {

			var tl = new TimelineMax();

			tl
				.set($helper, {
					y: '20px',
					autoAlpha: 0
				})
				.set($target.find('.slider-text__line'), {
					transformOrigin: 'left center',
					scaleX: 0
				})
				.add(hideWords($target.find('h2'), '0', '0', '-30px', true))
				.add(hideWords($target.find('.slider-text__counter'), '0', '0', '-30px', true))
				.add(hideWordsVertical($helperNormal, '0', '0', '10px'))
				.add(hideWordsVertical($helperView, '0', '0', '10px'))
				.add(function () {
					new SliderText($slider);
				})
				.add(function () {
					resolve(true);
				});

		});

	}

	function animate() {

		var tl = new TimelineMax();

		tl
			.to($helper, 0.6, {
				autoAlpha: 1,
				y: '0px'
			})
			.add(animateWords($target.find('.slider-text__counter'), 1.2, 0.01, true), '0')
			.add(animateWords($helperNormal, 0.6, 0.01, true), '0')
			.add(animateWords($target.find('.slider-text__upper h2'), 1.2, 0.01), '0')
			.add(animateWords($target.find('.slider-text__lower h2'), 1.2, 0.01), '0')
			.staggerTo($target.find('.slider-text__line'), 1.2, {
				scaleX: 1,
				ease: Expo.easeInOut
			}, 0.01, '0')
			.add(function () {
				hoverBackgrounds();
				new SliderBackgrounds($backgrounds);
			}, '0.6');


		createOSScene($target, tl);

	}

	function hoverBackgrounds() {

		var tl = new TimelineMax();

		$document
			.on('mouseenter touchstart', '.slider-text a[data-slide-id]', function () {

				tl
					.clear()
					.set($helper, {
						className: '+=color-white'
					})
					.to($helperIconLeft, 0.6, {
						x: '30px',
						rotation: 180,
						ease: Expo.easeInOut
					}, '0')
					.to($helperIconRight, 0.6, {
						x: '-30px',
						rotation: 180,
						ease: Expo.easeInOut
					}, '0')
					.add(hideWordsVertical($helperNormal, 0.6, 0.01, '30px', true), '0')
					.add(animateWords($helperView, 0.6, 0.01, true), '-=0.6');

			})
			.on('mouseleave touchend', '.slider-text a[data-slide-id]', function () {

				tl
					.clear()
					.set($helper, {
						className: '-=color-white'
					})
					.to($helperIconLeft, 0.6, {
						x: '0px',
						rotation: 0,
						ease: Expo.easeInOut
					}, '0')
					.to($helperIconRight, 0.6, {
						x: '0px',
						rotation: 0,
						ease: Expo.easeInOut
					}, '0')
					.add(hideWordsVertical($helperView, 0.6, 0.01, '-30px'), '0')
					.add(animateWords($helperNormal, 0.6, 0.01), '-=0.6');

			});

	}

}

/*!========================================================================
	42. Slider Backgrounds
	======================================================================!*/
var SliderBackgrounds = function ($backgrounds) {

	var $sliders = $('.section-headings-slider');

	$document
		.on('mouseenter touchstart', '.slider a[data-slide-id]', function () {
			var
				postId = $(this).data('slide-id'),
				$targetBackground = $backgrounds.filter('[data-background-for="' + postId + '"]');

			if (!$targetBackground.length) {
				return;
			}

			$targetBackground.addClass('active');
			window.$header.removeClass('header_black').addClass('header_white');
			$sliders.addClass('color-white');

		})
		.on('mouseleave touchend', '.slider a[data-slide-id]', function () {

			$backgrounds.filter('.active').removeClass('active');
			window.$header.removeClass('header_white').addClass('header_black');
			$sliders.removeClass('color-white');

		})
		.on('click', '.slider a[data-slide-id]', function () {

			var
				postId = $(this).data('slide-id'),
				$targetBackground = $backgrounds.filter('[data-background-for="' + postId + '"]'),
				$targetBackgroundGlobal = window.$backgrounds.filter('[data-background-for="' + postId + '"]');

			if (!$targetBackground.length) {
				return;
			}

			$backgrounds.filter('active').removeClass('active');
			$targetBackgroundGlobal.addClass('selected');
			$targetBackground.addClass('selected');

		});

}

/*!========================================================================
	43. Render Slider Counter
	======================================================================!*/
function renderSliderCounter(sliderMain, sliderCounter, slideClass, elTotal) {

	if (!sliderMain.slides.length) {
		return;
	}

	var
		numOfSlides = sliderMain.slides.length,
		startSlides = 1,
		prefixCurrent = '00',
		prefixTotal = numOfSlides >= 10 ? '0' : '00';

	var counter = new Swiper(sliderCounter, {
		direction: 'vertical',
		simulateTouch: false,
	});

	counter.removeAllSlides();

	for (var index = startSlides; index <= numOfSlides; index++) {

		if (index >= 10) {

			prefixCurrent = '0';

		}

		counter.appendSlide('<div class="swiper-slide"><div class="' + slideClass + '">' + prefixCurrent + index + '</div></div>');

	}


	$(elTotal).html(prefixTotal + numOfSlides);

	sliderMain.controller.control = counter;
	counter.controller.control = sliderMain;
}

/*!========================================================================
	44. Slider Half Screen
	======================================================================!*/
var SliderHalfScreen = function ($slider) {

	if (!$slider.length) {
		return;
	}

	var
		$heading = $slider.find('h2'),
		$description = $slider.find('p'),
		$link = $slider.find('.slider-halfscreen__wrapper-link'),
		tl = new TimelineMax(),
		$sliderImg = $slider.find('.js-slider-halfscreen__images'),
		$sliderContent = $slider.find('.js-slider-halfscreen__content'),
		overlapFactor = $sliderImg.data('overlap-factor') || 0;

	createSliders();
	hoverLinks();

	function createSliders() {

		var sliderImg = new Swiper($sliderImg, {
			autoplay: {
				enabled: $sliderImg.data('autoplay-enabled') || false,
				delay: $sliderImg.data('autoplay-delay') || 6000,
				disableOnInteraction: true
			},
			direction: 'vertical',
			preloadImages: true,
			lazy: {
				loadPrevNext: true,
				loadOnTransitionStart: true
			},
			speed: $sliderImg.data('speed') || 1200,
			simulateTouch: false,
			allowTouchMove: true,
			watchSlidesProgress: true,
			on: {
				progress: function () {
					var swiper = this;
					for (var i = 0; i < swiper.slides.length; i++) {

						var slideProgress = swiper.slides[i].progress,
							innerOffset = swiper.width * overlapFactor,
							innerTranslate = slideProgress * innerOffset;

						try {
							TweenMax.set(swiper.slides[i].querySelector('.slider-halfscreen__bg'), {
								y: innerTranslate + 'px',
								transition: swiper.params.speed + 'ms',
								rotationZ: 0.01,
								force3D: true
							});
						} catch (error) {

						}

					}
				},
				touchStart: function () {
					var swiper = this;
					for (var i = 0; i < swiper.slides.length; i++) {
						try {
							TweenMax.set(swiper.slides[i].querySelector('.slider-halfscreen__bg'), {
								transition: '',
								rotationZ: 0.01,
								force3D: true
							});
						} catch (error) {

						}

					}
				},
			}
		});

		var sliderContent = new Swiper($sliderContent, {
			simulateTouch: false,
			direction: 'vertical',
			effect: 'fade',
			fadeEffect: {
				crossFade: true
			},
			mousewheel: {
				eventsTarged: '.page-wrapper',
				releaseOnEdges: true,
			},
			keyboard: {
				enabled: true
			},
			navigation: {
				nextEl: '.js-slider-halfscreen__next',
				prevEl: '.js-slider-halfscreen__prev',
			},
			speed: $sliderImg.data('speed') || 1200,
			allowTouchMove: true,
			breakpoints: {
				992: {
					autoHeight: true
				}
			}
		});

		sliderContent.update();

		sliderContent.on('slideChange', () => {

			if (sliderContent.realIndex > sliderContent.previousIndex) {
				slideChangeTransition('next');
			}

			if (sliderContent.realIndex < sliderContent.previousIndex) {
				slideChangeTransition('prev');
			}

		});

		function slideChangeTransition(direction = 'next') {

			var
				$activeSlide = $(sliderContent.slides[sliderContent.realIndex]),
				$activeHeading = $activeSlide.find($heading),
				$activeLink = $activeSlide.find($link),
				$activeDescription = $activeSlide.find($description);

			tl.clear();

			$heading.each(function () {
				tl
					.add(hideWords($(this), 0.3, 0.02, direction === 'next' ? '50px' : '-50px', direction === 'next' ? true : false), '0')
					.add(hideWords($heading, '0', '0', direction === 'next' ? '-50px' : '50px'));
			});

			$description.each(function () {
				tl.add(hideLines($(this), 0.6, 0.01, '100%', true), '0');
			});

			$link.each(function () {
				tl.to($(this), 0.6, {
					y: '15px',
					autoAlpha: 0
				}, '0');
			});

			tl
				.add(animateWords($activeHeading, 1.2, 0.02, direction === 'next' ? true : false))
				.add(animateLines($activeDescription, 1.2, 0.01, direction === 'next' ? true : false), '-=1.2')
				.to($activeLink, 0.6, {
					y: '0px',
					autoAlpha: 1
				}, '-=1.2');

		}

		sliderImg.controller.control = sliderContent;
		sliderContent.controller.control = sliderImg;

	}

	function hoverLinks() {

		$document
			.on('mouseenter touchstart', '.slider-halfscreen__link', function () {

				var $targetBackground = $sliderImg.find('.swiper-slide-active .slider-halfscreen__images-slide-inner'),
					$linkLine = $sliderContent.find('.swiper-slide-active .slider-halfscreen__link-line');

				if (!$targetBackground.length) {
					return;
				}

				TweenMax.to($targetBackground, 0.6, {
					scale: 1.05,
					ease: Expo.easeInOut
				});

				TweenMax.to($linkLine, 0.6, {
					width: '70px',
					ease: Expo.easeInOut
				});

			})
			.on('mouseleave touchend', '.slider-halfscreen__link', function () {

				var $targetBackground = $sliderImg.find('.swiper-slide-active .slider-halfscreen__images-slide-inner'),
					$linkLine = $sliderContent.find('.swiper-slide-active .slider-halfscreen__link-line');

				if (!$targetBackground.length) {
					return;
				}

				TweenMax.to($targetBackground, 0.6, {
					scale: 1,
					ease: Expo.easeInOut
				});

				TweenMax.to($linkLine, 0.6, {
					width: '60px',
					ease: Expo.easeInOut
				});

			});

	}

}

/*!========================================================================
	45. Slider Headings
	======================================================================!*/
var SliderHeadings = function ($slider) {

	if (!$slider.length) {
		return;
	}

	var
		$heading = $slider.find('h2'),
		$description = $slider.find('p'),
		tl = new TimelineMax(),
		slider = new Swiper($slider, {
			simulateTouch: false,
			allowTouchMove: true,
			effect: 'fade',
			fadeEffect: {
				crossFade: true
			},
			speed: 1200,
			centeredSlides: true,
			mousewheel: {
				eventsTarged: '.page-wrapper',
				releaseOnEdges: true,
			},
			keyboard: {
				enabled: true
			},
			pagination: {
				el: '.js-slider-headings__dots',
				type: 'bullets',
				bulletElement: 'div',
				clickable: true,
				bulletClass: 'slider__dot',
				bulletActiveClass: 'slider__dot_active'
			},
			navigation: {
				nextEl: '.js-slider-headings__next',
				prevEl: '.js-slider-headings__prev',
			},
			breakpoints: {
				768: {
					slidesPerView: 1,
					centeredSlides: true,
				}
			}
		});

		slider.on('slideChange', () => {

			if (slider.realIndex > slider.previousIndex) {
				slideChangeTransition('next');
			}
	
			if (slider.realIndex < slider.previousIndex) {
				slideChangeTransition('prev');
			}
	
		});
	
		function slideChangeTransition(direction = 'next') {
	
			var
				$activeSlide = $(slider.slides[slider.realIndex]),
				$activeDescription = $activeSlide.find($description),
				$activeHeading = $activeSlide.find($heading);
	
			tl.clear();
	
			$heading.each(function () {
				tl
					.add(hideWords($(this), 0.3, 0.02, direction === 'next' ? '50px' : '-50px', direction === 'next' ? true : false), '0')
					.add(hideWords($heading, '0', '0', direction === 'next' ? '-50px' : '50px'))
			});
	
			$description.each(function () {
				tl.add(hideLines($(this), 0.6, 0.01, '100%', true), '0');
			});
	
			tl
				.add(animateWords($activeHeading, 1.2, 0.02, direction === 'next' ? true : false))
				.add(animateLines($activeDescription, 1.2, 0.01, direction === 'next' ? true : false), '-=1.2');
	
		}

	renderSliderCounter(
		slider,
		$slider.find('.js-slider-headings-counter-current'),
		'slider-headings__counter-number',
		''
	);

}

/*!========================================================================
	46. Slider Images
	======================================================================!*/
var SliderImages = function ($scope) {

	var $slider = $scope.find('.js-slider-images');

	if (!$slider.length) {
		return;
	}

	$slider.each(function () {

		var $current = $(this);

		var
			breakpoints = {},
			lg = window.elementorFrontend ? window.elementorFrontend.config.breakpoints.lg - 1 : 1024,
			md = window.elementorFrontend ? window.elementorFrontend.config.breakpoints.md - 1 : 767;

		breakpoints[lg] = {
			slidesPerView: $current.data('slides-per-view-tablet') || 1.33,
			spaceBetween: $current.data('space-between-tablet') || 30,
			centeredSlides: $current.data('centered-slides-tablet') || true,
		};
		breakpoints[md] = {
			slidesPerView: $current.data('slides-per-view-mobile') || 1.33,
			spaceBetween: $current.data('space-between-mobile') || 30,
			centeredSlides: $current.data('centered-slides-mobile') || true,
		};

		var slider = new Swiper($current, {
			autoHeight: $current.data('auto-height') || false,
			speed: $current.data('speed') || 1200,
			preloadImages: false,
			lazy: {
				loadPrevNext: true,
				loadOnTransitionStart: true
			},
			watchSlidesProgress: true,
			watchSlidesVisibility: true,
			centeredSlides: $current.data('centered-slides') || false,
			slidesPerView: $current.data('slides-per-view') || 1.5,
			autoplay: {
				enabled: $current.data('autoplay-enabled') || false,
				delay: $current.data('autoplay-delay') || 6000,
			},
			spaceBetween: $current.data('space-between') || 80,
			pagination: {
				el: '.js-slider-images-progress',
				type: 'progressbar',
				progressbarFillClass: 'slider__progressbar-fill',
				renderProgressbar: function (progressbarFillClass) {
					return '<div class="' + progressbarFillClass + '"></div>'
				}
			},
			navigation: {
				nextEl: '.js-slider-images__next',
				prevEl: '.js-slider-images__prev',
			},
			breakpoints: breakpoints
		});

		// update height after images are loaded
		slider.on('lazyImageReady', function () {
			slider.update();
		});

		renderSliderCounter(
			slider,
			$current.find('.js-slider-images-counter-current'),
			'',
			$current.find('.js-slider-images-counter-total')
		);

	});

}

/*!========================================================================
	47. Slider Testimonials
	======================================================================!*/
var SliderTestimonials = function ($scope) {

	var $slider = $scope.find('.js-slider-testimonials');

	if (!$slider.length) {
		return;
	}

	$slider.each(function () {

		var
			$current = $(this).find('.js-slider-testimonials__items'),
			$header = $(this).find('.js-slider-testimonials__header');

		var sliderItems = new Swiper($current, {
			autoHeight: true,
			autoplay: {
				enabled: $current.data('autoplay-enabled') || false,
				delay: $current.data('autoplay-delay') || 6000,
			},
			speed: $current.data('speed') || 1200,
			preloadImages: false,
			lazy: {
				loadPrevNext: true,
				loadOnTransitionStart: true
			},
			watchSlidesProgress: true,
			watchSlidesVisibility: true,
			pagination: {
				el: '.js-slider-testimonials__dots',
				type: 'bullets',
				bulletElement: 'div',
				clickable: true,
				bulletClass: 'slider__dot',
				bulletActiveClass: 'slider__dot_active'
			},
		});

		var sliderHeader = new Swiper($header, {
			slideToClickedSlide: true,
			slidesPerView: 4.5,
			centeredSlides: true,
			speed: $current.data('speed') || 1200,
			autoplay: {
				enabled: $current.data('autoplay-enabled') || false,
				delay: $current.data('autoplay-delay') || 6000,
			},
			breakpoints: {
				1200: {
					slidesPerView: 3.5
				},
				767: {
					slidesPerView: 2
				},
				480: {
					slidesPerView: 1
				}
			}
		});

		// update height after images are loaded
		sliderItems.on('lazyImageReady', function () {
			sliderItems.update();
		});

		sliderItems.controller.control = sliderHeader;
		sliderHeader.controller.control = sliderItems;

	});

}

/*!========================================================================
	48. Slider Text
	======================================================================!*/
var SliderText = function ($slider) {

	if (!$slider.length) {
		return;
	}

	var
		$upper = $slider.find('.js-slider-text__upper'),
		$lower = $slider.find('.js-slider-text__lower'),
		options = {
			speed: 2000,
			slidesPerView: 'auto',
			centeredSlides: true,
			loop: true,
			touchRatio: 2,
			mousewheel: {
				eventsTarged: '.page-wrapper',
				releaseOnEdges: true,
			},
			breakpoints: {
				768: {
					slidesPerView: 1,
					centeredSlides: true,
				}
			},
			controller: {
				by: 'container'
			}
		};

	var sliderUpper = new Swiper($upper, options);
	var sliderLower = new Swiper($lower, options);

	sliderUpper.controller.control = sliderLower;
	sliderLower.controller.control = sliderUpper;

}

/*!========================================================================
	49. Social
	======================================================================!*/
var Social = function () {

	var $elements = $('.social__item a');

	if (!$elements.length) {
		return;
	}

	var circle = new Circle();

	$elements.each(function () {
		circle.animate($(this));
	});

}

/*!========================================================================
	50. Animate Lines
	======================================================================!*/
function animateLines($target, duration = 1.2, stagger = 0.02, offset = '-=0.6') {

	var
		tl = new TimelineMax(),
		$headlineProperty = $target.find('.figure-property__headline'),
		$words = $target.find('.split-text__word');

	if ($headlineProperty.length) {

		tl
			.to($headlineProperty, duration, {
				ease: Expo.easeOut,
				scaleX: 1
			}, '0');

	}

	if ($words.length) {

		tl
			.staggerTo($words, duration, {
				y: '0%',
				ease: Power3.easeOut,
				autoAlpha: 1,
			}, stagger, offset);

	};

	return tl;

}

/*!========================================================================
	51. Animate Words
	======================================================================!*/
function animateWords($target, duration = 1.2, stagger = 0.01, reverse, masterStagger) {

	var masterTL = new TimelineMax();

	if ($target.length) {

		$target.each(function () {

			var
				tl = new TimelineMax(),
				$chars = $(this).find('.split-chars__char');

			if (reverse) {
				$chars = $chars.get().reverse();
			}

			if (!masterStagger) {
				masterStagger = '-=' + duration;
			}

			tl.staggerTo($chars, duration, {
				x: '0px',
				y: '0px',
				autoAlpha: 1,
				ease: Power4.easeOut
			}, stagger);

			masterTL.add(tl, masterStagger);

		});

	};

	return masterTL;

}

/*!========================================================================
	52. Do Split Text
	======================================================================!*/
function doSplitText($target) {

	var
		$words = $($target).find('.split-text'),
		$chars = $($target).find('.split-chars');

	return new Promise(function (resolve, reject) {

		if ($words.length) {

			TweenMax.set($words, {
				autoAlpha: 1,
			});

			new SplitText($words, {
				type: 'words, lines',
				linesClass: 'split-text__line',
				wordsClass: 'split-text__word',
			});

		}

		if ($chars.length) {

			TweenMax.set($chars, {
				autoAlpha: 1,
			});

			new SplitText($chars, {
				type: 'words, chars',
				// linesClass: 'split-chars__line',
				wordsClass: 'split-text__word',
				charsClass: 'split-chars__char'
			});


		}

		resolve(true);

	});

}

/*!========================================================================
	53. Hide Lines
	======================================================================!*/
function hideLines($target, duration = 0.6, stagger = 0.02, offset = '-100%', reverse) {

	var
		tl = new TimelineMax(),
		$words = $target.find('.split-text__word');

	if (reverse) {
		$words = $words.get().reverse();
	}

	if ($words.length) {

		tl.staggerTo($words, duration, {
			y: offset
		}, stagger);

	};

	return tl;

}

/*!========================================================================
	54. Hide Words
	======================================================================!*/
function hideWords($target, duration = 0.6, stagger = 0.02, offset = '-30px', reverse, masterStagger, direction = 'x') {

	var masterTL = new TimelineMax();

	if ($target.length) {

		$target.each(function () {

			var
				tl = new TimelineMax(),
				$chars = $(this).find('.split-chars__char'),
				options = {};

			if (reverse) {
				$chars = $chars.get().reverse();
			}

			if (!masterStagger) {
				masterStagger = '-=' + duration;
			}

			if (direction == 'x') {
				options = {
					x: offset,
					autoAlpha: 0
				};
			} else {
				options = {
					y: offset,
					autoAlpha: 0
				}
			}

			tl.staggerTo($chars, duration, options, stagger);

			masterTL.add(tl, masterStagger);
		});

	};

	return masterTL;

}

/*!========================================================================
	55. Hide Words Vertical
	======================================================================!*/
function hideWordsVertical($target, duration = 0.6, stagger = 0.02, offset = '-30px', reverse, masterStagger) {

	var masterTL = new TimelineMax();

	if ($target.length) {

		$target.each(function () {

			var
				tl = new TimelineMax(),
				$chars = $(this).find('.split-chars__char');

			if (reverse) {
				$chars = $chars.get().reverse();
			}

			if (!masterStagger) {
				masterStagger = '-=' + duration;
			}

			tl.staggerTo($chars, duration, {
				y: offset,
				autoAlpha: 0
			}, stagger);

			masterTL.add(tl, masterStagger);
		});

	};

	return masterTL;

}

/*!========================================================================
	56. Set Lines
	======================================================================!*/
function setLines($target = $document, direction = 'vertical') {

	var
		$words = $target.find('.split-text .split-text__word'),
		$chars = $target.find('.split-chars .split-text__char');

	if (direction == 'vertical') {

		TweenMax.set($words, {
			y: '100%',
		});

		TweenMax.set($chars, {
			y: '100%',
		});

	} else {

		TweenMax.set($chars, {
			x: '50px',
			autoAlpha: 0
		});

	}

}

/*!========================================================================
	57. Debounce
	======================================================================!*/
function debounce(func, wait, immediate) {

	var timeout;

	return function () {

		var
			context = this,
			args = arguments;

		var later = function () {

			timeout = null;

			if (!immediate) {
				func.apply(context, args)
			};

		};

		var callNow = immediate && !timeout;

		clearTimeout(timeout);

		timeout = setTimeout(later, wait);

		if (callNow) {
			func.apply(context, args)
		};

	};

};

/*!========================================================================
	58. Fix Mobile Bar Height
	======================================================================!*/
function fixMobileBarHeight() {

	var vh;

	/**
	 * Initial set
	 */
	createStyleElement();
	setVh();

	/**
	 * Resize handling (with debounce)
	 */
	$(window).on('resize', debounce(function () {
		setVh();
	}, 250));

	/**
	 * 100vh elements height correction
	 */
	function setVh() {

		vh = window.innerHeight * 0.01;

		$('#rubenz-fix-bar').html(':root { --fix-bar-vh: ' + vh + 'px; }\n');

	}

	function createStyleElement() {

		if (!$('#rubenz-fix-bar').length) {
			$('head').append('<style id=\"rubenz-fix-bar\"></style>');
		}

	}

}

/*!========================================================================
	59. Run On High Performance GPU
	======================================================================!*/
function runOnHighPerformanceGPU() {

	var webGLCanvas = document.getElementById('js-webgl');

	if (typeof webGLCanvas !== 'undefined' && webGLCanvas !== null) {
		webGLCanvas.getContext('webgl', {
			powerPreference: 'high-performance'
		});
	}

}


})(jQuery);
