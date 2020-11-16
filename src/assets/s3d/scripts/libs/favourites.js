class Favourite {
	constructor(conf) {
		this.listObj = conf.data
		this.list = conf.list
		this.wrap = conf.wrap

		$('.js-s3d__slideModule').on('click', '.js-s3d__favourites', () => {
			this.createMarkup()
			// this.addElemHtml()
			$('.js-s3d__fv').addClass('s3d__active')
		})

		$('.js-s3d__slideModule').on('change', '.js-s3d-add__favourites', event => {
			const id = $(event.currentTarget).data('id')
			if (checkValue(id)) return
			if (event.target.checked) {
				this.addStorage(id)
			} else {
				this.removeElemStorage(id)
			}
			// this.addStorage($(event.target).closest('tr').data('id'))
		})

		$('.js-s3d__fv').on('click', '.js-s3d__fv__close', () => {
			$('.js-s3d__fv').removeClass('s3d__active')
		})

		$('.js-s3d__fv').on('click', '.js-s3d-fv__remove', e => {
			const id = $(e.target).closest('.js-s3d-fv__element').data('id')
			if (this.removeElemStorage(id)) {
				$(e.target).closest('.js-s3d-fv__element').remove()
				// console.log($(`.js-s3d-filter tr[data-id = ${id}]`).find('.js-s3d-add__favourites'))
				// this.checkedFlat(id, false)
				// $(`.js-s3d-filter [data-id = ${id}]`).find('.js-s3d-add__favourites input').prop('checked', false)
				// $(`.js-s3d__pl__list [data-id = ${id}]`).find('.js-s3d-add__favourites input').prop('checked', false)
				// $(`.js-s3d-filter tr[data-id = ${id}]`).find('.js-s3d-add__favourites').prop('checked', false)
			}
		})
		//
		// $('.js-s3d__fv').on('click', e => {
		// 	console.log('$(.js-s3d__fv)', e)
		// })
		this.init()
	}

	init() {
		// sessionStorage.clear()
		this.createMarkup()
		this.showSelectFlats()
	}

	showSelectFlats() {
		const favourites = this.getFavourites()
		if (checkValue(favourites)) return
		favourites.forEach(id => {
			this.checkedFlat(id, true)
		})
	}

	checkedFlat(id, value) {
		console.log('checkedFlat', value)
		let check = $(this.listObj[id].listHtmlLink).find('input').prop('checked')
		// console.log('checkedFlat(id)  id', id)
		// console.log('this.listObj[id]', this.listObj[id])
		// console.log('this.listObj[id].listHtmlLink', this.listObj[id].listHtmlLink)
		// console.log('this.listObj[id].cardHtmlLink', this.listObj[id].cardHtmlLink)
		// console.log('this.listObj[id].listHtmlLink', this.listObj[id].listHtmlLink.querySelector('input'))
		if (value !== 'undefined') { check = value }
		console.log('checkedFlat', check)
		this.listObj[id].listHtmlLink.querySelector('input').checked = check
		this.listObj[id].cardHtmlLink.querySelector('input').checked = check
		// this.listObj[id].listHtmlLink.querySelector('input')
		// $(this.listObj[id].listHtmlLink).find('input').prop('checked', true)
		// $(this.listObj[id].cardHtmlLink).find('input').prop('checked', true)
	}

	addStorage(id) {
		let favourites = this.getFavourites()
		// if ((favourites && favourites.includes(id)) || !id || isNaN(id)) return
		if (checkValue(favourites)) {
			favourites = [id]
		} else {
			favourites.push(id)
		}

		if (favourites.length > 0) {
			$('.js-s3d-favorite__wrap').removeClass('s3d-hidden')
		}
		sessionStorage.setItem('favourites', JSON.stringify(favourites))
		this.updateAmount(favourites.length)
		this.checkedFlat(id, true)
	}

	removeElemStorage(id) {
		const favourites = this.getFavourites()
		const index = favourites.indexOf(id)
		if (index === -1 || !favourites) return
		favourites.splice(index, 1)
		sessionStorage.setItem('favourites', JSON.stringify(favourites))
		this.updateAmount(favourites.length)
		this.checkedFlat(id, false)
		if (favourites.length === 0) {
			$('.js-s3d-favorite__wrap').addClass('s3d-hidden')
			$('.js-s3d__fv').removeClass('s3d__active')
		}
		return true
	}

	clearStorage() {
		sessionStorage.removeItem('favourites')
		this.updateAmount(0)
		$('.js-s3d__pl__list input').prop('checked', false)
		$('.js-s3d-filter input').prop('checked', false)
		$('.js-s3d-favorite__wrap').addClass('s3d-hidden')
	}

	getFavourites() {
		const storage = JSON.parse(sessionStorage.getItem('favourites'))
		return storage ? storage : []
	}

	createMarkup() {
		$('.js-s3d-fv__element').remove()
		const favourites = this.getFavourites()
		this.updateAmount(favourites.length)
		if (favourites.length > 0) {
			$('.js-s3d-favorite__wrap').removeClass('s3d-hidden')
		}
		$(this.wrap).append(
			favourites.map(el => this.createElemHtml(this.listObj[el]))
		)
	}

	createElemHtml(el) {
		return `
			<tr class="s3d-fv__element js-s3d-fv__element" data-id=${el.id}>
        <td><img class="s3d-fv__image" src="${el.img_big}"></td>
<!--        <td><img class="s3d-fv__image" src="wp-content/themes/idealist/assets/s3d/images/KV.png"></td>-->
        <td>${el.number}</td>
        <td>${el.type}</td>
        <td>${el.rooms}</td>
        <td>${el.floor}</td>
        <td>${el['all_room']}</td>
        <td>
          <button class="s3d-fv__table__remove js-s3d-fv__remove" type="button">
            <svg class="s3d-fv__table__icon" role="presentation">
              <use xlink:href="#icon-reset"></use>
            </svg>
          </button>
        </td>
        tr>
		`
	}

	updateAmount(value) {
		$('.js-s3d__favourites-amount').html(value)
	}
}
