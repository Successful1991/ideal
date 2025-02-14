class Apartments {
	constructor(data) {
		this.idCopmlex = data.idCopmlex
		this.type = data.type
		this.loader = data.loader
		this.wrapperId = data.idCopmlex
		this.wrapper = $(`.js-s3d__wrapper__ ${this.wrapperId}`)
		this.click = data.click
		this.scrollBlock = data.scrollBlock
		this.activeFlat = data.activeFlat
		this.getFavourites = data.getFavourites
		this.addBlur = data.addBlur
	}

	init(config) {
		// переключатель планировки обычная/3д
		// $('.s3d-filter__plan').removeClass('s3d-filter__plan-active')
		// получаем разметку квартиры с планом этажа
		this.getPlane(config)
		const self = this
		$('.js-switch-btn').on('change', function () {
			const has = $(this).is(':checked')
			if (has && self.conf.plan3d) {
				self.conf.$img.src = self.conf.plan3dSrc
				self.conf.$mfpLink.href = self.conf.plan3dSrc
			} else {
				self.conf.$img.src = self.conf.planStandartSrc
				self.conf.$mfpLink.href = self.conf.planStandartSrc
			}
		})

		$('#js-s3d__apart').on('click', '.js-s3d-flat__back', e => {
			// this.loader.show()
			this.click(+e.currentTarget.dataset.id, 'complex', this.activeFlat.value)
			// this.scrollBlock(e, 'complex', this.activeFlat.value)
		})
	}

	update(config) {
		// переключатель планировки обычная/3д
		// $('.s3d-filter__plan').removeClass('s3d-filter__plan-active')
		// this.updateFlat(flat)
		this.getPlane(config)
	}

	updateImage() {
		const type = $('.js-flat-plan-mfp').data('type')
		return {
			$img: document.querySelector('.flat-plan'),
			$mfpLink: document.querySelector('.js-flat-plan-mfp'),
			planStandartSrc: $('.js-flat-plan-mfp').attr('href'),
			planStandartName: type,
			plan3dSrc: `${window.location.origin}/wp-content/themes/boston/assets/img/projects/1/3d/ ${type.split('_')[0]}.jpg`,
			plan3d: false,
		}
	}

	checkImage() {
		const { conf } = this
		fetch(conf.plan3dSrc)
			.then(res => (res.ok ? res : Promise.reject(res)))
			.then(res => {
				$('.s3d-filter__plan').addClass('s3d-filter__plan-active')
				conf.plan3d = true
			}).catch(() => {
				$('.s3d-filter__plan').removeClass('s3d-filter__plan-active')
			})
	}

	/* Буква "Є" не воспринимается в адресной строке */
	changeYe() {
		$('.s3d-floor__helper-img img').src = $('.s3d-floor__helper-img img').src.replace(/%D0%84/, 'Ye')
		$('.s3d-floor__helper-img img').src = $('.s3d-floor__helper-img img').src.replace(/Є/, 'Ye')
		$('.flat-plan').src = $('.flat-plan').src.replace(/%D0%84/, 'Ye')
		$('.js-flat-plan-mfp').href = $('.js-flat-plan-mfp').href.replace(/Є/, 'Ye')
		$('.js-flat-plan-mfp').href = $('.js-flat-plan-mfp').href.replace(/%D0%84/, 'Ye')
	}

	// получаем разметку квартиры с планом этажа
	getPlane(config) {
		// this.setPlaneInPage(this.addHtmlAll(config))
		$.ajax({
			type: 'POST',
			// url: '/inc/functions.php',
			// url: './static/apPars.php',
			url: '/wp-admin/admin-ajax.php',
			data: `action=createFlat&id=${config.activeFlat.value}`,
			success: response => (this.setPlaneInPage(response)),
		})
	}

	// вставляем разметку в DOM вешаем эвенты
	setPlaneInPage(response) {
		$(`#js-s3d__${this.idCopmlex}`).html(JSON.parse(response))
		this.loader.hide(this.type)
		// $('.flat-group2 ').on('click', 'polygon', this.openPopup)
		// $('.js-s3d__wrapper__apart .form-js').on('click', () => $('.common-form-popup-js').addClass('active'))
		$('.js-flat-button-return').on('click', e => {
			e.preventDefault()
			this.click(e.currentTarget.dataset.id, 'complex', this.activeFlat.value)
			// $('.js-s3d-select__floor').click()
		})

		$('.s3d-flat__floor').on('click', 'a', event => {
			event.preventDefault()
			this.addBlur('.s3d-flat__floor')
			this.getNewFlat(event.currentTarget.dataset.id)
		})
		this.checkFavouriteApart()
		// $('.js-s3d-popup__mini-plan svg').on('click', 'polygon', e => {
		// 	this.activeSvg = $(e.target).closest('svg')
		// 	$(this.activeSvg).css({ fill: '' })
		// 	$('.s3d-floor__helper').css({ opacity: 0, top: '-10000px' })
		// 	this.click(e, 'floor')
		// 	// $('.js-s3d-popup__mini-plan').removeClass('active')
		// })

		$('.js-s3d__show-3d').on('click', event => {
			this.click(event.currentTarget.dataset.id, 'complex', this.activeFlat.value)
		})

		$('.js-s3d-flat__image').magnificPopup({
			type: 'image',
			showCloseBtn: true,
		})
		// меняет непонятные символы в ссылке
		// this.conf = this.updateImage()
		// проверяет есть ли эта планировка в 3d формате
		// this.checkImage()
	}

	openPopup() {
		$('.js-s3d-popup__mini-plan').addClass('active')
		$('.js-s3d-popup__mini-plan__close').on('click', () => $('.js-s3d-popup__mini-plan').removeClass('active'))
	}

	getNewFlat(id) {
		$.ajax({
			type: 'POST',
			// url: '/inc/functions.php',
			// url: './static/apPars.php',
			url: '/wp-admin/admin-ajax.php',
			data: `action=halfOfFlat&id=${id}`,
		}).then(response => {
			this.activeFlat.value = id
			this.updateFlat(JSON.parse(response), id)
		})
	}

	updateFlat(flat, id) {
		const wrap = $('.js-s3d__wrapper__apart')
		wrap.find('.js-s3d-flat__image').attr('src', flat.img)
		wrap.find('.js-s3d-flat__image')[0].dataset.mfpSrc = flat.img
		wrap.find('.js-s3d-flat__mini-info').html(flat['miniInfoBlock'])
		wrap.find('.js-s3d-flat__table').html(flat['tableBlock'])
		wrap.find('.js-s3d__create-pdf').attr('href', flat.pdf)
		wrap.find('.js-s3d-add__favourites')[0].dataset.id = id
		$('.u-svg-plan--active').removeClass('u-svg-plan--active')
		wrap.find(`.s3d-flat__floor [data-id=${id}]`).addClass('u-svg-plan--active')

		this.checkFavouriteApart()
	}

	checkFavouriteApart() {
		const favourite = this.getFavourites()
		if (favourite.length > 0) {
			$('.s3d-flat__favourites').removeClass('s3d-hidden')
			$('.js-s3d-favourites-amount').html(favourite.length)
		}
		$('.s3d-flat__like input').prop('checked', favourite.includes(+this.activeFlat.value))
	}

	addHtmlAll(elem) {
		return JSON.stringify(`
			<div class="s3d-flat js-s3d-flat">
			 <button class="s3d-flat__back js-s3d-flat__back" type="button">
                    <svg viewBox="0 0 9 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M9 12L-1.21594e-06 6L9 0L9 5.09367L9 6.90633L9 12Z" fill="white"></path>
                    </svg>
                  </button>
                <div class="s3d-flat__mini-info">
                 
                  <div class="s3d-mini-info">
                    <div class="s3d-mini-info__title">номер</div>
                    <div class="s3d-mini-info__amount">54</div>
                  </div>
                  <div class="s3d-mini-info">
                    <div class="s3d-mini-info__title">Этаж</div>
                    <div class="s3d-mini-info__amount">6</div>
                  </div>
                  <div class="s3d-mini-info">
                    <div class="s3d-mini-info__title">комнат</div>
                    <div class="s3d-mini-info__amount">1</div>
                  </div>
                </div>
                <div class="s3d-flat__table">
                  <div class="s3d-flat__table__subtitle">Площадь 56 м2</div>
                  <div class="s3d-flat__table__title">Квартира 2А</div>
                  <ul class="s3d-flat__list">
                    <li class="s3d-flat__el">
                      <div class="s3d-flat__el__name">Спальня:</div>
                      <div class="s3d-flat__el__value">12 м<sub>2</sub></div>
                    </li>
                    <li class="s3d-flat__el">
                      <div class="s3d-flat__el__name">Спальня:</div>
                      <div class="s3d-flat__el__value">12 м<sub>2</sub></div>
                    </li>
                    <li class="s3d-flat__el">
                      <div class="s3d-flat__el__name">Спальня:</div>
                      <div class="s3d-flat__el__value">12 м<sub>2</sub></div>
                    </li>
                    <li class="s3d-flat__el">
                      <div class="s3d-flat__el__name">Спальня:</div>
                      <div class="s3d-flat__el__value">12 м<sub>2</sub></div>
                    </li>
                    <li class="s3d-flat__el">
                      <div class="s3d-flat__el__name">Спальня:</div>
                      <div class="s3d-flat__el__value">12 м<sub>2</sub></div>
                    </li>
                    <li class="s3d-flat__el">
                      <div class="s3d-flat__el__name">Спальня:</div>
                      <div class="s3d-flat__el__value">12 м<sub>2</sub></div>
                    </li>
                    <div class="s3d-flat__el">
                      <div class="s3d-flat__el__name">Спальня:</div>
                      <div class="s3d-flat__el__value">12 м<sub>2</sub></div>
                    </div>
                    <div class="s3d-flat__el">
                      <div class="s3d-flat__el__name">Спальня:</div>
                      <div class="s3d-flat__el__value">12 м<sub>2</sub></div>
                    </div>
                    <div class="s3d-flat__el">
                      <div class="s3d-flat__el__name">Спальня:</div>
                      <div class="s3d-flat__el__value">12 м<sub>2</sub></div>
                    </div>
                    <div class="s3d-flat__el">
                      <div class="s3d-flat__el__name">Спальня:</div>
                      <div class="s3d-flat__el__value">12 м<sub>2</sub></div>
                    </div>
                    <div class="s3d-flat__el">
                      <div class="s3d-flat__el__name">Спальня:</div>
                      <div class="s3d-flat__el__value">12 м<sub>2</sub></div>
                    </div>
                    <div class="s3d-flat__el">
                      <div class="s3d-flat__el__name">Спальня:</div>
                      <div class="s3d-flat__el__value">12 м<sub>2</sub></div>
                    </div>
                  </ul>
                </div>
                <a class="s3d-flat__tell s3d-tell s3d-genplan" type="tel">
                  <div class="s3d-tell__icon-wrap">
                    <div class="s3d-tell__icon">
                      <svg role="presentation">
                        <use xlink:href="#icon-tell"></use>
                      </svg>
                    </div>
                  </div>
                  <div class="s3d-tell__text">(067) 747-0151</div></a>
              <img class="s3d-flat__image js-s3d-flat__image" src="assets/s3d/images/KV.png" data-mfp-src="assets/s3d/images/KV.png">
              
                <div class="s3d-flat__favourites js-s3d-favorite__wrap s3d-hidden">Избранное
                  <div class="s3d-flat__favourites-icon js-s3d__favourites">
                    <svg>
                      <use xlink:href="#icon-favourites"></use>
                    </svg><span class="s3d-flat__favourites-amount js-s3d-favourites-amount">0</span>
                  </div>
                </div>
                <div class="s3d-flat__floor">
                <svg viewBox="0 0 2767 2378" width="165mm" height="155mm">
                <image xlink:href="https://comfortlife.devbase.pro/img/projects/8/1/Іdealіst-P6-1604317030-6000x85-.jpg" x="0" y="0" height="100%" width="100%"></image>
                  <a xlink:href="/flat/?flat=34" class="appart__hover" data-section="1" data-tot_square="69.76" data-liv_square="0" data-rooms="2" data-number="2А" data-id="34">
                                     <polygon class=" u-svg-plan--active" points="998,1062,1002,2160,242,2054,132,1998,82,1902,78,654,82,546,128,460,216,430,528,386,538,1096,534,1072" data-id="34" data-section="1" data-tot_square="69.76" data-liv_square="0" data-rooms="2" data-number="2А">
                                     </polygon> 
                                </a>
                                  <a xlink:href="/flat/?flat=35" class="appart__hover" data-section="1" data-tot_square="38.18" data-liv_square="0" data-rooms="1" data-number="1А" data-id="35">
                                     <polygon class="" points="530,386,1388,238,1384,1100,534,1100" data-id="35" data-section="1" data-tot_square="38.18" data-liv_square="0" data-rooms="1" data-number="1А">
                                     </polygon> 
                                </a>
                                  <a xlink:href="/flat/?flat=36" class="appart__hover" data-section="1" data-tot_square="46.01" data-liv_square="0" data-rooms="1" data-number="1Б" data-id="36">
                                     <polygon class="" points="1386,236,2242,92,2230,1096,1388,1100" data-id="36" data-section="1" data-tot_square="46.01" data-liv_square="0" data-rooms="1" data-number="1Б">
                                     </polygon> 
                                </a>
                                  <a xlink:href="/flat/?flat=37" class="appart__hover" data-section="1" data-tot_square="88.06" data-liv_square="0" data-rooms="2" data-number="2Б" data-id="37">
                                     <polygon class="" points="2246,90,2526,48,2632,82,2692,168,2686,2158,2640,2274,2518,2320,2252,2288,1794,2230,1800,1100,2228,1100" data-id="37" data-section="1" data-tot_square="88.06" data-liv_square="0" data-rooms="2" data-number="2Б">
                                     </polygon> 
                                </a>
                                
               
            </svg>
                </div>
                <div class="s3d-flat__links">
					<span class="sold-detailed-flat js-sold-detailed-flat"></span>
					<a href="#" class="js-s3d__create-pdf"><img src="assets/s3d/images/icon/pdf.svg">
						<span>скачать буклет</span></a>
					<button type="button" class="js-s3d__show-3d"><img src="assets/s3d/images/icon/house.svg">
						<span>посмотреть в 3D</span></button>
                	<button type="button" class="js-s3d-form--reservation__open"><img src="assets/s3d/images/icon/lock.svg"><span>заявка на бронь</span></button>
<!--                	<button type="button" class="js-s3d-add__favourites" data-id="${elem.id}"><img src="assets/s3d/images/icon/heart.svg"><span>в избранное</span></button>-->
                	<label data-id=${elem.activeFlat.value} class="s3d-flat__like js-s3d-add__favourites">
										<input type="checkbox">
										<svg role="presentation"><use xlink:href="#icon-favourites"></use></svg><span>в избранное</span></label>
                </div>
            </div>
		`)
	}
}
