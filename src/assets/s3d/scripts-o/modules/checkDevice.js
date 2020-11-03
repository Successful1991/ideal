const isDevice = (type = 'mobile') => {
	let list = ''
	type === 'ios' ? list = /iPhone|iPad|iPod/ : list = /Android|webOS|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini|iPhone|iPad|iPod/
	return list.test(window.navigator.userAgent)
}
export default isDevice
