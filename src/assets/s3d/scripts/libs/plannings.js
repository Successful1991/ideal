class Plannings {
	constructor(conf) {
		this.list = conf.list
		this.listObj = conf.data
		this.wrap = conf.wrap
		this.createList(this.list, this.wrap)
	}

	// init() {
	//
	// }

	createList(data, wrap) {
		const result = []
		data.forEach(el => {
			const nodeElem = this.createCard(el)
			el['cardHtmlLink'] = nodeElem
			result.push(nodeElem)
		})
		console.log(result)
		$(wrap).append(result)
	}

	createCard(el) {
		const div = document.createElement('div')
		div.dataset.id = el.id
		div.classList = 's3d-pl__plane'
		div.innerHTML = `
        <div class="s3d-pl__type">тип 2А</div><img class="s3d-pl__image" src="assets/s3d/images/KV.png">
        <table class="s3d-pl__table">
          <tbody><tr class="s3d-pl__row">
            <td class="s3d-pl__value">134</td>
            <td class="s3d-pl__name">№ квартиры</td>
          </tr>
          <tr class="s3d-pl__row">
            <td class="s3d-pl__value">4</td>
            <td class="s3d-pl__name">Этаж</td>
          </tr>
          <tr class="s3d-pl__row">
            <td class="s3d-pl__value">2</td>
            <td class="s3d-pl__name">Комнаты</td>
          </tr>
          <tr class="s3d-pl__row">
            <td class="s3d-pl__value">34</td>
            <td class="s3d-pl__name">Площадь м2</td>
          </tr>
        </tbody></table>
        <div class="s3d-pl__buttons"><button type="button" class="s3d-pl__link">Подробнее</button>
          <label class="s3d-pl__add-favourites js-s3d-add__favourites">
          	<input type="checkbox">
            <svg>
              <use xlink:href="#icon-favourites"></use>
            </svg>
          </label>
        </div>
		`
		return div
	}
}
