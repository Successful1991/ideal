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
			// console.log('$(\'.js-s3d__slideModule\')', event)
			console.log(event.target)
			console.log(event.target.checked)
			// console.log($(event.currentTarget).data('id'))
			console.log('--------------')
			if (id === undefined || id === null || isNaN(id)) return

			if (event.target.checked) {
				this.addStorage(id)
			}
			this.removeElemStorage(id)
			// this.addStorage($(event.target).closest('tr').data('id'))
		})

		$('.js-s3d__fv').on('click', '.js-s3d__fv__close', () => {
			$('.js-s3d__fv').removeClass('s3d__active')
		})
		this.init()
	}

	init() {
		// sessionStorage.clear()
		this.createMarkup()
		this.showSelectFlats()
	}

	showSelectFlats() {
		const favourites = this.getFavourites()
		if (!favourites || favourites === null || isNaN(favourites) ) return
		favourites.forEach(id => {
			this.showSelectFlat(id)
		})
	}

	showSelectFlat(id) {
		// console.log('id', id)
		// console.log('this.listObj[id]', this.listObj[id])
		$(this.listObj[id].listHtmlLink).find('input').prop('checked', true)
		$(this.listObj[id].cardHtmlLink).find('input').prop('checked', true)
	}

	addStorage(id) {
		let favourites = this.getFavourites()
		if ((favourites && favourites.includes(id)) || !id || isNaN(id)) return
		if (favourites === null) {
			favourites = [id]
		} else {
			favourites.push(id)
		}
		console.log('addStorage(id) ', favourites, id)
		sessionStorage.setItem('favourites', JSON.stringify(favourites))
		this.updateAmount(favourites.length)
		this.showSelectFlat(id)
		console.log('addStorage', sessionStorage)
	}

	removeElemStorage(id) {
		const favourites = this.getFavourites()
		const index = favourites.indexOf(id)
		if (index === -1 || !favourites) return
		sessionStorage.setItem('favourites', JSON.stringify(favourites.splice(index, 1)))
		this.updateAmount(favourites.length)
		console.log('removeElemStorage', sessionStorage)
	}

	clearStorage() {
		sessionStorage.removeItem('favourites')
		this.updateAmount(0)
	}

	getFavourites() {
		const storage = JSON.parse(sessionStorage.getItem('favourites'))
		console.log('storage', storage)
		console.log('getFavourites', sessionStorage)
		return storage ? storage : []
	}

	createMarkup() {
		$('.js-s3d-fv__element').remove()
		const favourites = this.getFavourites()
		this.updateAmount(favourites.length)
		$(this.wrap).append(
			favourites.map(el => this.createElemHtml(this.listObj[el]))
		)
	}

	addElemHtml() {

	}

	createElemHtml(el) {
		return `
			<tr class="s3d-fv__element js-s3d-fv__element" data-id="1">
        <td><img class="s3d-fv__image" src="wp-content/themes/idealist/assets/s3d/images/KV.png"></td>
        <td>23</td>
        <td>2А</td>
        <td>3</td>
        <td>5</td>
        <td>34</td>
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
