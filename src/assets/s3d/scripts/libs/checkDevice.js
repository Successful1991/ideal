const isDevice = (type = 'mobile') => {
	const list = ((type === 'ios') ? /iPhone|iPad|iPod/ : /Android|webOS|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini|iPhone|iPad|iPod/)
	return list.test(window.navigator.userAgent)
}
