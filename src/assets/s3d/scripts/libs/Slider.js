class Slider {
	constructor(data) {
		this.type = data.type
		this.browser = data.browser
		this.x = 0
		this.pret = 0
		this.card = 0
		this.amount = 0
		this.urlBase = data.url
		this.imageUrl = data.imageUrl
		this.activeElem = data.activeSlide
		this.wrapperId = data.idCopmlex
		this.wrapper = $(`.js-s3d__wrapper__${this.wrapperId}`)
		this.ctx = document.getElementById(`js-s3d__${this.wrapperId}`).getContext('2d') // Контекст
		this.wrapperEvent = '.js-s3d__svgWrap'
		this.height = 1080
		this.width = 1920
		this.flagMouse = false
		this.currentSlide = data.activeSlide
		this.nextSlide = data.activeSlide
		// this.openHouses = [1]

		this.eventsName = {
			start: 'mousedown',
			end: 'mouseup',
			leave: 'mouseleave',
			move: 'mousemove',
		}

		this.svgConfig = data
		this.controlPoint = data.controlPoint
		this.images = []
		this.result = {
			min: data.numberSlide.min,
			max: data.numberSlide.max,
		}
		this.mouseSpeed = data.mouseSpeed
		this.numberSlide = {
			min: data.numberSlide.min,
			max: data.numberSlide.max,
		}
		this.startDegCompass = (360 / this.numberSlide.max)
		this.infoBox = ''
		this.infoBoxActive = false
		this.infoBoxHidden = true
		this.hoverFlatId = null
		this.activeSvg = null
		this.activeFloor = null
		this.rotate = true
		this.animates = () => {}
		this.ActiveHouse = data.ActiveHouse
		// this.resize = this.resize.bind(this)
		this.init = this.init.bind(this)
		this.changeBlockIndex = data.changeBlockIndex
		this.click = data.click
		this.getFlatObj = data.getFlatObj
		this.setActiveSvg = this.setActiveSvg.bind(this)
		this.activeFlat = data.activeFlat
		this.compass = data.compass
		this.changeNext = this.changeNext.bind(this)
		this.changePrev = this.changePrev.bind(this)
		this.updateActiveFlat = this.updateActiveFlat.bind(this)
		this.loader = data.loader
		this.addBlur = data.addBlur
		// this.unActive = data.unActive
		this.progress = 0
		this.loadImage = this.loadImage.bind(this)
		this.gyroscope = this.gyroscope.bind(this)
	}

	init() {
		// $('.gyroscope').on('click', event => this.gyroscopeStart())
		if (isDevice('ios')) {
			this.mouseSpeed = 0.5
		}
		if (isDevice()) {
			this.eventsName = {
				start: 'touchstart',
				end: 'touchend',
				leave: 'touchcancel',
				move: 'touchmove',
			}
			// this.gyroscopeStart()
		} else {
			this.wrapper.on(`${this.eventsName.end} ${this.eventsName.leave}`, e => {
				if (e.target.classList.contains('s3d__button') || e.target.classList.contains('s3d-infoBox__link')) return
				this.activeAnimate(false)
				this.amount = 0
				if (this.flagMouse) {
					this.flagMouse = false
					this.infoBoxHidden = false
					if (this.rewindToPoint(this.controlPoint)) {
						this.checkDirectionRotate()
						// this.checkResult()
					} else {
						this.updateSvgActive(this.type, 'activeElem')
					}
					// $(this.activeSvg).css({'fill':''});
				}
			})

			this.wrapper.on(this.eventsName.start, e => {
				if (e.target.classList.contains('s3d__button') || !this.rotate || e.target.classList.contains('s3d-infoBox__link')) return
				// this.hiddenInfo(e)
				this.rotateStart.call(this, e)
				this.activeAnimate(true)
			})

			this.wrapper.on(this.eventsName.move, this.wrapperEvent, e => {
				if (this.flagMouse && this.rotate) {
					if (!this.infoBoxHidden) {
						this.hiddenInfo(e)
						this.infoBoxHidden = true
						this.hoverFlatId = null
					}
					this.activeSvg = $(e.target).closest('svg')
					// this.activeSvg[0].style.opacity = 0
					this.activeSvg.css({ opacity: '0' })
					// $(this.activeSvg).css({'fill':'transparent'});
					this.checkMouseMovement.call(this, e)
				} else if (e.target.tagName === 'polygon' && !this.infoBoxActive) {
					if (this.hoverFlatId === +e.target.dataset.id) return
					this.hoverFlatId = +e.target.dataset.id
					this.updateInfo(this.getFlatObj(+e.target.dataset.id))
				} else if (!this.infoBoxActive) {
					this.hoverFlatId = null
					this.hiddenInfo(e)
				}
			})
		}
		// this.updateImage()

		this.createSvg()
		this.createInfo()
		this.createArrow()
		this.createBackground()
		this.firstLoadImage()

		this.wrapper.on('click touch', 'polygon', e => {
			e.preventDefault()
			this.infoBoxActive = true
			this.setStateInfoActive(this.getFlatObj(e.target.dataset.id))
			$('.js-s3d__svgWrap .active-flat').removeClass('active-flat')
			$(e.target).addClass('active-flat')
			$('.js-s3d-filter__table .active-flat').removeClass('active-flat')
			$(`.js-s3d-filter__table [data-id=${e.target.dataset.id}]`).addClass('active-flat')
			this.activeSvg = $(e.target).closest('svg')

			$(this.activeSvg).css({ opacity: '' })
			this.compass.save(this.compass.current)
		})

		this.infoBox.on('click', '.js-s3d-infoBox__close', () => {
			this.hiddenInfo()
		})
		this.infoBox.on('click', '.s3d-infoBox__link', event => {
			event.preventDefault()
			// this.loader.show()
			this.activeFlat.value = event.target.dataset.id
			// this.click(event, this.type)
			this.click(event.currentTarget.dataset.id, 'apart', event.currentTarget.dataset.id)
		})
		this.centerSlider(this.wrapper[0])
		$('.js-s3d-blink').on('click', () => this.flatBlink())
		// createMarkup('div' , '#js-s3d__wrapper', {
		//   class:'s3d__helper js-s3d__helper',
		//   content: '<img src="/wp-content/themes/idealist/assets/s3d/images/icon/help-arrow.svg" class="s3d-arrow"/><img src="/wp-content/themes/idealist/assets/s3d/images/icon/help-logo.svg" class="s3d__helper-logo"/> <div class="s3d__helper__text">Оберіть </br>будинок</div>'
		// });

		window.addEventListener('keydown', event => {
			const data = {
				dataset: {
					type: '',
				},
			}
			switch (event.keyCode) {
			case 37:
			case 100:
				data.dataset.type = 'prev'
				break
			case 39:
			case 102:
				data.dataset.type = 'next'
				break
			default:
				return false
			}
			this.checkDirectionRotate(data)
			return true
		})

		this.deb = this.debounce(this.resizeCanvas.bind(this), 300)
		$(window).resize(() => {
			this.deb(this)
		})

		// $(window).resize(() => {
		// 	this.resizeCanvas()
		// })
	}

	gyroscopeStart() {
		const self = this
		if (
			DeviceMotionEvent && typeof DeviceMotionEvent.requestPermission === 'function'
		) {
			DeviceMotionEvent.requestPermission()
			// alert('requestPermission true')
		} else {
			// alert('requestPermission false')
		}
		self.activeAnimate(true)
		window.addEventListener('deviceorientation', event => {
			this.gyroscope(event)
		}, true)
	}

	gyroscope(event) {
		$('.gyroscope').html(`X-axis', ${event.alpha}
								Y-axis', ${event.beta}
								Z-axis', ${event.gamma}
								${this.width}`)
		const cur = Math.round((event.alpha.toFixed(2) / 2))
		if (cur > this.currentSlide + 2 || cur < this.currentSlide - 2) {
			this.ctx.drawImage(this.images[cur], 0, 0, this.width, this.height)
		}
	}

	setConfig(data) {
		this.type = data.type || this.type
		this.urlBase = data.url || this.urlBase
		this.imageUrl = data.imageUrl || this.imageUrl
		this.activeElem = data.activeSlide || this.activeElem
		this.wrapperId = data.idCopmlex || this.wrapperId
		this.currentSlide = data.activeSlide || this.currentSlide
		this.nextSlide = data.activeSlide || this.nextSlide
		this.svgConfig = data || this.svgConfig
		this.controlPoint = data.controlPoint || this.controlPoint
		this.mouseSpeed = data.mouseSpeed || this.mouseSpeed
	}

	centerSlider(elem) {
		const scroll = (elem.scrollWidth - document.documentElement.offsetWidth) / 2
		this.wrapper.scrollLeft(scroll)
	}

	update(config) {
		// this.setConfig(config)
		// this.updateImage()
		this.loader.hide(this.type)
	}

	// обновить картинки в канвасе
	updateImage() {
		this.progress = 0
		this.ctx.canvas.width = this.width
		this.ctx.canvas.height = this.height
		this.loadImage(0, 'complex')
		this.setActiveSvg(this.ActiveHouse.get())
	}

	firstLoadImage() {
		// $('.js-s3d__slideModule').addClass('s3d-unActive')
		this.loader.turnOn($(this.wrapper).find('.s3d__button'))
		this.ctx.canvas.width = this.width
		this.ctx.canvas.height = this.height
		const self = this
		const img = new Image()
		const index = this.activeElem
		img.src = `${this.imageUrl + index}.jpg`
		img.dataset.id = index
		img.onload = function load() {
			self.images[index] = this
			self.compass.save(index)
			self.compass.set(index)

			self.ctx.drawImage(this, 0, 0, self.width, self.height)
			setTimeout(() => {
				self.loader.hide(self.type)
				self.loader.miniOn()
			}, 300)
			self.rotate = false
			// self.loader.hide(self.type)
			self.changeBlockIndex(self.type)
			self.resizeCanvas()
			self.loadImage(0)
		}
	}

	loadImage(i, type) {
		const self = this
		const img = new Image()
		const index = i
		img.src = `${this.imageUrl + index}.jpg`
		img.dataset.id = index
		img.onload = function load() {
			self.images[index] = this
			self.progressBarUpdate()
			if (index === self.numberSlide.max) {
				self.resizeCanvas()
				self.ctx.drawImage(self.images[self.activeElem], 0, 0, self.width, self.height)
				setTimeout(() => {
					self.loader.turnOff($(self.wrapper[0]).find('.s3d-button'))
					self.loader.miniOff()
				}, 350)
				// self.unActive()
				// self.loader.hide(self.type)
				self.rotate = true
				return index
			}
			return self.loadImage(i + 1)
		}

		img.onerror = function (e) {
			// console.log('error')
			// self.sendResponsiveError(this, self)
			if (type === 'error') {
				self.sendResponsiveError(this, self)
			} else {
				self.loadImage(+this.dataset.id, 'error')
			}
			// self.repeatLoadImage(this.dataset.id)
		}
	}

	sendResponsiveError(elem, self) {
		const res = Object.assign(self.browser, {
			project: 'idealist --wp',
			url: elem.src || elem.dataset.id || 'пусто',
			type: type || 'error',
			text: 'new',
		})
		$.ajax('/wp-admin/admin-ajax.php', {
			method: 'POST',
			data: {
				data: res, action: '3dDebuger',
			},
		}).then(resolve => console.log(resolve))
	}

	progressBarUpdate() {
		if (this.progress >= this.numberSlide.max) {
			// setTimeout(() => {
			// 	$('.fs-preloader').removeClass('preloader-active')
			// }, 300)
			return
		}
		this.progress += 1
		const prcent = this.progress * (100 / (this.numberSlide.max + 1))
		$('.fs-preloader-amount').html(Math.ceil(prcent))
		// $('.js-progress-bar__line').css('transform', 'translateX('+prcent+'%)');
	}

	resizeCanvas() {
		const factorW = this.width / this.height
		const factorH = this.height / this.width
		const canvasWrapp = this.wrapper
		const canvas = $(`#js-s3d__${this.type}`)
		const width = canvasWrapp.width()
		const height = canvasWrapp.height()
		const diffW = this.width / width
		const diffH = this.height / height
		setTimeout(() => {
		}, 300)
		if (diffW < diffH) {
			canvas.width(width)
			canvas.height(width * factorH)
		} else {
			canvas.height(height)
			canvas.width(height * factorW)
		}
		this.centerSlider(this.wrapper[0])
	}

	// записывает позиции мышки
	rotateStart(e) {
		this.cancelAnimateSlide()
		this.x = e.pageX || e.targetTouches[0].pageX
		this.pret = e.pageX || e.targetTouches[0].pageX
		this.flagMouse = true
		// this.activeSvg = $(e.target).closest('svg')
		// $(this.activeSvg).css({ opacity: '0' })
	}

	// resize() {
	// 	this.height = this.wrapper.height()
	// 	this.width = this.wrapper.width()
	// 	this.ctx.canvas.width = this.width
	// 	this.ctx.canvas.height = this.height
	// 	this.ctx.drawImage(this.images[this.activeElem], 0, 0, this.width, this.height)
	// }

	// инициализация svg слайдера
	createSvg() {
		const svg = new Svg(this.svgConfig)
		svg.init(this.setActiveSvg.bind(this, this.ActiveHouse.get()))
		this.activeSvg = $('.s3d__svg__active').closest('svg')
	}

	createArrow() {
		const arrowLeft = createMarkup('button', this.wrapper, { class: 's3d__button s3d__button-left js-s3d__button-left unselectable s3d-unActive' })
		arrowLeft.dataset.type = 'prev'
		arrowLeft.disable = true
		$(arrowLeft).append('<svg width="7" height="9" viewBox="0 0 7 9" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 9L-1.96701e-07 4.5L7 0L7 3.82025L7 5.17975L7 9Z"/></svg>')
		$('.js-s3d__button-left').on('click', event => this.checkDirectionRotate(event.target))

		const arrowRight = createMarkup('button', this.wrapper, { class: 's3d__button s3d__button-right js-s3d__button-right unselectable s3d-unActive' })
		arrowRight.dataset.type = 'next'
		arrowRight.disable = true
		$(arrowRight).append(`<svg width="7" height="9" viewBox="0 0 7 9" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M1.18021e-06 -2.38419e-06L7 4.5L0 9L5.00966e-07 5.17974L6.79242e-07 3.82025L1.18021e-06 -2.38419e-06Z" />
</svg>`)
		$('.js-s3d__button-right').on('click', event => this.checkDirectionRotate(event.target))
	}

	// плашки с затемнением для выделения текста
	createBackground() {
		createMarkup('div', this.wrapper, { class: 's3d__slider__bg s3d__slider__bg-top' })
		createMarkup('div', this.wrapper, { class: 's3d__slider__bg s3d__slider__bg-bottom' })
	}

	// меняет активную svg в зависимости от кадра
	setActiveSvg(slide) {
		$('.js-s3d__container-active').removeClass('js-s3d__container-active')
		$(`.js-s3d__svg-container${slide}`).addClass('js-s3d__container-active')
	}

	updateSvgActive(wrap, current) {
		$(this.activeSvg).css({ opacity: '' })
		const clas = this.type === 'house' ? `.js-s3d__svg-container${this.ActiveHouse.get()} ` : '.js-s3d__svg-container__complex '
		$(`${clas}.s3d__svg__active`).removeClass('s3d__svg__active')
		$(`${clas}.${wrap}__${this[current]}`).addClass('s3d__svg__active')
		this.currentSlide = this[current]
	}

	// получить массив с номерами svg на которых есть polygon с data-id переданый аргументом
	getNumSvgWithFlat(id) {
		return $(`.js-s3d__svgWrap polygon[data-id=${id}]`).map((i, poly) => +poly.closest('.js-s3d__svgWrap').dataset.id).toArray()
	}

	// start info functions ---------------
	// создает блок с инфой
	createInfo() {
		this.infoBox = $('.js-s3d-infoBox')
	}

	// меняет состояние инфоблока на активный
	setStateInfoActive(elem) {
		// if ((e.target && e.target.dataset && typeof +e.target.dataset.id !== 'number') || typeof +e.id !== 'number') {
		// 	return
		// }
		this.addBlur('.js-s3d-infoBox', 500)
		if (!this.infoBox.hasClass('s3d-infoBox-active')) {
			this.infoBox.addClass('s3d-infoBox-active')
		}
		if (this.infoBox.hasClass('s3d-infoBox-hover')) {
			this.infoBox.removeClass('s3d-infoBox-hover')
		}
		setTimeout(() => {
			this.infoBox.find('.s3d-infoBox__link')[0].dataset.id = elem.id
			this.infoBox.find('.s3d-infoBox__add-favourites')[0].dataset.id = elem.id
			this.updateInfo(elem, true)
		}, 100)
	}

	// подставляет данные в инфобокс
	updateInfo(e, ignore) {
		// передвигаем блок за мышкой
	// const pos = $('.s3d__wrap').offset()
	// const Xinner = e.pageX - pos.left
	// const Yinner = e.pageY - pos.top
	// this.infoBox.css({ opacity: '1' })
	// this.infoBox.css({ top: Yinner - 40 })
	// this.infoBox.css({ left: Xinner })
		const { soldTitle } = this.infoBox.find('.js-s3d-infoBox__sold')[0].dataset
		if (this.infoBox.hasClass('s3d-infoBox-active') && !ignore) {
			return
		} else if (!this.infoBox.hasClass('s3d-infoBox-hover')) {
			this.infoBox.addClass('s3d-infoBox-hover')
		}
		// if (this.openHouses.includes(+e.build)) {
		this.infoBox.find('.js-s3d-infoBox__table-number')[0].innerHTML = `${e.number || ''}`
		this.infoBox.find('.js-s3d-infoBox__table-floor')[0].innerHTML = `${e.floor || ''}`
		this.infoBox.find('.js-s3d-infoBox__table-room')[0].innerHTML = `${e.rooms || ''}`
		this.infoBox.find('.js-s3d-infoBox__type')[0].innerHTML = `${e.type || ''}`
		this.infoBox.find('.js-s3d-infoBox__sold')[0].innerHTML = e.sale === '1' ? '' : soldTitle
		this.infoBox.find('.js-s3d-infoBox__sold')[0].style.left = `${getComputedStyle(this.infoBox.find('.js-s3d-infoBox__type')[0]).width}`
		this.infoBox.find('.js-s3d-infoBox__table-area')[0].innerHTML = `${e['all_room'] || ''}`
		this.infoBox.find('.js-s3d-infoBox__image')[0].src = `${e['img_small'] || ''}`
		this.infoBox.find('.js-s3d-infoBox__hover__text')[0].innerHTML = `${e.number || ''}`
		this.infoBox.find('.js-s3d-add__favourites input').prop('checked', e.favourite || false)
		// this.infoBox.find('.js-s3d-infoBox__floor')[0].style.display = ''
		// } else {
		// 	this.infoBox.find('.js-s3d-infoBox__house')[0].innerHTML = 'Будинок не у продажу'
		// 	this.infoBox.find('.js-s3d-infoBox__floor')[0].style.display = 'none'
		// }
	}

	updateInfoFloorList(e) {
		const data = (e.target || e).dataset
		const list = $(`.js-s3d__svgWrap .floor-svg-polygon[data-build=${data.build}][ data-floor=${data.floor}]`)

		list.each((i, el) => {
			this.updateInfoFloor(el, data)
		})

		// if (this.openHouses.includes(+data.build)) {
		$(`[data-build=${data.build}] .floor-text`).html(data.floor)
		// } else {
		// 	$(`[data-build=${data.build}] .floor-text`).html('будинок не у продажу')
		// }
	}

	// updateInfoFlatList(e) {
	// 	const data = (e.target || e).dataset
	// 	const list = $(`.js-s3d__svgWrap polygon[data-id=${data.floor}]`)
	//
	// 	list.each((i, el) => {
	// 		this.updateInfoFlat(el, data)
	// 	})
	//
	// 	if (this.openHouses.includes(+data.build)) {
	// 		$(`[data-build=${data.build}] .floor-text`).html(data.floor)
	// 	} else {
	// 		$(`[data-build=${data.build}] .floor-text`).html('будинок не у продажу')
	// 	}
	// }

	updateInfoFloor(e, data) {
		// положение курсора внутри элемента
		const parent = $(e).closest('svg')
		const widthSvgPhoto = parent.attr('viewBox').split(' ')[2]
		const bbox = e.getBBox()
		const height = (widthSvgPhoto / 13) * 0.2
		const y = (bbox.y + (bbox.height / 2))
		$(parent).find(`.floor-info-svg[data-build=${data.build}]`).addClass('active-floor-info').attr('y', y - (height / 2))

		// if(this.openHouses.includes(+data.build)){
		//     $('[data-build='+ data.build +'] .floor-text').html(data.floor);
		// } else {
		//     $('[data-build='+ data.build +'] .floor-text').html('будинок не у продажу');
		// }
	}

	// updateInfoFlat(e, data) {
	// 	// положение курсора внутри элемента
	// 	const parent = $(e).closest('svg')
	// 	const widthSvgPhoto = parent.attr('viewBox').split(' ')[2]
	// 	const bbox = e.getBBox()
	// 	const height = (widthSvgPhoto / 13) * 0.2
	// 	const y = (bbox.y + (bbox.height / 2))
	// 	$(parent).find(`.flat-info-svg[data-build=${data.build}]`).addClass('active-flat-info').attr('y', y - (height / 2))
	//
	// 	// if(this.openHouses.includes(+data.build)){
	// 	//     $('[data-build='+ data.build +'] .floor-text').html(data.floor);
	// 	// } else {
	// 	//     $('[data-build='+ data.build +'] .floor-text').html('будинок не у продажу');
	// 	// }
	// }

	updateActiveFloor(floor) {
		this.activeFloor = floor
		const nextFloorSvg = $(`.s3d__svg__active [data-build=${this.ActiveHouse.get()}][data-floor=${this.activeFloor}]`)[0]
		this.updateInfoFloorList(nextFloorSvg)
		$('.js-s3d__svgWrap .active-floor').removeClass('active-floor')
		$(`.js-s3d__svgWrap [data-build=${this.ActiveHouse.get()}][data-floor=${this.activeFloor}]`).addClass('active-floor')
	}

	updateActiveFlat(flat) {
		this.activeFlat.value = flat
		// const nextFlatSvg = $(`.s3d__svg__active [data-id=${this.activeFlat.value}]`)[0]
		// this.updateInfoFlatList(nextFlatSvg)
		$('.js-s3d__svgWrap .active-flat').removeClass('active-flat')
		$('.js-s3d-filter__table .active-flat').removeClass('active-flat')
		$(`.js-s3d__svgWrap [data-id=${this.activeFlat.value}]`).addClass('active-flat')
		$(`.js-s3d-filter__table [data-id=${this.activeFlat.value}]`).addClass('active-flat')
	}

	// мигание квартир на генплане
	flatBlink() {
		for (let i = 1; i <= 4; i++) {
			setTimeout(() => {
				$('.s3d__svg__active polygon').css('opacity', (i % 2) ? 0.5 : '')
			}, (i * 200))
		}
	}

	// спрятать инфоблок
	hiddenInfo() {
		this.infoBoxActive = false
		this.infoBox.removeClass('s3d-infoBox-active')
		this.infoBox.removeClass('s3d-infoBox-hover')
		// this.infoBox.css({ opacity: '0' })
		// this.infoBox.css({ top: '-10000px' })
		// this.infoBox.css({ left: '-10000px' })
	}

	hiddenInfoFloor() {
		// $('.active-floor-info').removeClass("active-floor-info");
	}

	showInfoFloor() {
		// $('.active-floor-info').addClass("active-floor-info");
		// this.infoBoxFloor.css({'opacity' : '1', 'z-index': ''});
	}
	// end info functions ---------------

	// start block  change slide functions
	// находит ближайший слайд у которого есть polygon(data-id) при необходимости вращает модуль к нему
	toSlideNum(id) {
		const controlPoint = this.getNumSvgWithFlat(id)
		const needChangeSlide = this.rewindToPoint(controlPoint)

		if (needChangeSlide) {
			this.checkDirectionRotate() // test
			// this.checkResult()
		}
		// this.hoverFlatId = +id
		// this.infoBox.addClass('active')
		this.infoBoxActive = true
		this.updateActiveFlat(id)
		this.updateInfo(this.getFlatObj(+id))
		this.setStateInfoActive(this.getFlatObj(+id))
	}

	// запускает callback (прокрутку слайда) пока активный слайд не совпадёт со следующим (выявленным заранее)
	repeatChangeSlide(fn) {
		this.rotate = false
		$('.s3d__svg-container').css({ opacity: 0 })
		return setInterval(() => {
			fn()
			if (this.activeElem === this.nextSlide) {
				this.cancelAnimateSlide()
				this.updateSvgActive(this.type, 'nextSlide')
				this.activeSvg.css({ opacity: '' })
				$('.s3d__svg-container').css({ opacity: 1 })
				this.rotate = true
			}
		}, 22)
	}

	checkDirectionRotate(data) {
		if (!this.rotate) return
		// this.rotate = false
		let direction = 'prev'
		if ((data && data.dataset && data.dataset.type === 'next')) {
			direction = 'next'
		} else if (!data && ((this.result.max - this.result.min) / 2) + this.result.min <= this.activeElem) {
			direction = 'next'
		}
		this.checkResult(direction)
	}

	checkResult(type) {
		this.rewindToPoint(this.controlPoint)
		if (type === 'next' || (type === undefined && ((this.result.max - this.result.min) / 2) + this.result.min <= this.activeElem)) {
			this.nextSlide = this.controlPoint[0]
			if (this.result.max <= this.numberSlide.max) {
				this.nextSlide = this.result.max
			}
			this.repeat = this.repeatChangeSlide(this.changeNext.bind(this))
		} else {
			this.nextSlide = this.controlPoint[this.controlPoint.length - 1]
			if (this.result.min > this.numberSlide.min) {
				this.nextSlide = this.result.min
			}
			this.repeat = this.repeatChangeSlide(this.changePrev.bind(this))
		}
	}
	// вычисляет ближайшую точку остановки и запускает прокрутку в нужную сторону
	// checkResult() {
	// 	if (((this.result.max - this.result.min) / 2) + this.result.min <= this.activeElem) {
	// 		this.nextSlide = this.controlPoint[0]
	// 		if (this.result.max <= this.numberSlide.max) {
	// 			this.nextSlide = this.result.max
	// 		}
	// 		this.repeat = this.repeatChangeSlide(this.changeNext.bind(this))
	// 	} else {
	// 		if (this.result.min > this.numberSlide.min) {
	// 			this.nextSlide = this.result.min
	// 		} else {
	// 			this.nextSlide = this.controlPoint[this.controlPoint.length - 1]
	// 		}
	// 		this.repeat = this.repeatChangeSlide(this.changePrev.bind(this))
	// 	}
	// }

	// остановка анимации и сброс данных прокрутки
	cancelAnimateSlide() {
		clearInterval(this.repeat)
		this.repeat = undefined
		this.result.min = this.numberSlide.min
		this.result.max = this.numberSlide.max
	}

	// меняет слайд на следующий
	changeNext() {
		if (this.activeElem === this.numberSlide.max) {
			this.result.max = this.controlPoint[0]
			this.result.min = -1
			this.activeElem = this.numberSlide.min
		} else {
			this.activeElem++
		}
		this.compass.set(this.activeElem)
		this.ctx.drawImage(this.images[this.activeElem], 0, 0, this.width, this.height)
	}

	// меняет слайд на предыдщий
	changePrev() {
		if (this.activeElem === this.numberSlide.min) {
			this.result.max = this.numberSlide.max + 1
			this.result.min = this.controlPoint[this.controlPoint.length - 1]
			this.activeElem = this.numberSlide.max
		} else {
			this.activeElem--
		}

		this.compass.set(this.activeElem)
		this.ctx.drawImage(this.images[this.activeElem], 0, 0, this.width, this.height)
	}

	checkMouseMovement(e) {
		// get amount slide from a touch event
		this.x = e.pageX || e.targetTouches[0].pageX
		this.amount += +((this.x - this.pret) / (window.innerWidth / this.numberSlide.max / this.mouseSpeed)).toFixed(0)
	}

	rewindToPoint(controlPoint) {
		this.cancelAnimateSlide()
		controlPoint.forEach(el => {
			if (el < this.activeElem && el > this.result.min) {
				this.result.min = el
			} else if (el > this.activeElem && el < this.result.max) {
				this.result.max = el
			}
		})

		if (this.result.min === 0) {
			this.result.min = controlPoint[controlPoint.length - 1] - this.numberSlide.max
		}

		if (this.result.max === this.numberSlide.max) {
			this.result.max = controlPoint[0] + this.numberSlide.max
		}
		if (!controlPoint.includes(this.activeElem)) {
			return true
		}
		return false
	}

	activeAnimate(flag) {
		if (flag) {
			this.animates = this.animate()
		} else {
			window.cancelAnimationFrame(this.animates)
		}
	}

	animate() {
		if (this.amount >= 1) {
			this.changeNext()
			this.amount -= 1
			// this.changeSlide(this.amount,this.changePrev);
			this.pret = this.x
			// this.amount = 0;
		} else if (this.amount <= -1) {
			this.changePrev()
			this.amount += 1
			// this.changeSlide(this.amount*-1,this.changeNext);
			this.pret = this.x
			// this.amount = 0;
		}
		this.animates = requestAnimationFrame(this.animate.bind(this))
	}

	debounce(f, t) {
		return function (args) {
			const previousCall = this.lastCall
			this.lastCall = Date.now()
			if (previousCall && ((this.lastCall - previousCall) <= t)) {
				clearTimeout(this.lastCallTimer)
			}
			this.lastCallTimer = setTimeout(() => f(args), t)
		}
	}
	// end block  change slide functions
}
