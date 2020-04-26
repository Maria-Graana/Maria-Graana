import { Linking } from 'react-native';
import { Toast } from 'native-base';
import moment from 'moment-timezone';
import * as Network from 'expo-network';

const helper = {
	successToast(message) {
		Toast.show({
			text: message,
			duration: 3000,
			type: 'success'
		})
	},
	errorToast(message) {
		Toast.show({
			text: message,
			duration: 3000,
			type: 'danger'
		})
	},
	warningToast(message) {
		Toast.show({
			text: message,
			duration: 3000,
			type: 'warning'
		})
	},
	internetToast(message) {
		Toast.show({
			text: message,
			duration: 30000,
			type: 'danger'
		})
	},
	normalizeCnic(value) {
		if (!value) {
			return value;
		}
		const onlyNums = value && value.toString().replace(/[^\d]/g, "");
		if (onlyNums.length <= 5) {
			return onlyNums;
		}
		if (onlyNums.length <= 12) {
			return `${onlyNums.slice(0, 5)}-${onlyNums.slice(5)}`;
		}
		return `${onlyNums.slice(0, 5)}-${onlyNums.slice(5, 12)}-${onlyNums.slice(12, 13)}`;
	},
	normalizePhone(value) {
		if (!value) {
			return value;
		}
		const onlyNums = value && value.toString().replace(/[^\d]/g, "");
		if (onlyNums.length <= 4) {
			return onlyNums;
		}
		if (onlyNums.length <= 9) {
			return `${onlyNums.slice(0, 4)}-${onlyNums.slice(11)}`;
		}
		return `${onlyNums.slice(0, 5)}-${onlyNums.slice(5, 11)}`;
	},
	validateEmail(email) {
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(email);
	},
	callNumber(url) {
		if (url && url != 'tel:null') {
			Linking.canOpenURL(url)
				.then(supported => {
					if (!supported) {
						helper.errorToast(`No Phone Number`)
						console.log("Can't handle url: " + url);
					} else {
						return Linking.openURL(url)
					}
				}).catch(err => console.error('An error occurred', err));
		} else {
			helper.errorToast(`No Phone Number`)
		}
	},
	capitalize(str) {
		return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
	},
	convertTimeZoneTimeStamp(date) {
		let _format = 'YYYY-MM-DDTHH:mm'
		let paktz = moment.tz(date, 'Asia/Karachi').format(_format)
		var duration = moment.duration({ hours: 5, minutes: 15 })
		var sub = moment(paktz, _format).subtract(duration).format();

		return (new Date(sub)).valueOf()
	},
	convertTimeZone(date) {
		let _format = 'YYYY-MM-DDTHH:mm'
		let paktz = moment.tz(date, 'Asia/Karachi').format(_format)
		var duration = moment.duration({ hours: 5 })
		var sub = moment(paktz, _format).subtract(duration).format();
		return sub
	},
	checkInternet(){
		Network.getNetworkStateAsync()
			.then((res) => {
				if (res.type === 'NONE') {
					helper.internetToast('No Internet Connection!')
				} else {
					// Toast.hide()
				}
			})
	}
}



module.exports = helper;