class History {
	constructor(data) {
		this.history = []
		this.click = data.scrollToBlock
		this.animateBlock = data.animateBlock
		this.update = this.update.bind(this)
	}

	init() {
		console.log('history 10')
		this.pageLoad()
		this.history.push('complex')
		window.onpopstate = () => {
			console.log(this, 14)
			this.onPopstate()
		}
	}

	pageLoad() {
		console.log('history 20')
		if (window.history.state === null) {
			window.history.replaceState(
				{
					isBackPage: true,
				},
				null,
				null,
			)
			window.history.pushState(
				{
					isBackPage: false,
				},
				null,
				null,
			)
		}
	}

	onPopstate() {
		console.log('history')
		window.history.pushState(
			{
				isBackPage: false,
			},
			null,
			null,
		)
		if (this.history.length > 0) {
			this.history.pop()
			this.animateBlock('translate', 'down')
			console.log('ststse')
			this.click(700)(this.history[this.history.length - 1])
		}
	}

	update(name) {
		console.log('history 55')
		this.history.push(name)
	}
}
