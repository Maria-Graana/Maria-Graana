import React, { Component } from 'react';
import { View, ScrollView, KeyboardAvoidingView } from 'react-native';
import axios from 'axios'
import AppStyles from '../../AppStyles'
import { connect } from 'react-redux';
import InnerForm from './innerForm';
import StaticData from '../../StaticData';
import LeadRCMPaymentPopup from '../../components/LeadRCMPaymentModal/index'
import moment from 'moment'
import { ProgressBar } from 'react-native-paper';
import { setlead } from '../../actions/lead';
import helper from '../../helper';
import PaymentAlert from '../../components/PaymentAlert'
import CMBottomNav from '../../components/CMBottomNav'
import UnitDetailsModal from '../../components/UnitDetailsModal'


class Payments extends Component {
	constructor(props) {
		super(props)
		const { lead, user } = this.props
		this.state = {
			getProject: [],
			checkValidation: false,
			getUnit: [],
			unitDetailModal: false,
			arrowCheck: {
				discount: false,
				token: false,
				downPayment: false,
				installments: false,
				payments: false,
			},
			getFloors: [],
			paymentDate: '',
			tokenDate: lead.tokenPaymentTime ? moment(lead.tokenPaymentTime).format('hh:mm a') + ' ' + moment(lead.tokenPaymentTime).format('MMM DD') : '',
			downPaymentTime: lead.paymentTime ? moment(lead.paymentTime).format('hh:mm a') + ' ' + moment(lead.paymentTime).format('MMM DD') : '',
			totalInstalments: lead.cmInstallments.length > 0 ? lead.cmInstallments : [],
			units: [],
			remainingPayment: 'no',
			readOnly: {
				totalSize: '',
				rate: '',
				totalPrice: '',
			},
			formData: {
				projectId: lead.projectId ? lead.projectId : '',
				floorId: lead.floorId ? lead.floorId : '',
				unitId: lead.unitId ? lead.unitId : '',
				token: lead.token ? lead.token : '',
				discount: lead.discount ? lead.discount : '',
				commisionPayment: '',
				downPayment: lead.downPayment ? lead.downPayment : '',
				paymentType: '',
				payment: '',
				discountPercentage: lead.unit != null ? lead.unit.discount : '',
				unitStatus: lead.unit != null ? lead.unit.bookingStatus : '',
				installmentDue: '',
			},
			instalments: lead.no_of_installments ? lead.no_of_installments : '',
			reasons: [],
			isVisible: false,
			selectedReason: '',
			checkReasonValidation: false,
			progressValue: 0,
			fullPaymentCount: 1,
			paymentFiledsArray: lead.payment && lead.payment.length > 0 ? lead.payment : [],
			// checkPaymentTypeValue: ''
			closedLeadEdit:
				lead.status != StaticData.Constants.lead_closed_won &&
				lead.status != StaticData.Constants.lead_closed_lost,
			showStyling: '',
			showDate: false,
			promotionDiscountFormat: false,
			tokenFormat: false,
			tokenDateStatus: { name: '', status: false },
			downPaymentDateStatus: { name: '', status: false },
			downPaymentFormat: false,
			dateStatusForPayments: [],
			paymentFromat: [],
			dateStatusForInstallments: [],
			installmentsFromat: [],
			possessionFormat: false,
			checkForUnassignedLeadEdit: lead.assigned_to_armsuser_id == user.id ? true : false,
			cancelNewData: '',
			discountAmount: lead.unit != null && lead.unit.discount != null && lead.unit.discount_amount,
			discountedPrice: lead.unit != null && lead.unit.discount != null && lead.unit.discounted_price,
			getAllProject: [],
			checkMonthlyOption: false,
			possessionCharges: 'quarterly',
			checkForUnitAvail: true,
		}

	}

	componentDidMount() {
		this.fetchLead()
		this.getAllProjects();
		this.setFields();
	}

	setFields = () => {
		const {
			formData,
			arrowCheck,
			tokenDateStatus,
			downPaymentDateStatus,
			totalInstalments,
		} = this.state
		const { lead } = this.props
		let data = lead
		let newtokenDateStatus = tokenDateStatus
		let newdownPaymentDateStatus = downPaymentDateStatus
		this.setState({
			readOnly: {
				totalSize: '',
				rate: '',
				totalPrice: '',
			},
			totalInstalments: data.cmInstallments.length > 0 ? data.cmInstallments : [],
			formData: {
				projectId: data.projectId ? data.projectId : '',
				floorId: data.floorId ? data.floorId : '',
				unitId: data.unitId ? data.unitId : '',
				token: data.token ? data.token : '',
				discount: data.discount ? data.discount : '',
				commisionPayment: '',
				downPayment: data.downPayment ? data.downPayment : '',
				discountPercentage: data.unit != null ? data.unit.discount : '',
				installmentDue: lead && lead.installmentDue != 'monthly' ? 'quarterly' : 'monthly',
			},
			instalments: data.project && data.project.installment_plan ? this.noOfInstallments(data.project.installment_plan) : '',
			possessionCharges: data.unit != null ? data.unit.possession_charges : '',
			checkForUnitAvail: data.unit && data.unit != null && data.unit.bookingStatus != 'Available' ? false : true,
		}, () => {
			let name = ''
			if (data.projectId != null) {
				this.getFloors(data.projectId)
				this.discountPayment()
			}
			if (data.floorId != null) {
				this.getUnits(data.projectId, data.floorId)
				this.discountPayment()
			}
			if (data.unitId != null) {
				this.readOnly(data.unitId)
				this.discountPayment()
			}
			if (data.discount != null) {
				this.discountPayment(formData)
				this.discountPayment()

				arrowCheck[name] = false
				this.formatStatusChange(name, true)
			}
			if (data.unit != null && data.unit.possession_charges != null) {
				name = 'possessionCharges'
				this.discountPayment()
				this.formatStatusChange(name, true)
			}
			if (data.token != null) {
				this.discountPayment(formData)
				this.discountPayment()
				name = 'token'
				arrowCheck[name] = false
				this.formatStatusChange(name, true)
				newtokenDateStatus['name'] = name
				newtokenDateStatus['status'] = true
			}
			if (data.downPayment != null) {
				this.discountPayment(formData)
				this.discountPayment()
				name = 'downPayment'
				arrowCheck[name] = false
				this.formatStatusChange(name, true)
				newdownPaymentDateStatus['name'] = name
				newdownPaymentDateStatus['status'] = true

			}
			if (data.no_of_installments != null) {
				this.instalmentsField(data.no_of_installments)
				this.discountPayment()
			}
			if (data.project.installment_plan != null) {
				var totalInstallments = this.noOfInstallments(data.project.installment_plan)
				this.instalmentsField(totalInstallments)
				this.discountPayment()
			}
			if (data.cmInstallments.length) {
				name = 'installments'
				arrowCheck[name] = false
				this.setInstallmentsDateArray(data.no_of_installments);
				this.setState({
					formData: {
						...formData,
						paymentType: 'installments'
					}
				})
			}

			if (data.payment && data.payment.length) {
				name = 'payments'
				arrowCheck[name] = false
				this.setPaymentDateArray(data.payment.length);
				this.setState({
					formData: {
						...formData,
						paymentType: 'full_payment'
					}
				})
			}

			this.setState({
				arrowCheck,
				tokenDateStatus: newtokenDateStatus,
			})

		})
	}

	noOfInstallments = (noOfInstallments) => {
		const { formData } = this.state
		var total = ''
		if(formData.installmentDue === 'quarterly'){
			total = noOfInstallments * 4
		}else{
			total = noOfInstallments * 12
		}
		console.log(total)
		return total
	}

	getAllProjects = () => {
		axios.get(`/api/project/all`)
			.then((res) => {
				let projectArray = [];
				res && res.data.items.map((item, index) => { return (projectArray.push({ value: item.id, name: item.name })) })
				this.setState({
					getProject: projectArray,
					getAllProject: res.data
				}, () => {
					this.getSpecificProject(this.state.formData.projectId)
				})
			}).catch((error) => {
				console.log('project')
			})
	}

	getSpecificProject = (id) => {
		const { getAllProject } = this.state
		var getSpecific = getAllProject && getAllProject.items.filter((item) => { return item.id == id && item })
		this.setState({
			checkMonthlyOption: getSpecific && getSpecific[0].monthly_installment_availablity === 'yes' ? true : false
		})
	}

	fetchLead = () => {
		const { lead } = this.props
		const { cmProgressBar } = StaticData
		axios.get(`/api/leads/project/byId?id=${lead.id}`)
			.then((res) => {
				this.props.dispatch(setlead(res.data))
				this.setState({
					progressValue: cmProgressBar[res.data.status] || 0
				})
			})
			.catch((error) => {
				console.log(error)
			})
	}

	getFloors = (id) => {
		axios.get(`/api/project/floors?projectId=${id}`)
			.then((res) => {
				let Array = [];
				res && res.data.rows.map((item, index) => { return (Array.push({ value: item.id, name: item.name })) })
				this.setState({
					getFloors: Array,
				})
			})
	}

	getUnits = (projectId, floorId) => {
		const { lead } = this.props
		if (lead.unit != null) {
			if (lead.unit.bookingStatus === 'Available') {
				axios.get(`/api/project/shops?projectId=${projectId}&floorId=${floorId}&status=Available`)
					.then((res) => {
						let array = [];
						res && res.data.rows.map((item, index) => { return (array.push({ value: item.id, name: item.name })) })
						this.setState({
							getUnit: array,
							units: res.data.rows
						}, () => {
							if (lead.unitId != null) {
								this.readOnly(lead.unitId)
								this.getUnitDetailsThroughId(lead.unitId)
							}
						})
					})
			} else {
				this.setState({
					getUnit: [{ value: lead.unit.id, name: lead.unit.name }],
					unitDetailsData: lead.unit
				})
			}
		} else {
			axios.get(`/api/project/shops?projectId=${projectId}&floorId=${floorId}&status=Available`)
				.then((res) => {
					let array = [];
					res && res.data.rows.map((item, index) => { return (array.push({ value: item.id, name: item.name })) })
					this.setState({
						getUnit: array,
						units: res.data.rows
					}, () => {
						if (lead.unitId != null) {
							this.readOnly(lead.unitId)
							this.getUnitDetailsThroughId(lead.unitId)
						}
					})
				})
		}
	}

	setPaymentDateArray = (length) => {
		const { dateStatusForPayments, paymentFromat } = this.state
		var arrayDate = [...dateStatusForPayments]
		var arrayFormat = [...paymentFromat]
		for (var i = 0; i < length; i++) {
			arrayDate.push({ name: i, status: true })
			arrayFormat.push({ name: i, status: true })
		}
		this.setState({
			dateStatusForPayments: arrayDate,
			paymentFromat: arrayFormat,
		})
	}

	setInstallmentsDateArray = (length) => {
		const { dateStatusForInstallments, installmentsFromat } = this.state
		var arrayDate = [...dateStatusForInstallments]
		var arrayFormat = [...installmentsFromat]
		var newLength = length
		newLength = length < 4 ? 4 : length
		for (var i = 0; i < newLength; i++) {
			arrayDate.push({ name: i, status: true })
			arrayFormat.push({ name: i, status: true })
		}
		this.setState({
			dateStatusForInstallments: arrayDate,
			installmentsFromat: arrayFormat,
		})
	}

	instalmentsField = (value) => {
		const { dateStatusForInstallments, installmentsFromat } = this.state
		const { lead } = this.props
		let array = []
		let newdateStatusForInstallments = [...dateStatusForInstallments]
		let newinstallmentsFromat = [...installmentsFromat]
		for (var i = 0; i < value; i++) {
			newdateStatusForInstallments.push({ name: '', status: false })
			newinstallmentsFromat.push({ name: '', status: false })
			array.push({
				id: lead.cmInstallments.length > i ?
					lead.cmInstallments[i].id
					:
					null,
				installmentAmount: lead.cmInstallments.length > i ?
					lead.cmInstallments[i].installmentAmount
					:
					null,
				installmentAmountDate: lead.cmInstallments.length > i ?
					lead.cmInstallments[i].installmentAmount != null && moment(lead.cmInstallments[i].updatedAt).format('hh:mm a') + ' ' + moment(lead.cmInstallments[i].updatedAt).format('MMM DD')
					:
					null,
			})
		}
		this.setState({
			totalInstalments: array,
			instalments: value,
			dateStatusForInstallments: newdateStatusForInstallments,
			installmentsFromat: newinstallmentsFromat
		}, () => {
			this.submitValues('no_installments')
			this.discountPayment();
		})
	}

	readOnly = (unitId) => {
		const { units } = this.state
		let array = {};
		array = units && units.filter((item) => { return item.id === unitId && item })
		let data = array.length ? array[0] : ''
		if (unitId != null || units.length > 0) {
			this.setState({
				readOnly: {
					totalSize: data.area + ' ' + data.area_unit,
					rate: data.pricePerSqFt,
					totalPrice: data.area * data.pricePerSqFt,
				},
				remainingPayment: data.area * data.pricePerSqFt,
			}, () => {
				this.discountPayment()
			})
		}
	}

	discountPayment = () => {
		const { readOnly, unitDetailsData, formData, totalInstalments, paymentFiledsArray, discountedPrice, possessionCharges } = this.state
		let totalPrice = unitDetailsData && unitDetailsData.unit_price
		let totalInstallments = ''
		let totalPayment = ''
		totalInstalments.map((item, index) => {
			if (item.installmentAmount) {
				totalInstallments = Number(totalInstallments) + Number(item.installmentAmount)
			}
		})
		paymentFiledsArray.map((item, index) => {
			if (item.installmentAmount) {
				totalPayment = Number(totalPayment) + Number(item.installmentAmount)
			}
		})
		let remaining = ''
		if (totalPrice != '') {
			remaining = totalPrice - Number(possessionCharges) - Number(discountedPrice) - formData['downPayment'] - formData['token'] - Number(totalInstallments) - Number(totalPayment)
		}
		this.setState({ remainingPayment: remaining })
	}

	currentDate = (name) => {
		var date = new Date()
		if (name === 'downPayment') {
			this.setState({
				downPaymentTime: moment(date).format('hh:mm a') + ' ' + moment(date).format('MMM DD')
			})
		}

		if (name === 'token') {
			this.setState({
				tokenDate: moment(date).format('hh:mm a') + ' ' + moment(date).format('MMM DD')
			})
		}

		if (name === 'payment') {
			this.setState({
				paymentDate: moment(date).format('hh:mm a') + ' ' + moment(date).format('MMM DD')
			})
		}
	}

	handleForm = (value, name) => {
		const {
			formData,
			arrowCheck,
			paymentFiledsArray,
			modalVisible,
			totalInstalments,
			unitDetailsData
		} = this.state
		let newFormData = { ...formData }
		newFormData[name] = value
		if (name === 'projectId') {
			this.getSpecificProject(value)
		}
		if (name === 'unitId') {
			console.log('hello')
		}
		if (name === 'discount') {
			arrowCheck[name] = true
		}
		if (name == 'token') {
			arrowCheck[name] = true
		}
		if (name === 'downPayment') {
			arrowCheck[name] = true
		}
		if (name === 'payment') {
			arrowCheck[name] = true
		}
		if (name === 'paymentType') {
			if (value === 'installments' && paymentFiledsArray.length > 0) {
				this.setState({
					modalVisible: !modalVisible,
					checkPaymentTypeValue: value,
				})
			}

			if (value === 'full_payment' && totalInstalments.length > 0) {
				this.setState({
					modalVisible: !modalVisible,
					checkPaymentTypeValue: value,
				})
			}
			if (paymentFiledsArray.length === 0) {
				this.addFullpaymentFields()
			}
		}
		if (name === 'possessionCharges') {
			this.setState({
				possessionCharges: value
			})
		}
		if (name === 'discountPercentage' && unitDetailsData != '') {
			var discountAmount = this.percentFormula(unitDetailsData.unit_price, value)
			this.setState({
				discountAmount: discountAmount,
				discountedPrice: unitDetailsData.unit_price - discountAmount
			})
		}

		this.setState({ formData: newFormData, arrowCheck }, () => {
			if (name === 'projectId' && value != '') {
				this.getFloors(newFormData.projectId)
				this.submitValues('projectId')
			}
			if (name === 'floorId' && value != '') {
				this.getUnits(newFormData.projectId, newFormData.floorId)
				this.submitValues('floorId')
			}
			if (name === 'unitId' && value != '') {
				this.readOnly(value)
				this.submitValues('unitId')
				this.getUnitDetailsThroughId(value)
			}
			if (name === 'installmentDue') {
				this.submitValues(name)
			}
			if (name === 'possessionCharges') {
				this.discountPayment()
			}
			if (name === 'discountPercentage') {
				this.discountPayment(newFormData)
			}
			if (name == 'token') {
				this.currentDate(name)
				this.discountPayment(newFormData)
			}
			if (name === 'downPayment') {
				this.currentDate(name)
				this.discountPayment(newFormData)
			}
			if (name === 'no_installments') {
				this.instalmentsField(value)
				this.submitValues(name)
			}
			if (name === 'payment') {
				this.currentDate(name)
				this.submitValues('payment')
				// this.discountPayment(newFormData)
			}
		})
	}

	getUnitDetailsThroughId = (id) => {
		const { units, formData } = this.state
		var getObject = units && units.filter((item) => { return item.id == id ? item : null })
		var newFormData = { ...formData }
		newFormData['discountPercentage'] = ''
		this.setState({
			unitDetailsData: getObject[0],
			formData: newFormData,
			discountAmount: '',
			discountedPrice: '',
		})
	}

	handleInstalments = (value, index) => {
		const { totalInstalments, arrowCheck } = this.state
		var date = new Date()
		arrowCheck['installments'] = true
		let newInstallments = [...totalInstalments]
		newInstallments[index].installmentAmount = parseInt(value)
		newInstallments[index].installmentDate = moment(date).format('hh:mm a') + ' ' + moment(date).format('MMM DD')
		this.setState({ totalInstalments: newInstallments, arrowCheck }, () => {
			this.discountPayment()
		})
	}

	handlePayments = (value, index) => {
		const { paymentFiledsArray, arrowCheck } = this.state
		var date = new Date()
		arrowCheck['payments'] = true
		let newPayments = [...paymentFiledsArray]
		newPayments[index].installmentAmount = value
		newPayments[index].installmentDate = moment(date).format('hh:mm a') + ' ' + moment(date).format('MMM DD')
		this.setState({ paymentFiledsArray: newPayments, arrowCheck }, () => {
			this.discountPayment()
		})
	}

	formSubmit = () => {
		const { lead } = this.props
		const { formData, totalInstalments, remainingPayment, readOnly, paymentFiledsArray } = this.state
		let body = {
			discount: formData.discount ? parseInt(formData.discount) : null,
			downPayment: formData.downPayment ? parseInt(formData.downPayment) : null,
			floorId: formData.floorId ? formData.floorId : null,
			token: formData.token ? parseInt(formData.token) : null,
			unitId: formData.unitId ? formData.unitId : null,
			installments: totalInstalments.length > 0 ? totalInstalments : paymentFiledsArray.length > 0 ? paymentFiledsArray : null,
			no_of_installments: totalInstalments.length ? totalInstalments.length : null,
			remainingPayment: remainingPayment,
		}
		axios.patch(`/api/leads/project?id=${lead.id}`, body)
			.then((res) => {
				if (remainingPayment <= 0 && remainingPayment != 'no' && readOnly.totalPrice != '') {
					this.setState({ reasons: StaticData.paymentPopupDone, isVisible: true, checkReasonValidation: '' })
				} else {
					this.setState({ reasons: StaticData.paymentPopup, isVisible: true, checkReasonValidation: '' })
				}
			}).catch(() => {
				console.log('Some thing went wrong!!')
			})
	}

	submitValues = (name, arrayName) => {
		const {
			formData,
			instalments,
			totalInstalments,
			tokenDate,
			arrowCheck,
			paymentFiledsArray,
			remainingPayment,
			tokenDateStatus,
			downPaymentDateStatus,
			dateStatusForPayments,
			dateStatusForInstallments,
			unitDetailsData,
			discountAmount,
			discountedPrice,
			possessionCharges,
		} = this.state

		const { lead } = this.props
		formData[name] = formData[name]
		let body = {};
		let newArrowCheck = { ...arrowCheck }
		let newtokenDateStatus = tokenDateStatus
		let newdownPaymentDateStatus = downPaymentDateStatus
		let newdateStatusForPayments = [...dateStatusForPayments]
		let newdateStatusForInstallments = [...dateStatusForInstallments]
		if (name === 'projectId') {
			body = { projectId: formData[name] }
		}
		if (name === 'floorId') {
			body = { floorId: formData[name] }
		}
		if (name === 'unitId') {
			body = { unitId: formData[name] }
		}
		if (name === 'discount') {
			body = { discount: formData[name] ? formData[name] : null, remainingPayment: remainingPayment }
			newArrowCheck[name] = false
			this.formatStatusChange(name, true)
		}
		if (name === 'installmentDue') {
			body = { installmentDue: formData[name], remainingPayment: remainingPayment, }
		}
		if (name === 'possessionCharges') {
			body = {
				possession_charges: possessionCharges,
				unitId: formData['unitId'],
				remainingPayment: remainingPayment
			}
			this.formatStatusChange(name, true)
		}
		if (name === 'token' || name === 'discountPercentage' && formData['token'] != '') {
			body = {
				token: formData['token'] ? formData['token'] : null,
				tokenPaymentTime: tokenDate,
				remainingPayment: remainingPayment,
				unitDiscount: formData['discountPercentage'] ? formData['discountPercentage'] : null,
				discount_amount: discountAmount ? discountAmount : null,
				discounted_price: discountedPrice ? discountedPrice : null,
				unitStatus: 'Token',
				unitId: formData['unitId'],
			}
			this.currentDate(name)
			newArrowCheck[name] = false
			newtokenDateStatus['name'] = name
			newtokenDateStatus['status'] = true
			this.formatStatusChange(name, true)
		}
		if (name === 'downPayment') {

			body = {
				downPayment: formData[name] ? formData[name] : null,
				remainingPayment: remainingPayment,
				unitStatus: formData['installmentDue'] === 'quarterly' ? 'Sold on Installment Plan' : 'Sold on Monthly Installments',
				unitId: formData['unitId']
			}
			this.currentDate(name)
			newArrowCheck[name] = false
			newdownPaymentDateStatus['name'] = name
			newdownPaymentDateStatus['status'] = true
			this.formatStatusChange(name, true)
		}
		if (name === 'no_installments') {
			body = { no_of_installments: instalments, remainingPayment: remainingPayment }
		}
		if (name === 'payments') {
			body = { installments: paymentFiledsArray.length ? paymentFiledsArray : null, remainingPayment: remainingPayment, unitStatus: formData.unitStatus, unitId: unitDetailsData.id }
			newArrowCheck[name] = false
			newdateStatusForPayments[arrayName].name = arrayName
			newdateStatusForPayments[arrayName].status = true
			this.formatStatusChange(arrayName, true, name);
		}
		if (name === 'installments') {
			newdateStatusForInstallments[arrayName].name = arrayName
			newdateStatusForInstallments[arrayName].status = true
			this.formatStatusChange(arrayName, true, name);
			body = { installments: totalInstalments ? totalInstalments : null, remainingPayment: remainingPayment }
			newArrowCheck[name] = false
		}
		// console.log(body)
		axios.patch(`/api/leads/project?id=${lead.id}`, body)
			.then((res) => {
				if (name === 'installments') {
					axios.get(`/api/leads/project/byId?id=${lead.id}`)
						.then((resp) => {
							var newtotalInstallments = resp.data.cmInstallments
							this.setState({
								totalInstalments: newtotalInstallments
							})
						})
				}

				this.setState({
					arrowCheck: newArrowCheck,
					showStyling: '',
					tokenDateStatus: newtokenDateStatus,
					downPaymentDateStatus: newdownPaymentDateStatus,
					dateStatusForPayments: newdateStatusForPayments,
				})
			}).catch((error) => {
				console.log('Some thing went wrong!1!!', error)
			})
	}

	handleReasonChange = (value) => {
		this.setState({ selectedReason: value });
	}

	closeModal = () => {
		this.setState({ isVisible: false })
	}

	onHandleCloseLead = (reason) => {
		const { lead, navigation } = this.props
		const { selectedReason } = this.state;
		let body = {
			reasons: selectedReason
		}
		if (selectedReason && selectedReason !== '') {
			axios.patch(`/api/leads/project?id=${lead.id}`, body).then(res => {
				this.setState({ isVisible: false }, () => {
					helper.successToast(`Lead Closed`)
					navigation.navigate('Leads');
				});
			}).catch(error => {
				console.log(error);
			})
		}
	}

	closedLead = () => {
		const { lead, user } = this.props
		lead.status != StaticData.Constants.lead_closed_won ||
			lead.status != StaticData.Constants.lead_closed_lost && helper.leadClosedToast()
		lead.assigned_to_armsuser_id != user.id && helper.leadNotAssignedToast()
	}

	addFullpaymentFields = () => {
		const { lead } = this.props
		const { paymentFiledsArray, dateStatusForPayments, paymentFromat } = this.state
		let array = [...paymentFiledsArray]
		let newdateStatusForPayments = [...dateStatusForPayments]
		let newpaymentFromat = [...paymentFromat]

		array.push({ installmentAmount: '', type: 'payment', installmentDate: '' })
		newdateStatusForPayments.push({ name: '', status: false })
		newpaymentFromat.push({ name: '', status: false })

		this.setState({
			paymentFiledsArray: array,
			dateStatusForPayments: newdateStatusForPayments,
			paymentFromat: newpaymentFromat,
		})
	}

	openModal = () => {
		this.setState({
			modalVisible: !this.state.modalVisible
		})
	}

	cancelDeletePayments = (checkPaymentTypeValue) => {
		if (checkPaymentTypeValue == 'installments') {
			this.handleForm('full_payment', 'paymentType')
		}
		if (checkPaymentTypeValue == 'full_payment') {
			this.handleForm('installments', 'paymentType')
		}
		this.setState({
			modalVisible: !this.state.modalVisible
		})
	}

	deletePayments = (checkPaymentTypeValue) => {
		const { lead } = this.props

		if (checkPaymentTypeValue === 'installments') {
			this.handleForm('installments', 'paymentType'), () => {
				this.setState({
					modalVisible: false,
					paymentFiledsArray: [],
				}, () => {
					this.submitValues('installments');
					this.discountPayment()
				})
			}

		}
		if (checkPaymentTypeValue === 'full_payment') {
			this.handleForm('full_payment', 'paymentType'), () => {
				this.setState({
					modalVisible: false,
					totalInstalments: [],
					instalments: '',
				}, () => {
					this.submitValues('payments')
					this.discountPayment()
				})
			}

		}

		axios.delete(`/api/leads/project/installments?leadId=${lead.id}`)
			.then((res) => { })

	}

	goToComments = () => {
		const { navigation } = this.props;
		navigation.navigate('Comments', { cmLeadId: this.props.lead.id });
	}

	goToAttachments = () => {
		const { navigation } = this.props;
		navigation.navigate('Attachments', { cmLeadId: this.props.lead.id });
	}

	goToDiaryForm = () => {
		const { navigation, user } = this.props;
		navigation.navigate('AddDiary', {
			update: false,
			cmLeadId: this.props.lead.id,
			addedBy: 'self',
			tasksList: StaticData.taskValuesCMLead,
			agentId: user.id,
		});
	}

	navigateTo = () => {
		this.props.navigation.navigate('LeadDetail', { lead: this.props.lead, purposeTab: 'invest' })
	}

	showAndHideStyling = (name, clear, arrayName) => {
		const { tokenDateStatus, formData, tokenDate, downPaymentDateStatus, dateStatusForPayments, dateStatusForInstallments } = this.state
		let newtokenDateStatus = tokenDateStatus
		let newdownPaymentDateStatus = downPaymentDateStatus
		let newdateStatusForPayments = dateStatusForPayments
		let newdateStatusForInstallments = [...dateStatusForInstallments]

		if (clear === true) {
			this.clearTimes(name, clear, arrayName)
		} else {

			if (name === 'discount') {
				this.formatStatusChange(name, false);
			}

			if (name != 'discount' && tokenDate != '') {
				this.formatStatusChange('discount', true)
			}

			if (name === 'token') {
				newtokenDateStatus['name'] = ''
				newtokenDateStatus['status'] = false
				this.formatStatusChange(name, false);
			}

			if (name != 'token' && tokenDate != '') {
				newtokenDateStatus['name'] = 'token'
				newtokenDateStatus['status'] = true
				this.formatStatusChange('token', true)
			}

			if (name === 'downPayment') {
				newdownPaymentDateStatus['name'] = ''
				newdownPaymentDateStatus['status'] = false
				this.formatStatusChange(name, false);
			}

			if (name != 'downPayment' && tokenDate != '') {
				newdownPaymentDateStatus['name'] = 'downPayment'
				newdownPaymentDateStatus['status'] = true
				this.formatStatusChange('downPayment', true)
			}

			if (name === 'possessionCharges') {
				this.formatStatusChange('possessionCharges', false);
			}

			if (name != 'possessionCharges') {
				this.formatStatusChange('possessionCharges', true);
			}

			if (arrayName === 'payments') {
				newdateStatusForPayments[name].name = name
				newdateStatusForPayments[name].status = false
				this.formatStatusChange(name, false, arrayName);
				for (var i = 0; i < dateStatusForPayments.length; i++) {
					if (i != name) {
						newdateStatusForPayments[i].name = name
						newdateStatusForPayments[i].status = true
						this.formatStatusChange(i, true, 'payments');
					}
				}
			}

			if (arrayName != 'payments') {
				for (var i = 0; i < dateStatusForPayments.length; i++) {
					newdateStatusForPayments[i].name = name
					newdateStatusForPayments[i].status = true
					this.formatStatusChange(i, true, 'payments');
				}
			}

			if (arrayName === 'installments') {
				dateStatusForInstallments[name].name = name
				dateStatusForInstallments[name].status = false
				this.formatStatusChange(name, false, arrayName);
				for (var i = 0; i < dateStatusForInstallments.length; i++) {
					if (i != name) {
						dateStatusForInstallments[i].name = name
						dateStatusForInstallments[i].status = true
						this.formatStatusChange(i, true, 'installments');
					}
				}
			}

			if (arrayName != 'installments') {
				for (var i = 0; i < dateStatusForInstallments.length; i++) {
					dateStatusForInstallments[i].name = name
					dateStatusForInstallments[i].status = true
					this.formatStatusChange(i, true, 'installments');
				}
			}

			this.setState({
				showStyling: clear === false ? name : '',
				showDate: false,
				tokenDateStatus: newtokenDateStatus,
				downPaymentDateStatus: newdownPaymentDateStatus,
				dateStatusForPayments: newdateStatusForPayments,
			})
		}
	}

	clearTimes = (name, clear, arrayName) => {
		const { formData, tokenDate, downPaymentTime, dateStatusForPayments, paymentFiledsArray, totalInstalments, dateStatusForInstallments } = this.state
		let newtokenDate = tokenDate
		let newdownPaymentTime = downPaymentTime
		let newdateStatusForPayments = [...dateStatusForPayments]
		let newpaymentFiledsArray = paymentFiledsArray
		let newFormData = { ...formData }
		let newdateStatusForInstallments = [...dateStatusForInstallments]
		let newtotalInstalments = [...totalInstalments]
		if (name === 'discount') {
			this.formatStatusChange(name, false);
			this.apiCallForNewDetails(arrayName, name)
		}

		if (name === 'discountPercentage') {
			this.formatStatusChange(name, false);
			this.apiCallForNewDetails(arrayName, name)
		}

		if (name === 'token') {
			newtokenDate = ''
			this.formatStatusChange(name, false);
			this.apiCallForNewDetails(arrayName, name)
		}

		if (name === 'downPayment') {
			newdownPaymentTime = ''
			this.formatStatusChange(name, false);
			this.apiCallForNewDetails(arrayName, name)
		}

		if (arrayName === 'payments') {
			this.formatStatusChange(name, false, arrayName);
			this.apiCallForNewDetails(arrayName, name)
		}

		if (arrayName === 'installments') {
			this.formatStatusChange(name, false, arrayName);
			this.apiCallForNewDetails(arrayName, name)
		}

		this.setState({
			showStyling: clear === false ? name : '',
			tokenDate: newtokenDate,
			downPaymentTime: newdownPaymentTime,
			dateStatusForPayments: newdateStatusForPayments,
			dateStatusForInstallments: newdateStatusForInstallments,
			totalInstallments: newtotalInstalments,
			formData: newFormData,
		})
	}

	apiCallForNewDetails = (arrayName, name) => {
		const {
			tokenDateStatus,
			formData,
			downPaymentDateStatus,
			totalInstalments,
			paymentFiledsArray,
			dateStatusForPayments,
			dateStatusForInstallments,
			totalInstallments,
		} = this.state
		const { lead } = this.props
		var newFormData = { ...formData }
		axios.get(`/api/leads/project/byId?id=${lead.id}`)
			.then((res) => {
				this.setState({
					cancelNewData: res.data
				}, () => {
					var data = res.data
					let newdownPaymentDateStatus = downPaymentDateStatus
					let newtokenDateStatus = tokenDateStatus
					let newpaymentFiledsArray = paymentFiledsArray
					let newdateStatusForPayments = [...dateStatusForPayments]
					let newtotalInstalments = [...totalInstalments]
					let newdateStatusForInstallments = [...dateStatusForInstallments]

					if (name === 'discount') {
						newFormData[name] = data.discount != null ? data.discount : ''
						this.formatStatusChange(name, true)
						this.setState({
							formData: newFormData,
						}, () => {
							this.discountPayment(formData)
						})
					}

					if (name === 'discountPercentage') {
						if (data.unit != null) {
							newFormData[name] = data.unit.discount != null ? data.unit.discount : ''
							this.setState({
								formData: newFormData,
								discountAmount: data.unit.discount_amount != null ? data.unit.discount_amount : '',
								discountedPrice: data.unit.discounted_price != null ? data.unit.discounted_price : '',
							})
						}
					}

					if (name === 'token') {
						newFormData[name] = data.token != null ? data.token : ''
						this.formatStatusChange(name, true)
						newtokenDateStatus['name'] = name
						newtokenDateStatus['status'] = true
						this.setState({
							formData: newFormData,
							tokenDateStatus: newtokenDateStatus,
							tokenDate: data.tokenPaymentTime ? moment(data.tokenPaymentTime).format('hh:mm a') + ' ' + moment(data.tokenPaymentTime).format('MMM DD') : '',
						}, () => {
							this.discountPayment(formData)
						})
					}

					if (name === 'downPayment') {
						newFormData[name] = data.downPayment != null ? data.downPayment : ''
						this.formatStatusChange(name, true)
						newdownPaymentDateStatus['name'] = name
						newdownPaymentDateStatus['status'] = true
						this.setState({
							formData: newFormData,
							downPaymentDateStatus: newdownPaymentDateStatus,
							downPaymentTime: data.paymentTime ? moment(data.paymentTime).format('hh:mm a') + ' ' + moment(data.paymentTime).format('MMM DD') : '',
						}, () => {
							this.discountPayment(formData)
						})
					}

					if (arrayName === 'payments') {
						newpaymentFiledsArray[name].installmentAmount = data.payment && data.payment.length > name ? data.payment[name].installmentAmount : ''
						newpaymentFiledsArray[name].createdAt = data.payment && data.payment.length > name ? data.payment[name].createdAt : ''
						newdateStatusForPayments[name].name = name
						newdateStatusForPayments[name].status = true
						this.formatStatusChange(name, true, arrayName);
						this.setState({
							dateStatusForPayments: newdateStatusForPayments,
							paymentFiledsArray: newpaymentFiledsArray,
						})
					}

					if (arrayName === 'installments') {
						var installmentTime = data.cmInstallments && data.cmInstallments.length > name ? data.cmInstallments[name].createdAt : ''
						newtotalInstalments[name].installmentAmount = data.cmInstallments && data.cmInstallments.length > name ? data.cmInstallments[name].installmentAmount : ''
						newtotalInstalments[name].installmentAmountDate = moment(installmentTime).format('hh:mm a') + ' ' + moment(installmentTime).format('MMM DD')
						newdateStatusForInstallments[name].name = true
						newdateStatusForInstallments[name].status = true
						this.formatStatusChange(name, true, arrayName);
						this.setState({
							dateStatusForInstallments: newdateStatusForInstallments,
							totalInstalments: newtotalInstalments,
						})
					}


				})

			})
	}

	formatStatusChange = (name, status, arrayName) => {
		const { tokenDateStatus, formData, paymentFromat, installmentsFromat } = this.state
		let newpaymentFromat = [...paymentFromat]
		let newinstallmentsFromat = [...installmentsFromat]
		if (name === 'discount') {
			this.setState({ promotionDiscountFormat: status })
		}
		if (name === 'token') {
			this.setState({ tokenFormat: status })
		}
		if (name === 'downPayment') {
			this.setState({ downPaymentFormat: status })
		}
		if (name === 'possessionCharges') {
			this.setState({ possessionFormat: status })
		}
		if (arrayName === 'payments') {
			newpaymentFromat[name].name = name
			newpaymentFromat[name].status = status
			this.setState({ paymentFromat: newpaymentFromat })
		}
		if (arrayName === 'installments') {
			newinstallmentsFromat[name].name = name
			newinstallmentsFromat[name].status = status
			this.setState({ installmentsFromat: newinstallmentsFromat })
		}
	}

	openUnitDetailsModal = (status) => {
		this.setState({
			unitDetailModal: status,
		})
	}

	percentFormula = (total, percent) => {
		var result = total - ((percent / 100) * total)
		return parseInt(result);
	}

	render() {
		const {
			getProject,
			formData,
			getFloors,
			getUnit,
			totalInstalments,
			checkValidation,
			reasons,
			selectedReason,
			checkReasonValidation,
			isVisible,
			remainingPayment,
			readOnly,
			downPaymentTime,
			tokenDate,
			instalments,
			progressValue,
			arrowCheck,
			paymentDate,
			paymentFiledsArray,
			fullPaymentCount,
			modalVisible,
			checkPaymentTypeValue,
			closedLeadEdit,
			showStyling,
			promotionDiscountFormat,
			tokenFormat,
			tokenDateStatus,
			downPaymentDateStatus,
			downPaymentFormat,
			dateStatusForPayments,
			paymentFromat,
			checkForUnassignedLeadEdit,
			dateStatusForInstallments,
			installmentsFromat,
			unitDetailModal,
			unitDetailsData,
			discountAmount,
			discountedPrice,
			getAllProject,
			checkMonthlyOption,
			possessionCharges,
			possessionFormat,
			checkForUnitAvail,
		} = this.state
		let leadClosedCheck = closedLeadEdit === false || checkForUnassignedLeadEdit === false ? false : true
		return (
			<View>
				<ProgressBar style={{ backgroundColor: "ffffff" }} progress={progressValue} color={'#0277FD'} />
				<ScrollView>

					<View style={[AppStyles.container]}>
						<LeadRCMPaymentPopup
							reasons={reasons}
							selectedReason={selectedReason}
							changeReason={this.handleReasonChange}
							checkValidation={checkReasonValidation}
							isVisible={isVisible}
							closeModal={() => this.closeModal()}
							onPress={this.onHandleCloseLead}
							CMlead={true}
						/>
						<InnerForm
							getFloor={getFloors}
							getUnit={getUnit}
							getProject={getProject}
							getInstallments={StaticData.getInstallments}
							totalInstalments={totalInstalments}
							instalments={instalments}
							checkValidation={checkValidation}
							handleInstalments={this.handleInstalments}
							handleForm={this.handleForm}
							formSubmit={this.formSubmit}
							readOnly={readOnly}
							remainingPayment={remainingPayment}
							formData={formData}
							tokenDate={tokenDate}
							downPaymentTime={downPaymentTime}
							submitValues={this.submitValues}
							arrowCheck={arrowCheck}
							paymentOptions={StaticData.paymentOptions}
							paymentDate={paymentDate}
							fullPaymentCount={fullPaymentCount}
							addFullpaymentFields={this.addFullpaymentFields}
							paymentFiledsArray={paymentFiledsArray}
							handlePayments={this.handlePayments}
							closedLeadEdit={closedLeadEdit}
							closedLead={this.closedLead}
							goToDiaryForm={this.goToDiaryForm}
							goToAttachments={this.goToAttachments}
							goToComments={this.goToComments}
							navigateTo={this.navigateTo}
							//Component Props
							showAndHideStyling={this.showAndHideStyling}
							showStylingState={showStyling}
							promotionDiscountFormat={promotionDiscountFormat}
							tokenFormat={tokenFormat}
							tokenDateStatus={tokenDateStatus}
							downPaymentDateStatus={downPaymentDateStatus}
							downPaymentFormat={downPaymentFormat}
							dateStatusForPayments={dateStatusForPayments}
							paymentFromat={paymentFromat}
							dateStatusForInstallments={dateStatusForInstallments}
							installmentsFromat={installmentsFromat}
							checkForUnassignedLeadEdit={checkForUnassignedLeadEdit}
							possessionFormat={possessionFormat}
							//Unit Details Modal Props
							openUnitDetailsModal={this.openUnitDetailsModal}
							unitDetails={unitDetailsData}
							// New Fields Props
							discountAmount={discountAmount}
							discountedPrice={discountedPrice}
							checkMonthlyOption={checkMonthlyOption}
							possessionCharges={possessionCharges}
							checkForUnitAvail={checkForUnitAvail}
						/>
					</View>
				</ScrollView>
				<View style={AppStyles.mainCMBottomNav}>
					<CMBottomNav
						goToAttachments={this.goToAttachments}
						navigateTo={this.navigateTo}
						goToDiaryForm={this.goToDiaryForm}
						goToComments={this.goToComments}
						closedLeadEdit={leadClosedCheck}
						closeLead={this.formSubmit}
						alreadyClosedLead={this.closedLead}
						checkForUnassignedLeadEdit={checkForUnassignedLeadEdit}
					/>
				</View>
				<UnitDetailsModal
					active={unitDetailModal}
					openUnitDetailsModal={this.openUnitDetailsModal}
					data={unitDetailsData}
				/>
				{
					modalVisible &&
					<PaymentAlert
						active={modalVisible}
						openModal={this.openModal}
						deletePayments={this.deletePayments}
						cancelDeletePayments={this.cancelDeletePayments}
						checkPaymentTypeValue={checkPaymentTypeValue}
					/>
				}
			</View>
		)
	}
}


mapStateToProps = (store) => {
	return {
		user: store.user.user,
		lead: store.lead.lead
	}
}

export default connect(mapStateToProps)(Payments)


