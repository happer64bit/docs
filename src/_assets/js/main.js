// Swup Core
import Swup from 'swup';
// Swup Plugins
import SwupDebugPlugin from '@swup/debug-plugin';
import SwupScrollPlugin from '@swup/scroll-plugin';
import SwupBodyClassPlugin from '@swup/body-class-plugin';
import SwupGtagPlugin from 'swup-gtag-plugin';
import SwupPreloadPlugin from '@swup/preload-plugin';

// Swup Themes
import SwupSlideTheme from '@swup/slide-theme';
import SwupFadeTheme from '@swup/fade-theme';
import SwupOverlayTheme from '@swup/overlay-theme';

var swup = new Swup({
	containers: ['#nav', '#swup'],
	plugins: [
		new SwupDebugPlugin(),
		new SwupScrollPlugin({
			animateScroll: {
				betweenPages: false,
				samePageWithHash: true,
				samePage: true
			}
		}),
		new SwupSlideTheme(),
		new SwupBodyClassPlugin(),
		new SwupPreloadPlugin(),
		new SwupGtagPlugin({
			gaMeasurementId: GA_MEASURE_ID
		})
	]
});

window.swup = swup;

var themes = {
	FadeTheme: SwupFadeTheme,
	SlideTheme: SwupSlideTheme,
	OverlayTheme: SwupOverlayTheme
};
var currentTheme = 'SlideTheme';

document.addEventListener('change', function (event) {
	if (event.target.name === 'theme') {
		swup.unuse(currentTheme);
		swup.use(new themes[event.target.value]());
		currentTheme = event.target.value;
		swup.cache.empty();
	}
});

function checkTheme() {
	if (document.querySelector('input[name="theme"]')) {
		document.querySelector('input[name="theme"][value="' + currentTheme + '"]').checked = true;
	}
}

function addHeadlineLinks() {
	document
		.getElementById('main-content')
		.querySelectorAll('h2, h3, h4, h5, h6')
		.forEach(function (element) {
			if (!element.matches('[id]')) return;
			const anchor = document.createElement('a');
			const link = window.location.origin + window.location.pathname + '#' + element.id;

			anchor.href = link;
			anchor.className = 'headline-anchor';
			anchor.innerHTML = '#';

			anchor.addEventListener('click', function (event) {
				navigator.clipboard.writeText(link);
			});

			element.appendChild(anchor);
		});
}

function isTouch() {
	return !window.matchMedia('(hover: hover)').matches;
}

function prepareExternalLinks() {
	// Don't do anything on touch devices
	if (isTouch()) return;
	// Open external links in a new tab for very specific contexts, only
	document
		.querySelectorAll('.navigation-list a[href], .main-content ul a[href]')
		.forEach((el) => {
			if (el.origin === window.location.origin) return;
			el.target = '_blank';
		});
}

function initPageView() {
	checkTheme();
	addHeadlineLinks();
	prepareExternalLinks();
}
swup.on('pageView', initPageView);
initPageView();

function resetSearch() {
	document.querySelector('.pagefind-ui__search-clear')?.click();
}
swup.on('clickLink', resetSearch);
document.addEventListener('click', (e) => {
	if (e.target.closest('#search')) return;
	resetSearch();
});
