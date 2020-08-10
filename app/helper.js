import { Linking } from 'react-native';
import { Toast } from 'native-base';
import moment from 'moment-timezone';
import StaticData from './StaticData';
import { formatPrice } from './PriceFormate';
import AppStyles from './AppStyles'
import DiaryImg from '../assets/img/diary-icon-l.png'
import InventoryImg from '../assets/img/properties-icon-l.png'
import TeamDiaryImg from '../assets/img/teams-diary-icon-l.png'
import LeadsImg from '../assets/img/lead-icon-l.png'
import DashboardImg from '../assets/img/dashboard-icon-l.png'
import TargetsImg from '../assets/img/target-icon-l.png'
import ClientsImg from '../assets/img/clients-icon-l.png'
import * as Contacts from 'expo-contacts';
import * as Sentry from 'sentry-expo';
import _ from 'underscore';

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
		let taskDate = moment(val.date).format('YYYY-MM-DD')
		if (val.taskCategory === 'simpleTask') { // simple task is reffered to task added from diary directly or through lead but taskcategory is simpleTask
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
			else {
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
			else {
				return 'To-do'
			}
		}

	},
	checkStatusColor(val, todayDate) {
		let taskDate = moment(val.date).format('YYYY-MM-DD')
		if (val.taskCategory === 'simpleTask') {
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
		else if (val.taskType === 'viewing') {
			if (val.status === 'completed') {
				return 'green'
			}
			else {
				return 'red';
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
			else {
				return 'red';
			}
		}


	},
	tileImage(tile) {
		if (tile) {
			switch (tile) {
				case 'Diary':
					return DiaryImg
				case 'TeamDiary':
					return TeamDiaryImg
				case 'Leads':
					return LeadsImg
				case 'Inventory':
					return InventoryImg
				case 'Client':
					return ClientsImg
				case 'Targets':
					return TargetsImg
				case 'Dashboard':
					return DashboardImg
				default:
					break;
			}
		}
	},
	leadClosedToast() {
		Toast.show({
			text: 'Lead is already closed',
			duration: 3000,
			type: 'danger'
		})
	},
	leadNotAssignedToast() {
		Toast.show({
			text: 'Lead is not assigned to you',
			duration: 3000,
			type: 'danger'
		})
	},
	checkPrice(price, showPkr = false) {
		if (price === null) {
			return '0';
		}
		else if (Number(price) === StaticData.Constants.any_value) {
			return 'Any'
		}
		else {
			return (showPkr ? 'PKR ' : '') + formatPrice(price);
		}
	},
	callNumber(body, contacts) {
		let url = body.url
		if (url && url != 'tel:null') {
			Linking.canOpenURL(url)
				.then(supported => {
					if (!supported) {
						helper.errorToast(`No application available to dial phone number`)
						console.log("Can't handle url: " + url);
					} else {
						let result = helper.contacts(body.phone, contacts)
						if (body.name && body.name !== '' && body.name !== ' ' && body.phone && body.phone !== '') if (!result) helper.addContact(body)
						return Linking.openURL(url)
					}
				}).catch(err => console.error('An error occurred', err));
		} else {
			helper.errorToast(`No Phone Number`)
		}
	},
	contacts(targetNum, contacts) {
		let resultNum = null
		let phoneNumbers = _.flatten(_.pluck(contacts, "phoneNumbers"), true)
		if (contacts.length) {
			for (let i = 0; i < phoneNumbers.length; i++) {
				if (phoneNumbers[i] && phoneNumbers[i] !== undefined) {
					let phone = phoneNumbers[i]
					if ('number' in phone && phone.number) {
						phone.number = phone.number.replace(/\s/g, '')
						if (targetNum === phone.number) {
							resultNum = phone
							return resultNum
						}
						else {
							if (phone.number[0] === '0') {
								let newNumber = phone.number.replace('0', '+92')
								if (newNumber === targetNum) {
									resultNum = phone
									return resultNum
								}
							}
							if (phone.number[0] === '+') {
								let newNumber = phone.number.replace('+92', '0')
								if (newNumber === targetNum) {
									resultNum = phone
									return resultNum
								}
							}
						}
					}
				}
			}
			return resultNum
		} else return resultNum
	},
	addContact(data) {
		const contact = {
			[Contacts.Fields.FirstName]: data.name + ' - ARMS',
			[Contacts.Fields.PhoneNumbers]: [{ label: 'mobile', number: data.phone }]
		}
		Contacts.addContactAsync(contact)
			.then((result) => {
				console.log('PhoneID: ', result)
			})
			.catch((error) => {
				console.log('Contacts Error: ', error)
			})
	}
}



module.exports = helper;