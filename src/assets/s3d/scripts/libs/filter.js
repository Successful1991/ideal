class Filter {
	constructor(config, data) {
		this.wrapper = config.wrap || ''
		this.filterName = { range: ['area', 'floor'], checkbox: ['rooms'] }
		this.filter = {}
		this.nameFilterFlat = {
			area: 'all_room',
			living: 'life_room',
			house: 'build_name',
			floor: 'floor',
			rooms: 'rooms',
			price: 'price',
			priceM2: 'price_m2',
		}
		// name key js and name key in flat
		// this.filterSelect = {}
		this.flatList = data
		this.currentAmountFlat = data.length
	}

	init(config) {
		this.filterHtml = createFilter('.js-s3d__slideModule')

		$(this.filterHtml.reset).on('click', () => this.resetFilter())
		$(this.filterHtml.house).on('click', 'input', () => this.showSvgSelect())
		$(this.filterHtml.room).on('click', 'input', () => this.showSvgSelect())
		$(this.filterHtml.close).on('click', () => this.hidden())

		// $('.js-s3d-filter__button--reset').on('click', () => this.resetFilter())
		// $('.js-s3d-filter__button--apply').on('click', () => this.showSvgSelect());
		// $('.js-s3d-filter__select').on('click', 'input', () => this.showSvgSelect())
		// $('.js-s3d-filter__button--apply').on('click', () => $('.js-s3d-filter').removeClass('active'))
		// $('.js-s3d-filter__close').on('click', () => {
		// 	$('.js-s3d-filter').removeClass('active')
		// })

		$('.js-s3d-controller__showFilter').on('click', () => this.showAvailableFlat())

		$('.js-s3d-controller__openFilter').on('click', () => {
			$('.js-s3d-filter').addClass('active')
			if (!$('.js-s3d-controller__showFilter--input').prop('checked')) {
				$('.js-s3d-controller__showFilter--input').click()
			}
		})

		this.filterName.checkbox.forEach(name => {
			$('.js-s3d-filter [data-type=name]').each((i, el) => el.data(name, i + 1))
		})

		this.filterName.range.forEach(name => {
			const classes = this.getAttrInput(name)
			if (classes) {
				for (const key in config[this.nameFilterFlat[name]]) {
					classes[key] = (key === 'min') ? Math.floor(+config[this.nameFilterFlat[name]][key]) : Math.ceil(+config[this.nameFilterFlat[name]][key])
				}
				this.createRange(classes)
			}
		})

		this.setAmountSelectFlat(this.flatList.length)
	}

	getNameFilterFlat() { return this.nameFilterFlat }

	showSvgSelect() {
		// фильтр svg , ищет по дата атрибуту, нужно подстраивать атрибут и класс обертки
		const data = this.applyFilter(this.flatList)
		this.setAmountSelectFlat(this.currentAmountFlat)
		for (const key in data) {
			if (+data[key].length > 0) {
				// $('#js-s3d__wrapper__complex polygon[data-build="'+key+'"]').css({'opacity':0.5});
				data[key].forEach(
					floor => {
						if ($('.js-s3d__svg-container__complex').length > 0) { $(`.js-s3d__wrapper__complex polygon[data-build="${key}"][ data-floor="${floor}"]`).css({ opacity: 0.5 }) }
					},
				)
			}
		}
	}

	showAvailableFlat() {
		$('.js-s3d-controller__showFilter--input').click()
		if ($('.js-s3d-controller__showFilter--input').prop('checked')) {
			this.showSvgSelect(this.flatList)
			$('.floor-info-helper').css('opacity', '1')
		} else {
			$('.s3d__svg-container polygon').css({ opacity: '' })
			$('.floor-info-helper').css('opacity', '0')
		}
	}

	getAttrInput(name) {
		return $(`.js-s3d-filter__${name}--input`).length > 0 ? $(`.js-s3d-filter__${name}--input`).data() : false
	}

	getAttrSelect(name) {
		const input = $(`.js-s3d-filter__${name}--input:checked`).length ? $(`.js-s3d-filter__${name}--input:checked`) : $(`.js-s3d-filter__${name}--input`)

		const arr = { type: input.data('type'), value: [] }
		input.each((i, el) => arr.value.push($(el).data(name)))
		return arr
	}

	createRange(config) {
		if (config.type !== undefined) {
			const self = this
			const { min } = config
			const { max } = config
			const $min = $(`.js-s3d-filter__${config.type}__min--input`)
			const $max = $(`.js-s3d-filter__${config.type}__max--input`)

			$(`.js-s3d-filter__${config.type}--input`).ionRangeSlider({
				type: 'double',
				grid: false,
				min: config.min || 0,
				max: config.max || 0,
				from: config.min || 0,
				to: config.max || 0,
				step: config.step || 1,
				onStart: updateInputs,
				onChange: updateInputs,
				onFinish(e) {
					updateInputs(e)
					self.showSvgSelect()
				},
				onUpdate: updateInputs,
			})

			const instance = $(`.js-s3d-filter__${config.type}--input`).data('ionRangeSlider')
			function updateInputs(data) {
				$min.prop('value', data.from)
				$max.prop('value', data.to)
			}

			$min.on('change', function () { changeInput.call(this, 'from') })
			$max.on('change', function () { changeInput.call(this, 'to') })

			function changeInput(key) {
				let val = $(this).prop('value')
				if (key === 'from') {
					if (val < min) val = min
					else if (val > instance.result.to) val = instance.result.to
				} else if (key === 'to') {
					if (val < instance.result.from) val = instance.result.from
					else if (val > max) val = max
				}

				instance.update(key === 'from' ? { from: val } : { to: val })
				$(this).prop('value', val)
				self.showSvgSelect()
			}
		}
	}

	show() {
		$('.js-s3d-filter').addClass('active')
	}

	hidden() {
		$('.js-s3d-filter').removeClass('active')
	}

	setRange(config) {
		if (config.type !== undefined) {
			this.filter[config.type] = {}
			this.filter[config.type].type = 'range'
			this.filter[config.type].elem = $(`.js-s3d-filter__${config.type}--input`).data('ionRangeSlider')
		}
	}

	setCheckbox(config) {
		if (config.type !== undefined) {
			if (!this.filter[config.type] || !this.filter[config.type].elem) {
				this.filter[config.type] = {}
				this.filter[config.type].elem = []
				this.filter[config.type].value = []
				this.filter[config.type].type = 'select'
			}
			this.filter[config.type].elem = $(`.js-s3d-filter__${config.type} [data-type = ${config.type}]`)
		}
	}

	resetFilter() {
		$('#js-s3d__wrapper polygon').css({ opacity: '' })

		for (const key in this.filter) {
			if (this.filter[key].type === 'range') {
				// this.filter[key].elem.reset();
				this.filter[key].elem.update({ from: this.filter[key].elem.result.min, to: this.filter[key].elem.result.max })
			} else {
				// this.filter[key].elem.each((i, el) => { el.checked ? el.checked = false : '' })
			}
		}
		this.showSvgSelect()
	}

	applyFilter(data) {
		this.clearFilterParam()
		this.checkFilter()
		this.getFilterParam()
		return this.filterFlat(data, this.filter, this.filterName, this.nameFilterFlat)
	}

	checkFilter() {
		this.filterName.range.forEach(name => {
			const classes = this.getAttrInput(name)
			if (classes) this.setRange(classes)
		})
		this.filterName.checkbox.forEach(name => this.setCheckbox(this.getAttrSelect(name)))
	}

	setAmountSelectFlat(amount) {
		$('.js-s3d-controller__openFilter-num').html(amount)
		$('.js-s3d-filter__amount-flat__num').html(amount)
	}

	filterFlat(data, filter, filterName, nameFilterFlat) {
		this.currentAmountFlat = 0
		const select = {}
		data.filter(flat => {
			for (const param in filter) {
				if (+flat.sale !== 1) return true
				if (
					filterName.checkbox.includes(param)
					&& filter[param].value.length > 0
					&& !filter[param].value.some(key => +flat[nameFilterFlat[param]] === +key)
				) {
					return false
				} if (filterName.range.includes(param)) {
					if (+flat[nameFilterFlat[param]] < +filter[param].min
						|| +flat[nameFilterFlat[param]] > +filter[param].max) {
						return false
					}
				}
			}

			if (filter.house.value.length === 0 || filter.rooms.value.length === 0) {
				return {}
			}

			if (flat[nameFilterFlat.house] !== undefined
				&& !select[flat[nameFilterFlat.house]]
			) {
				select[flat[nameFilterFlat.house].match(/^(\d+)/)[1]] = []
			}

			if (flat[nameFilterFlat.floor] !== undefined
				&& select[flat[nameFilterFlat.house]]
				&& !select[flat[nameFilterFlat.house]].includes(flat[nameFilterFlat.floor])
				&& flat[nameFilterFlat.floor] > 0
			) {
				select[flat[nameFilterFlat.house]].push(flat[nameFilterFlat.floor])
			}
			this.currentAmountFlat += 1
			return flat
		})
		return select
	}

	/*
	filterFlat(data) {
		this.currentAmountFlat = 0
		data.filter(flat => {
			for (const param in this.filter) {
				if (+flat.sale !== 1) return true
				if (
					this.filterName.checkbox.includes(param)
                    && this.filter[param].value.length > 0
                    && !this.filter[param].value.some(key => +flat[this.nameFilterFlat[param]] === +key)
				) {
					return false
				} if (this.filterName.range.includes(param)) {
					if (+flat[this.nameFilterFlat[param]] < +this.filter[param].min
                        || +flat[this.nameFilterFlat[param]] > +this.filter[param].max) {
						return false
					}
				}
			}

			if (this.filter.house.value.length === 0 || this.filter.rooms.value.length === 0) {
				return {}
			}

			if (flat[this.nameFilterFlat.house] !== undefined
                && !this.filterSelect[flat[this.nameFilterFlat.house]]
			) {
				this.filterSelect[flat[this.nameFilterFlat.house].match(/^(\d+)/)[1]] = []
			}

			if (flat[this.nameFilterFlat.floor] !== undefined
                && this.filterSelect[flat[this.nameFilterFlat.house]]
                && !this.filterSelect[flat[this.nameFilterFlat.house]].includes(flat[this.nameFilterFlat.floor])
                && flat[this.nameFilterFlat.floor] > 0
			) {
				this.filterSelect[flat[this.nameFilterFlat.house]].push(flat[this.nameFilterFlat.floor])
			}
			this.currentAmountFlat += 1
			return flat
		})
		return this.filterSelect
	}
	 */

	getFilterParam() {
		for (const key in this.filter) {
			switch (this.filter[key].type) {
			case 'select':
				$(`.js-s3d-filter__${key}--input:checked`).each((i, el) => this.filter[key].value.push($(el).data(key)))
				break
			case 'range':
				this.filter[key].min = this.filter[key].elem.result.from
				this.filter[key].max = this.filter[key].elem.result.to
				break
			default:
				break
			}
		}
	}

	clearFilterParam() {
		// this.filterSelect = {}
		this.filter = {}
		$('#js-s3d__wrapper polygon').css({ opacity: '' })
		this.setAmountSelectFlat(this.flatList.length)
	}

	createMarkup() {
	// return ` <div class="s3d-filter js-s3d-filter">
	//         <div class="s3d-filter__title">Фільтр
	//           <div class="s3d-filter__close js-s3d-filter__close"><span></span><span></span></div>
	//         </div>
	//         <div class="s3d-filter__house js-s3d-filter__house js-s3d-filter__select">
	//           <div class="s3d-filter-select__title">Будинок</div>
	//           <div class="s3d-filter-select__list">
	//             <div class="s3d-filter-select__input--wrap">
	//               <input class="js-s3d-filter__house--input" type="checkbox" data-type="house" data-house="9" id="house-1" disabled>
	//               <label class="s3d-filter__house--label" for="house-1">1</label>
	//             </div>
	//             <div class="s3d-filter-select__input--wrap">
	//               <input class="js-s3d-filter__house--input" type="checkbox" data-type="house" data-house="12" id="house-2">
	//               <label class="s3d-filter__house--label" for="house-2">2</label>
	//             </div>
	//           </div>
	//         </div>
	//         <div class="s3d-filter__rooms js-s3d-filter__rooms js-s3d-filter__select">
	//           <div class="s3d-filter-select__title">Кімнат</div>
	//           <div class="s3d-filter-select__list">
	//             <div class="s3d-filter-select__input--wrap">
	//               <input class="js-s3d-filter__rooms--input" type="checkbox" data-type="rooms" data-rooms="1" id="rooms-1">
	//               <label class="s3d-filter__rooms--label" for="rooms-1">1</label>
	//             </div>
	//             <div class="s3d-filter-select__input--wrap">
	//               <input class="js-s3d-filter__rooms--input" type="checkbox" data-type="rooms" data-rooms="2" id="rooms-2">
	//               <label class="s3d-filter__rooms--label" for="rooms-2">2</label>
	//             </div>
	//             <div class="s3d-filter-select__input--wrap">
	//               <input class="js-s3d-filter__rooms--input" type="checkbox" data-type="rooms" data-rooms="3" id="rooms-3">
	//               <label class="s3d-filter__rooms--label" for="rooms-3">3</label>
	//             </div>
	//             <div class="s3d-filter-select__input--wrap">
	//               <input class="js-s3d-filter__rooms--input" type="checkbox" data-type="rooms" data-rooms="4" id="rooms-4">
	//               <label class="s3d-filter__rooms--label" for="rooms-4">4</label>
	//             </div>
	//           </div>
	//         </div>
	//         <div class="s3d-filter__floor js-s3d-filter__floor">
	//           <div class="s3d-filter-select__title">Поверх</div>
	//           <div class="s3d-filter-select__list js-filter-range">
	//             <input class="js-s3d-filter__floor--input" data-type="floor" data-min="1" data-max="22">
	//           </div>
	//           <div class="s3d-filter-select__list js-filter-input">
	//             <label>з
	//               <input class="js-s3d-filter__floor__min--input" type="number">
	//             </label>
	//             <label>по
	//               <input class="js-s3d-filter__floor__max--input" type="number">
	//             </label>
	//           </div>
	//         </div>
	//         <div class="s3d-filter__area js-s3d-filter__area">
	//           <div class="s3d-filter-select__title">Загальна площа м2</div>
	//           <div class="s3d-filter-select__list js-s3d-filter-range">
	//             <input class="js-s3d-filter__area--input" data-type="area" data-min="0" data-max="12000" data-from="0" data-to="12000">
	//           </div>
	//           <div class="s3d-filter-select__list js-filter-input">
	//             <label>з
	//               <input class="js-s3d-filter__area__min--input" type="number">
	//             </label>
	//             <label>по
	//               <input class="js-s3d-filter__area__max--input" type="number">
	//             </label>
	//           </div>
	//         </div>
	//         <div class="s3d-filter__living-space js-s3d-filter__living-space">
	//           <div class="s3d-filter-select__title">Житлова площа м2</div>
	//           <div class="s3d-filter-select__list js-filter-range">
	//             <input class="js-s3d-filter__living--input" data-type="living" data-min="0" data-max="12000">
	//           </div>
	//           <div class="s3d-filter-select__list js-filter-input">
	//             <label>з
	//               <input class="js-s3d-filter__living__min--input" type="number">
	//             </label>
	//             <label>по
	//               <input class="js-s3d-filter__living__max--input" type="number">
	//             </label>
	//           </div>
	//         </div>
	//         <div class="s3d-filter__buttons js-s3d-filter__buttons">
	//           <div class="s3d-filter__amount-flat">Знайдено<span class="s3d-filter__amount-flat__num js-s3d-filter__amount-flat__num">25</span></div>
	//           <button class="js-s3d-filter__button--reset s3d-filter__button--reset" type="button">Очистити
	//             <svg class="s3d-filter__button--reset-icon" role="presentation">
	//               <use xlink:href="#icon-close"></use>
	//             </svg>
	//           </button>
	//           <button class="js-s3d-filter__button--apply s3d-filter__button--apply" type="button">показати на генплані</button>
	//         </div>
	//       </div>`
	}
}
