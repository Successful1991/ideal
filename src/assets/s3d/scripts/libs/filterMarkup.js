function createFilter(wrap) {
	const close = createClose('s3d-filter__close', '<span></span><span></span>')
	const reset = createButton('js-s3d-filter__button--reset s3d-filter__button--reset', `
				<div class="s3d-filter__button--reset-icon">
					<svg role="presentation">
	              		<use xlink:href="#icon-reset"></use>
	            	</svg>
				</div>
				Очистить фильтр`)
	// const living = createRange('s3d-filter__living-space js-s3d-filter__living-space', 'living', 5, 555, 'Житлова площа м2')
	const area = createRange('s3d-filter__area js-s3d-filter__area', 'area', 5, 555, 'Площа м2')
	const floor = createRange('s3d-filter__floor js-s3d-filter__floor', 'floor', 1, 15, 'Поверх')
	const room = createCheckbox('s3d-filter__rooms js-s3d-filter__rooms js-s3d-filter__select', 'rooms', [{ id: 1, value: 1 }, { id: 2, value: 2 }, { id: 3, value: 3 }, { id: 4, value: 4 }], 'Кімнат')
	// const house = createCheckbox('s3d-filter__house js-s3d-filter__house js-s3d-filter__select', 'house', [{ id: 1, value: 1 }, { id: 2, value: 2 }], 'Будинок')
	const res = document.createElement('div')
	res.classList = 's3d-filter-wrap js-s3d-filter'
	res.innerHTML = `<div class="s3d-filter"><div class="s3d-filter__title">Подбор по параметрам</div>
			<div class="s3d__favourites js-s3d__favourites">
				<svg role="presentation"><use xlink:href="#icon-favourites"></use></svg>
	        	<span class="s3d__favourites-amount js-s3d__favourites-amount">0</span>
			</div>
<!--	        <div class="s3d-filter__buttons js-s3d-filter__buttons"></div>-->
	        </div>
	        <div  class="s3d-filter__table js-s3d-filter__table">
	        	<table>
	        		<tr>
	        			<th>Тип</th>
	        			<th>Комнат</th>
	        			<th>Этаж</th>
	        			<th>Площадь м2</th>
	        			<th>В избранное</th>
	        		</tr>
	        		<tr>
	        			<td>2A</td>
	        			<td>1</td>
	        			<td>4</td>
	        			<td>23 m2</td>
	        			<td>
	        				<label>
	        					<input type="checkbox"/>
	        					<svg role="presentation"><use xlink:href="#icon-favourites"></use></svg>
							</label>
						</td>
					</tr>
	        		<tr>
	        			<td>2A</td>
	        			<td>1</td>
	        			<td>4</td>
	        			<td>23 m2</td>
	        			<td>
	        				<label>
	        					<input type="checkbox"/>
	        					<svg role="presentation"><use xlink:href="#icon-favourites"></use></svg>
							</label>
						</td>
					</tr>
	        		<tr>
	        			<td>2A</td>
	        			<td>1</td>
	        			<td>4</td>
	        			<td>23 m2</td>
	        			<td>
	        				<label>
	        					<input type="checkbox"/>
	        					<svg role="presentation"><use xlink:href="#icon-favourites"></use></svg>
							</label>
						</td>
					</tr>
				</table>
			</div>
	        <div class="s3d-filter__amount-flat">
	        	Знайдено
	        	<span class="s3d-filter__amount-flat__num js-s3d__amount-flat__num">25</span>
	        	из
	        	<span class="s3d-filter__amount-flat__num js-s3d__amount-flat__num-all">456</span>
	        </div>
	`

	$(wrap).append(res)
	const title = $(res).find('.s3d-filter__title')[0]
	title.insertAdjacentElement('afterend', reset)
	title.insertAdjacentElement('afterend', close)
	// $(res).find('.s3d-filter__title')[0].insertAdjacentElement('afterend', house)
	title.insertAdjacentElement('afterend', room)
	title.insertAdjacentElement('afterend', area)
	title.insertAdjacentElement('afterend', floor)
	// $(res).find('.s3d-filter__title')[0].insertAdjacentElement('afterend', living)

	// $(res).find('.s3d-filter__amount-flat')[0].insertAdjacentElement('afterend', reset)

	return {
		area, floor, room, close, reset,
	}
}

function createClose(cs = 's3d-filter__close', text) {
	const elem = document.createElement('div')
	elem.classList = cs
	elem.innerHTML = text
	return elem
}

function createButton(cs, cont) {
	const elem = document.createElement('button')
	elem.classList = cs
	elem.type = 'button'
	elem.innerHTML = cont
	return elem
}

function createRange(cs, type, min, max, title) {
	const elem = document.createElement('div')
	elem.classList = cs
	elem.type = 'button'
	elem.innerHTML = `<div class="s3d-filter-select__title">${title}</div>
		<div class="s3d-filter-select__list js-filter-range">
			<label>з
				<input class="js-s3d-filter__${type}__min--input" type="number">
			</label>
			<input class="js-s3d-filter__${type}--input" data-type=${type} data-min=${min} data-max=${max} data-from=${min} data-to=${max}>
			<label>по
				<input class="js-s3d-filter__${type}__max--input" type="number">
			</label>
		</div>`
	return elem
}

function createCheckbox(cs, type, list, title) {
	const elem = document.createElement('div')
	elem.classList = cs
	elem.innerHTML = `
			<div class="s3d-filter-select__title">${title}</div>
			<div class="s3d-filter-select__list">
			  ${list.map(el => `<div class="s3d-filter-select__input--wrap">
  		  	<input class="js-s3d-filter__${type}--input" type="checkbox" data-type=${type} data-${type}=${el.value} id=${type}-${el.id}>
  		  	<label class="s3d-filter__${type}--label" for=${type}-${el.id}>${el.value}</label>
  			</div>`).join('')}
			  </div>
			</div>
	`
	return elem
}
