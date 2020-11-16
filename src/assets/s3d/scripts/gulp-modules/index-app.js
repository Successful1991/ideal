document.addEventListener('DOMContentLoaded', global => {
	init()
})

function init() {
	window.createMarkup = CreateMarkup
	const config = {
		complex: {
			url: '',
			imageUrl: '/wp-content/themes/idealist/assets/s3d/images/idealist/complex/',
			class: 'js-s3d__wrapper',
			numberSlide: {
				min: 0,
				max: 179,
			},
			controlPoint: [11, 52, 109, 144],
			activeSlide: 11,
			mouseSpeed: 1,
			// mouseSpeed: 300,
		},
		// floor: {
		// 	id: 'js-s3d__wrapper',
		// },
		apart: {
			id: 'js-s3d__wrapper',
		},
	}

	let app
	new Promise(resolve => {
		loader(resolve)
	}).then(value => {
		if (isDevice('mobile') || !value) {
			$('.js-s3d__slideModule').addClass('s3d-mobile')
			config.complex.imageUrl += 'mobile/'
		}

		app = new App(config)
		app.init()

		$(window).resize(() => {
			app.resize()
		})
	})
}

window.checkValue = val => !val || val === null || val === undefined || (typeof val === 'number' && isNaN(val))
