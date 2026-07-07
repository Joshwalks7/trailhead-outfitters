const menuButton = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');

if (menuButton && siteNav) {
	menuButton.addEventListener('click', () => {
		const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
		const nextState = !isOpen;

		menuButton.setAttribute('aria-expanded', String(nextState));
		siteNav.classList.toggle('is-open', nextState);
	});
}