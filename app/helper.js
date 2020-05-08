import { Linking } from 'react-native';
import { Toast } from 'native-base';
import moment from 'moment-timezone';
import * as Network from 'expo-network';
import NetInfo from '@react-native-community/netinfo';
import AppStyles from './AppStyles'

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
	},
	callNumber(url) {
		if (url && url != 'tel:null') {
			Linking.canOpenURL(url)
				.then(supported => {
					if (!supported) {
						helper.errorToast(`No application available to dial phone number`)
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
	propertyCheck(data) {
		let matches = []
		if (data.length) {
			data.map((item, index) => {
				if (item.graana_id) {
					item.images = item.property_images || []
				} else {
					item.images = item.armsPropertyImages || []
				}
				if ('armsuser' in item) {
					item.user = item.armsuser
					item.checkBox = false
					return (matches.push(item))
				} else {
					item.checkBox = false
					return (matches.push(item))
				}
			})
			return matches
		} else return []
	},
	setStatusText(val, todayDate) {
		let taskDate = moment(val.date).format('L')
		if (val.armsProjectLeadId === null && val.taskType !== 'viewing') {
			if (taskDate > todayDate && (val.status !== 'inProgress' && val.status !== 'completed')) {
				return 'To-do'
			}
			else if (taskDate < todayDate && (val.status !== 'inProgress' && val.status !== 'completed')) {
				return 'Overdue';
			}
			else if (val.status === 'inProgress') {
				return 'In Progress';
			}
			else if (val.status === 'completed') {
				return 'Completed';
			}
			else if (val.status === 'pending') {
				return 'To-do';
			}
		}
		else if (val.taskType === 'viewing') {
			if (val.status === 'completed') {
				return 'Viewing Done';
			}
			else{
				return 'Viewing Pending'
			}
		}
		else {
			// THIS IS DONE SPECIFICALLY FOR MEETING ADDED FROM INVESTMENT LEAD
			if (val.response) {
				switch (val.response) {
					case 'visited':
						return 'Visited'
					case 'expected_conversion':
						return 'Meeting Expected Conversion'
					case 'deal_signed':
						return 'Meeting Deal Signed'
					default:
						break;
				}
			}
		}

	},
	checkStatusColor(val, todayDate) {
		let taskDate = moment(val.date).format('L')
		if (val.armsProjectLeadId === null) {
			if (taskDate > todayDate && (val.status !== 'inProgress' && val.status !== 'completed')) {
				return 'red'
			}
			if (taskDate < todayDate && (val.status !== 'inProgress' && val.status !== 'completed')) {
				return AppStyles.colors.subTextColor;
			}
			else if (val.status === 'inProgress') {
				return '#FDD835';
			}
			else if (val.status === 'completed') {
				return 'green';
			}
			else if (val.status === 'pending') {
				return 'red';
			}
			else {
				return 'black';
			}
		}
		else {
			// THIS IS DONE SPECIFICALLY FOR MEETING ADDED FROM INVESTMENT LEAD
			if (val.response) {
				switch (val.response) {
					case 'visited':
						return 'green'
					case 'expected_conversion':
						return '#FDD835'
					case 'deal_signed':
						return 'green'
					default:
						break;
				}
			}
		}


	},
}



module.exports = helper;