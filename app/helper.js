import { Toast } from 'native-base';

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
	}
}

module.exports = helper;