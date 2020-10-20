import React, { Component } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import axios from 'axios'
import AppStyles from '../../AppStyles'
import { connect } from 'react-redux';
import FormScreenOne from './FormScreenOne';
import FormScreenSecond from './FormScreenSecond';
import StaticData from '../../StaticData';
import { ProgressBar } from 'react-native-paper';
import helper from '../../helper';
import { setlead } from '../../actions/lead';
import LeadRCMPaymentPopup from '../../components/LeadRCMPaymentModal/index'
import CMBottomNav from '../../components/CMBottomNav'
import UnitDetailsModal from '../../components/UnitDetailsModal'
import BookingDetailsModal from '../../components/BookingDetailsModal'
import AddPaymentModal from '../../components/AddPaymentModal'
import AddTokenModal from '../../components/AddTokenModal'
import FirstScreenConfirmModal from '../../components/FirstScreenConfirmModal'
import styles from './style';
import { setCMPaymennt } from '../../actions/addCMPayment';


class Payments extends Component {
	constructor(props) {
		super(props)
		const { lead, user } = this.props
		this.state = {
			progressValue: 0,
			getProject: [],
			getFloors: [],
			getAllFloors: [],
			getUnit: [],
			allUnits: [],
			formData: {
				projectId: lead.paidProject != null ? lead.paidProject.id : null,
				floorId: null,
				discount: null,
				discountedPrice: null,
				finalPrice: null,
				paymentPlan: null,
				unitId: lead.unit != null ? lead.unit.id : null,
				token: lead.token != null ? lead.token : null,
				type: '',
				details: '',
				pearl: null,
				cnic: lead.customer && lead.customer.cnic != null ? lead.customer.cnic : null,
				unitType: '',
				pearlName: 'New Pearl',
				paymentTypeForToken: 'Token',
			},
			cnicEditable: lead.customer && lead.customer.cnic != null ? false : true,
			secondFormData: { ...this.props.CMPayment },
			unitId: null,
			unitPrice: null,
			checkPaymentPlan: {
				years: lead.paidProject != null && lead.paidProject.installment_plan != null || '' ? lead.paidProject.installment_plan : null,
				monthly: lead.paidProject != null && lead.paidProject.monthly_installment_availablity === 'yes' ? true : false,
				rental: lead.paidProject != null && lead.paidProject.rent_available === 'yes' ? true : false,
				investment: true,
				quartarly: true,
			},
			specificUnitDetails: {},
			cnicValidate: false,
			leftSqft: null,
			secondFormLeadData: {},
			unitPearlDetailsData: {},
			paymentPlan: [],
			openFirstScreenModal: false,
			firstScreenValidate: false,
			firstScreenDone: lead.unit != null && lead.unit.bookingStatus != 'Available' ? false : true,
			secondScreenData: lead,
			addPaymentModalToggleState: false,
			secondCheckValidation: false,
			editaAble: false,
			paymentId: null,
			remainingPayment: lead.remainingPayment != null ? lead.remainingPayment : '',
			paymentOldValue: null,
			modalLoading: false,
			firstScreenConfirmLoading: false,
			addPaymentLoading: false,
			paymentPreviewLoading: false,
			tokenModalVisible: false,
			reasons: [],
			isVisible: false,
			selectedReason: '',
			checkLeadClosedOrNot: helper.checkAssignedSharedStatus(user, lead),
			remarks: null,
			editaAbleForTokenScreenOne: false,
			bookingDetailsModalActive: false,
		}
	}

	componentDidMount() {
		const { formData, remarks } = this.state
		const { navigation, lead } = this.props

		this.fetchLead()
		this.getAllProjects()
		this.setdefaultFields(this.props.lead)

		this._unsubscribe = navigation.addListener('focus', () => {
			this.reopenPaymentModal();
		})
		if (lead.paidProject && lead.paidProject != null) {
			this.getFloors(lead.paidProject.id)
		}
	}

	componentWillUnmount() {
		this.clearPaymentsValuesFromRedux()
	}

	reopenPaymentModal = () => {
		this.setState({
			addPaymentModalToggleState: this.props.CMPayment.visible
		})
	}

	clearPaymentsValuesFromRedux = (status) => {
		const newObject = {
			installmentAmount: null,
			type: '',
			cmLeadId: null,
			details: '',
			visible: status,
			attachments: [],
		}
		this.setState({ secondFormData: newObject }, () => {
			this.props.dispatch(setCMPaymennt(newObject))
		})
	}

	setdefaultFields = (lead) => {
		const { checkPaymentPlan } = this.state
		var newcheckPaymentPlan = { ...checkPaymentPlan }
		newcheckPaymentPlan['years'] = lead.paidProject != null && lead.paidProject.installment_plan != null || '' ? lead.paidProject.installment_plan : null
		newcheckPaymentPlan['monthly'] = lead.paidProject != null && lead.paidProject.monthly_installment_availablity === 'yes' ? true : false
		newcheckPaymentPlan['rental'] = lead.paidProject != null && lead.paidProject.rent_available === 'yes' ? true : false,
			this.setState({
				checkPaymentPlan: newcheckPaymentPlan,
			}, () => {
				this.setPaymentPlanArray(lead)
			})
	}

	fetchLead = () => {
		const { lead } = this.props
		const { cmProgressBar } = StaticData
		this.setState({ paymentPreviewLoading: true, })
		axios.get(`/api/leads/project/byId?id=${lead.id}`)
			.then((res) => {
				let responseData = res.data;
				if (!responseData.paidProject) {
					responseData.paidProject = responseData.project;
				}
				this.props.dispatch(setlead(responseData));
				this.setdefaultFields(responseData)
				this.setState({
					progressValue: cmProgressBar[res.data.status] || 0,
					paymentPreviewLoading: false,
					secondScreenData: res.data,
				})
			})
			.catch((error) => {
				console.log('/api/leads/project/byId?id - Error', error)
				this.setState({
					paymentPreviewLoading: false,
				})
			})
	}

	getAllProjects = () => {
		axios.get(`/api/project/all`)
			.then((res) => {
				let projectArray = [];
				res && res.data.items.map((item, index) => { return (projectArray.push({ value: item.id, name: item.name })) })
				this.setState({
					getProject: projectArray,
					getAllProject: res.data.items
				})
			}).catch((error) => {
				console.log('/api/project/all - Error', error)
			})
	}

	getFloors = (id) => {
		axios.get(`/api/project/floors?projectId=${id}`)
			.then((res) => {
				let Array = [];
				res && res.data.rows.map((item, index) => { return (Array.push({ value: item.id, name: item.name })) })
				this.setState({
					getFloors: Array,
					getAllFloors: res.data.rows,
				})
			}).catch((error) => {
				console.log('/api/project/floors?projectId - Error', error)
			})
	}

	getUnits = (projectId, floorId) => {
		const { lead } = this.props
		axios.get(`/api/project/shops?projectId=${projectId}&floorId=${floorId}&status=Available&type=regular`)
			.then((res) => {
				let array = [];
				res && res.data.rows.map((item, index) => { return (array.push({ value: item.id, name: item.name })) })
				this.setState({
					getUnit: array,
					allUnits: res.data.rows,
				})
			}).catch((error) => {
				console.log('/api/project/shops?projectId & floorId & status & type - Error', error)
			})
	}

	openUnitDetailsModal = (id, status) => {
		const { allUnits } = this.state
		let object = {};
		object = allUnits.find((item) => { return item.id == id && item })
		this.setState({
			unitDetailModal: status,
			unitDetailsData: object,
		})
	}

	openPearlDetailsModal = (status) => {
		const { formData, getAllFloors } = this.state
		let object = {};
		object = getAllFloors.find((item) => { return item.id == formData.floorId && item })
		this.setState({
			unitDetailModal: status,
			unitPearlDetailsData: object,
		})
	}

	setUnitPrice = (id) => {
		const { allUnits, formData, specificUnitDetails } = this.state
		let object = {};
		var newFormdata = { ...formData }
		object = allUnits.find((item) => { return item.id == id && item })
		this.setState({
			unitPrice: object.unit_price,
			remainingPayment: object.unit_price,
			specificUnitDetails: object,
		}, () => {
			if (object && object.discount != null && object.discount > 0) {
				this.handleForm(object.discount, 'discount')
			} else {
				this.handleForm(0, 'discount')
			}
		})
	}

	setPaymentPlanArray = (lead) => {
		const { paymentPlan, checkPaymentPlan } = this.state
		const array = [];

		if (checkPaymentPlan.investment === true && lead.paidProject != null && lead.paidProject != null) {
			array.push({ value: 'Sold on Investment Plan', name: `Investment Plan ${lead.paidProject.full_payment_discount > 0 ? `(Full Payment Disc: ${lead.paidProject.full_payment_discount}%)` : ''}` })
		}
		if (checkPaymentPlan.rental === true && lead.paidProject != null && lead.paidProject != null) {
			array.push({ value: 'Sold on Rental Plan', name: `Rental Plan` })
		}
		if (checkPaymentPlan.years != null) {
			array.push({ value: 'Sold on Installments Plan', name: checkPaymentPlan.years + ' Years Quarterly Installments' })
		}
		if (checkPaymentPlan.monthly === true) {
			array.push({ value: 'Sold on Monthly Installments Plan', name: checkPaymentPlan.years + ' Years Monthly Installments' })
		}

		this.setState({
			paymentPlan: array,
		})
	}

	validateCnic = (value) => {
		if (value.length < 15 || value === '') {
			this.setState({ cnicValidate: true })
		} else { this.setState({ cnicValidate: false }) }
	}

	handleForm = (value, name) => {
		const { formData, unitPrice, getAllFloors } = this.state
		const newFormData = { ...formData }
		if (name === 'cnic') {
			value = helper.normalizeCnic(value)
			this.validateCnic(value)
		}
		// Set Values In form Data
		newFormData[name] = value
		// Get Floor base on Project Id
		if (name === 'projectId') {
			this.changeProject(value)
			this.getFloors(value)
		}
		// Get Floor base on Floor ID & Project Id
		if (name === 'floorId') {
			this.getUnits(formData.projectId, value)
		}
		//Set Selected Unit Details
		if (name === 'unitId') {
			this.setUnitPrice(value)
		}
		// Check Payment Token Type
		if (name === 'paymentTypeForToken' && value == 'Payment') {
			Alert.alert(
				'Alert',
				'Are you sure you want to book without Token?',
				[
					{
						text: 'Cancel',
						onPress: () => { this.handleForm('Token', 'paymentTypeForToken') },
						style: 'cancel'
					},
					{ text: 'Yes' }
				],
				{ cancelable: false }
			);
		}
		this.setState({
			formData: newFormData,
		}, () => {
			//Set Discount Price
			if (name === 'discount' || name === 'paymentPlan') {
				this.allCalculations(newFormData, name)
			}
			// Set Discount for Token
			if (name === 'token') {
				this.allCalculations(newFormData, 'token')
			}
			// when Project id chnage the unit filed will be refresh
			if (name === 'projectId' && formData.projectId != null) {
				this.refreshUnitPrice(name)
			}
			// when floor id chnage the unit filed will be refresh
			if (name === 'floorId' && newFormData.floorId != null) {
				let object = {};
				object = getAllFloors.find((item) => { return item.id == value && item })
				var totalPrice = newFormData.pearl * object && object.pricePerSqFt

				this.setState({ unitPrice: totalPrice, unitPearlDetailsData: object }, () => {
					this.refreshUnitPrice(name)
				})
			}
			// when floor id chnage the unit filed will be refresh
			if (name === 'unitId' && formData.unitId != null) {
				this.refreshUnitPrice(name)
			}
			//Checks for PEARl values
			if (name === 'unitType') {
				this.refreshUnitPrice(name)
			}
			if (name === 'pearl') {
				this.setState({ leftSqft: null })
				let object = {};
				object = getAllFloors.find((item) => { return item.id == formData.floorId && item })
				var totalSqft = object.pearlArea
				var minusSqft = value
				var leftSqft = totalSqft - minusSqft
				if (leftSqft < 50) {
					this.setState({ leftSqft: leftSqft })
				}
				var totalPrice = newFormData.pearl * object.pricePerSqFt
				this.setState({ unitPrice: totalPrice, unitPearlDetailsData: object })
			}
		})
	}

	changeProject = (id) => {
		const { lead } = this.props
		var body = {
			paymentProject: id
		}
		var leadId = []
		leadId.push(lead.id)
		axios.patch(`/api/leads/project`, body, { params: { id: leadId } })
			.then((res) => {
				this.fetchLead()
			})
	}

	allCalculations = (data, name) => {
		const { formData, unitPrice } = this.state
		const { lead } = this.props
		const newFormData = { ...formData }
		var totalPrice = unitPrice
		var frontDiscount = data.discount
		var backendDiscount = lead.paidProject != null && lead.paidProject.full_payment_discount
		var grandTotal = ''
		var oldGrandTotal = ''
		var totalToken = ''

		if (formData.paymentPlan === 'Sold on Investment Plan') {
			oldGrandTotal = (Number(totalPrice)) * (1 - Number((backendDiscount / 100)));
			grandTotal = (Number(totalPrice)) * (1 - Number((frontDiscount / 100))) * (1 - Number((backendDiscount / 100)))
		}
		else {
			oldGrandTotal = Number(totalPrice);
			grandTotal = (Number(totalPrice)) * (1 - Number((frontDiscount / 100))) * (1 - Number((0 / 100)))
		}

		if (name === 'discount') {
			var formula = (oldGrandTotal / 100) * frontDiscount
			newFormData['discount'] = frontDiscount
			newFormData['discountedPrice'] = formula
		}

		newFormData['finalPrice'] = parseInt(grandTotal, 10)

		if (name === 'token') {
			totalToken = Number(grandTotal) - Number(formData.token)
			this.setState({
				remainingPayment: totalToken,
			})
		} else {
			this.setState({
				formData: newFormData,
				remainingPayment: Number(grandTotal) - Number(formData.token),
			})
		}
	}

	refreshUnitPrice = (name) => {
		const { formData } = this.state
		var newFormData = { ...formData }
		if (name === 'projectId') {
			newFormData['floorId'] = 'no'
			newFormData['unitId'] = 'no'
			newFormData['discount'] = null
			newFormData['finalPrice'] = null
			newFormData['discountedPrice'] = null
			this.setState({ unitPrice: null, })
		}

		if (name === 'floorId') {
			newFormData['unitId'] = 'no'
			newFormData['discount'] = null
			newFormData['finalPrice'] = null
			newFormData['discountedPrice'] = null
			newFormData['paymentPlan'] = 'no'
			newFormData['unitType'] = 'no'
			newFormData['pearl'] = null
			this.setState({ unitPrice: null, })
		}

		if (name === 'unitId') {
			newFormData['discount'] = null
			newFormData['finalPrice'] = null
			newFormData['discountedPrice'] = null
		}

		if (name === 'unitType') {
			newFormData['unitId'] = 'no'
			newFormData['discount'] = null
			newFormData['finalPrice'] = null
			newFormData['discountedPrice'] = null
			newFormData['paymentPlan'] = 'no'
			newFormData['pearl'] = null
			this.setState({ unitPrice: null, })
		}

		this.setState({
			formData: newFormData,
		})
	}

	percentFormula = (total, percent) => {
		var result = (total / 100) * percent
		return parseInt(result);
	}

	currencyConvert = (x) => {
		x = x.toString();
		var lastThree = x.substring(x.length - 3);
		var otherNumbers = x.substring(0, x.length - 3);
		if (otherNumbers != '')
			lastThree = ',' + lastThree;
		var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
		return res;
	}

	toggleBookingDetailsModal = (status) => {
		this.setState({
			bookingDetailsModalActive: status,
		})
	}

	submitFirstScreen = () => {
		const { lead } = this.props
		const { formData, unitPrice, unitPearlDetailsData, unitType } = this.state

		this.setState({
			firstScreenConfirmLoading: true,
		})

		var downPayment = lead.paidProject != null ? lead.paidProject.down_payment : 0
		var totalDownPayment = (downPayment / 100) * unitPrice

		var fullPaymentDiscount = lead.paidProject != null ? lead.paidProject.full_payment_discount : 0
		var totalFullpaymentDiscount = (1 - fullPaymentDiscount / 100) * unitPrice

		var possessionCharges = lead.paidProject != null ? lead.paidProject.possession_charges : 0
		var totalpossessionCharges = (possessionCharges / 100) * unitPrice

		var installmentAmount = unitPrice - totalDownPayment - totalpossessionCharges

		var installmentPlan = lead.paidProject != null ? lead.paidProject.installment_plan : 1

		var numberOfQuarterlyInstallments = installmentPlan * 4
		var quarterlyInstallmentsAmount = installmentAmount / numberOfQuarterlyInstallments

		var numberOfMonthlyInstallments = installmentPlan * 12
		var monthlyInstallmentsAmount = installmentAmount / numberOfMonthlyInstallments

		var totalRent = unitPearlDetailsData.rentPerSqFt * formData.pearl

		var pearlBody = {
			area: formData.pearl,
			area_unit: 'sqft',
			bookingStatus: "Available",
			category_charges: 0,
			unit_price: unitPrice,
			discount: 0,
			discount_amount: 0,
			discounted_price: unitPrice,
			down_payment: totalDownPayment,
			floorId: formData.floorId,
			full_payment_price: totalFullpaymentDiscount,
			possession_charges: totalpossessionCharges,
			installment_amount: installmentAmount,
			quarterly_installments: quarterlyInstallmentsAmount,
			monthly_installments: monthlyInstallmentsAmount,
			name: "Shop # 4892",
			optional_fields: "{}",
			pricePerSqFt: unitPearlDetailsData.pricePerSqFt,
			projectId: formData.projectId,
			rate_per_sqft: unitPearlDetailsData.pricePerSqFt,
			remarks: "",
			rent: totalRent,
			rentPerSqFt: unitPearlDetailsData.rentPerSqFt,
			reservation: unitPearlDetailsData.project.reservation_charges,
			type: "pearl",
			userId: this.props.user.id,
			name: 'name',
		}

		if (formData.unitType === 'pearl') {
			axios.post(`/api/project/shop/create`, pearlBody)
				.then((res) => {
					unitId = res.data.id
					this.firstScreenApiCall(res.data.id)
				}).catch((error) => {
					console.log('/api/project/shop/create - Error', error)
					helper.errorToast('Something went wrong!!')
					this.setState({
						firstScreenConfirmLoading: false,
					})
				})
		} else {
			var unitId = formData.unitId === null || formData.unitId === '' || formData.unitId === 'no' ? null : formData.unitId
			this.firstScreenApiCall(unitId)
		}

	}

	firstScreenApiCall = (unitId) => {
		const { lead } = this.props
		const { formData, remainingPayment } = this.state

		var body = {
			unitId: unitId,
			projectId: formData.projectId,
			floorId: formData.floorId,
			unitDiscount: formData.discount === null || formData.discount === '' ? null : formData.discount,
			discounted_price: formData.discountedPrice === null || formData.discountedPrice === '' ? null : formData.discountedPrice,
			discount_amount: formData.finalPrice === null || formData.finalPrice === '' ? null : formData.finalPrice,
			unitStatus: formData.paymentTypeForToken === 'Token' ? formData.paymentTypeForToken : formData.paymentPlan,
			installmentDue: formData.paymentPlan,
			finalPrice: formData.finalPrice === null || formData.finalPrice === '' ? null : formData.finalPrice,
			remainingPayment: remainingPayment,
			installmentAmount: formData.token,
			type: formData.type,
			pearl: formData.pearl === null || formData.pearl === '' ? null : formData.pearl,
		}

		var leadId = []
		leadId.push(lead.id)
		axios.patch(`/api/leads/project`, body, { params: { id: leadId } })
			.then((res) => {
				axios.get(`/api/leads/project/byId?id=${lead.id}`)
					.then((res) => {
						let responseData = res.data;
						if (!responseData.paidProject) {
							responseData.paidProject = responseData.project;
						}
						this.props.dispatch(setlead(responseData));
						this.setState({
							secondScreenData: res.data,
							openFirstScreenModal: false,
							firstScreenDone: false,
							firstScreenConfirmLoading: false,
						}, () => {
							helper.successToast('Unit Has Been Booked')
						})
					}).catch(() => {
						console.log('/api/leads/project/byId?id - Error', error)
						helper.errorToast('Something went wrong!!!')
						this.setState({
							firstScreenConfirmLoading: false,
						})
					})
			}).catch((error) => {
				console.log('/api/leads/project - Error', error)
				helper.errorToast('Something went wrong!!')
				this.setState({
					firstScreenConfirmLoading: false,
				})
			})
	}

	firstScreenConfirmModal = (status) => {
		const { formData, cnicValidate, leftSqft, unitPearlDetailsData } = this.state

		if (formData.pearl != null) {
			if (
				formData.pearl <= unitPearlDetailsData.pearlArea &&
				formData.pearl >= 50 &&
				formData.cnic != null &&
				formData.cnic != '' &&
				cnicValidate === false &&
				formData.paymentPlan != null &&
				formData.paymentPlan != '' &&
				formData.paymentPlan != 'no'
			) {
				if (leftSqft < 50 && leftSqft > 0) {
					this.setState({
						firstScreenValidate: true,
					})

				} else {
					this.setState({
						openFirstScreenModal: status,
					})

				}
			} else {
				this.setState({
					firstScreenValidate: true,
				})

			}
		} else {
			if (
				formData.projectId != null &&
				formData.floorId != null &&
				formData.unitId != null &&
				formData.paymentPlan != null &&
				formData.paymentPlan != '' &&
				formData.token != null &&
				formData.token != '' &&
				formData.type != '' &&
				formData.cnic != null &&
				formData.cnic != '' &&
				cnicValidate === false
			) {
				this.setState({
					openFirstScreenModal: status,
				})
			} else {
				this.setState({
					firstScreenValidate: true,
				})
			}
		}

	}

	addPaymentModalToggle = (status) => {
		if (status === true) {
			this.clearPaymentsValuesFromRedux(status)
			this.setState({
				addPaymentModalToggleState: status,
				secondCheckValidation: false,
				secondFormLeadData: {},
				editaAble: false,
			})
		} else if (status === false) {
			this.clearPaymentsValuesFromRedux(status)
			this.setState({
				addPaymentModalToggleState: status,
				remarks: null,
				editaAble: false,
			})
		}

	}

	secondHandleForm = (value, name) => {
		const { secondFormData, attachmentData, addPaymentModalToggleState } = this.state
		const newSecondFormData = { ...secondFormData, ...attachmentData, visible: addPaymentModalToggleState }
		newSecondFormData[name] = value
		this.props.dispatch(setCMPaymennt(newSecondFormData))
		this.setState({
			secondFormData: newSecondFormData,
		})
	}

	// ====================== Function for submit second Screen *******
	secondFormSubmit = () => {
		const {
			secondFormData,
			editaAble,
			paymentId,
			remainingPayment,
			paymentOldValue,
		} = this.state

		const { CMPayment } = this.props


		if (secondFormData.installmentAmount != null && secondFormData.installmentAmount != '' && secondFormData.type != '') {
			this.setState({
				addPaymentLoading: true,
			})

			if (editaAble === false) {

				var body = {
					...secondFormData,
					cmLeadId: this.props.lead.id,
					remainingPayment: remainingPayment - secondFormData.installmentAmount,
					unitStatus: this.props.lead.installmentDue,
					unitId: this.props.lead.unitId,
				}
				// ====================== API call for added Payments
				axios.post(`/api/leads/project/payments`, body)
					.then((res) => {
						// ====================== If have attachments then this check will b execute
						this.submitAttachment(res.data.id, false, remainingPayment - secondFormData.installmentAmount)
					}).catch(() => {
						console.log('/api/leads/project/payments - Error', error)
						helper.errorToast('Payment Not Added')
						this.setState({
							addPaymentLoading: false,
						})
					})
			} else {
				var total = ''
				if (paymentOldValue > secondFormData.installmentAmount) {
					total = paymentOldValue - secondFormData.installmentAmount
					total = remainingPayment + total
				} else if (paymentOldValue != secondFormData.installmentAmount) {
					total = secondFormData.installmentAmount - paymentOldValue
					total = remainingPayment - total
				} else {
					total = remainingPayment
				}
				var body = {
					...secondFormData,
					remainingPayment: total,
					cmLeadId: this.props.lead.id,
				}

				axios.patch(`/api/leads/project/payment?id=${paymentId}`, body)
					.then((res) => {
						// ====================== If have attachments then this check will b execute
						this.submitAttachment(paymentId, true, total)
					}).catch((error) => {
						console.log('/api/leads/project/payments?id - Error', error)
						helper.errorToast('Payment Not Added')
						this.setState({
							addPaymentLoading: false,
						})
					})
			}
		} else {
			this.setState({
				secondCheckValidation: true,
			})
		}
	}

	submitAttachment = (paymentId, checkForEdit, totalRemaining) => {

		const {
			secondFormData,
			remainingPayment,
		} = this.state

		const { CMPayment } = this.props

		var message = checkForEdit === true ? 'Payment Updated' : 'Payment details have been sent to Accounts for verification and clearance'

		// ====================== If have attachments then this check will b execute
		if (CMPayment.attachments && CMPayment.attachments.length > 0) {

			// ====================== Using map for Uploading Attachments
			CMPayment.attachments.map((item, index) => {

				// ====================== attachment payload requirments
				let attachment = {
					name: item.fileName,
					type: 'file/' + item.fileName.split('.').pop(),
					uri: item.uri,
				}
				let fd = new FormData()
				fd.append('file', attachment)
				fd.append('title', item.title);
				fd.append('type', 'file/' + item.fileName.split('.').pop())



				if (item && !item.id) {
					// ====================== API call for Attachments base on Payment ID
					axios.post(`/api/leads/paymentAttachment?id=${paymentId}`, fd)
						.then((res) => {

							this.setState({
								addPaymentModalToggleState: false,
								remainingPayment: remainingPayment - secondFormData.installmentAmount,
								addPaymentLoading: false,
							}, () => {
								this.fetchLead();
								helper.successToast(message)
								this.clearPaymentsValuesFromRedux(false);
							})
						}).catch((error) => {
							console.log('/api/leads/paymentAttachment?id - Error', error)
							helper.errorToast('Attachment Not Added')
							his.setState({
								addPaymentModalToggleState: false,
								addPaymentLoading: false,
							})
						})
				} else {

					this.setState({
						addPaymentModalToggleState: false,
						remainingPayment: remainingPayment - secondFormData.installmentAmount,
						addPaymentLoading: false,
					}, () => {
						this.fetchLead();
						helper.successToast(message)
						this.clearPaymentsValuesFromRedux(false);
					})
				}

			})

		} else {
			this.setState({
				addPaymentModalToggleState: false,
				remainingPayment: totalRemaining,
				secondFormData: {
					installmentAmount: null,
					type: '',
					details: '',
					cmLeadId: this.props.lead.id,
				},

				addPaymentLoading: false,
			}, () => {
				this.fetchLead();
				this.clearPaymentsValuesFromRedux(false);
				helper.successToast(message)
			})
		}
	}

	editTileForscreenOne = () => {
		const { formData } = this.state
		var newformData = { ...formData }
		newformData['token'] = formData.token
		newformData['type'] = formData.type
		newformData['details'] = formData.details
		this.setState({
			formData: newformData,
			tokenModalVisible: true,
			editaAbleForTokenScreenOne: true,
		})
	}

	editTile = (id) => {
		this.setState({ addPaymentModalToggleState: true, modalLoading: true })
		axios.get(`/api/leads/project/byId?id=${this.props.lead.id}`)
			.then((res) => {

				let editLeadData = [];
				editLeadData = res && res.data.payment.find((item, index) => { return item.id === id ? item : null })
				var setValuesForRedux = {
					attachments: [...editLeadData.paymentAttachments],
					cmLeadId: this.props.lead.id,
					details: editLeadData.details,
					installmentAmount: null,
					type: editLeadData.type,
					visible: true,
				}

				this.props.dispatch(setCMPaymennt(setValuesForRedux))

				this.setState({
					secondFormData: {
						installmentAmount: editLeadData.installmentAmount,
						type: editLeadData.type,
						cmLeadId: this.props.lead.id,
						details: editLeadData.details,
						remarks: editLeadData.remarks
					},
					addPaymentModalToggleState: true,
					editaAble: true,
					paymentId: id,
					paymentOldValue: editLeadData.installmentAmount,
					modalLoading: false,
					remarks: editLeadData.remarks,
					secondFormLeadData: editLeadData,
				})
			}).catch((error) => {
				console.log('/api/leads/project/byId?id= - Error', error)
				helper.errorToast('No edit data found!!')
				this.setState({
					editaAble: false,
					modalLoading: false,
				})
			})
	}

	goToComments = () => {
		const { navigation, route } = this.props;
		navigation.navigate('Comments', { cmLeadId: this.props.lead.id });
	}

	goToAttachments = () => {
		const { navigation, route } = this.props;
		navigation.navigate('Attachments', { cmLeadId: this.props.lead.id });
	}

	goToPayAttachments = () => {
		const { navigation } = this.props;
		this.setState({
			addPaymentModalToggleState: false,
		})
		navigation.navigate('AttachmentsForPayments');
	}

	goToDiaryForm = (taskType) => {
		const { navigation, route, user } = this.props;
		navigation.navigate('AddDiary', {
			update: false,
			agentId: user.id,
			cmLeadId: this.props.lead.id,
			addedBy: 'self',
			tasksList: StaticData.taskValuesCMLead,
			taskType: taskType != '' ? taskType : null
		});
	}

	navigateTo = () => {
		this.props.navigation.navigate('LeadDetail', { lead: this.props.lead, purposeTab: 'invest' })
	}

	tokenModalToggle = (status) => {
		const { formData } = this.state
		if (formData.token != '') {
			this.setState({ tokenModalVisible: status })
		}
		this.setState({
			tokenModalVisible: status,
		})
	}

	onHandleCloseLead = (reason) => {
		const { lead, navigation } = this.props
		const { selectedReason } = this.state;
		let body = {
			reasons: selectedReason
		}
		var leadId = []
		leadId.push(lead.id)
		if (selectedReason && selectedReason !== '') {
			axios.patch(`/api/leads/project`, body, { params: { id: leadId } })
				.then(res => {
					this.setState({ isVisible: false }, () => {
						helper.successToast(`Lead Closed`)
						navigation.navigate('Leads');
					});
				}).catch(error => {
					console.log('/api/leads/project - Error', error);
					helper.errorToast('Closed lead API failed!!')
				})
		}
		else {
			('Please select a reason for lead closure!')
		}
	}

	handleReasonChange = (value) => {
		this.setState({ selectedReason: value });
	}

	closeModal = () => {
		this.setState({ isVisible: false })
	}

	formSubmit = () => {
		const { lead } = this.props
		const { formData, remainingPayment, secondScreenData } = this.state
		if (secondScreenData && secondScreenData != '') {

			// Check For Any pending and rejected Status
			var approvedPaymentDone = []
			secondScreenData && secondScreenData.payment != null &&
				secondScreenData.payment.filter((item, index) => {
					return item.status === 'pending' || item.status === 'rejected' ?
						approvedPaymentDone.push(true) : approvedPaymentDone.push(false)
				})

			// If there is any true in the bottom array PAYMENT DONE option will be hide
			var checkForPenddingNrjected = []
			approvedPaymentDone && approvedPaymentDone.length > 0 &&
				approvedPaymentDone.filter((item) => { item === true && checkForPenddingNrjected.push(true) })


			var leadId = []
			leadId.push(lead.id)
			// Check for Payment Done option 
			if (Number(remainingPayment) <= 0 && formData.unitId != null && formData.unitId != 'no' && checkForPenddingNrjected.length === 0) {
				this.setState({ reasons: StaticData.paymentPopupDone, isVisible: true, checkReasonValidation: '' })
			} else {
				this.setState({ reasons: StaticData.paymentPopup, isVisible: true, checkReasonValidation: '' })
			}
		}
	}

	closedLead = () => {
		const { lead, user } = this.props
		this.state.checkLeadClosedOrNot === true && helper.leadClosedToast()
		lead.assigned_to_armsuser_id != user.id && helper.leadNotAssignedToast()
	}

	render() {
		const {
			progressValue,
			getAllProject,
			getProject,
			getFloors,
			getUnit,
			allUnits,
			unitDetailModal,
			unitDetailsData,
			formData,
			paymentPlan,
			unitPrice,
			openFirstScreenModal,
			getAllFloors,
			firstScreenValidate,
			unitId,
			firstScreenDone,
			secondScreenData,
			addPaymentModalToggleState,
			secondFormData,
			secondCheckValidation,
			remainingPayment,
			modalLoading,
			firstScreenConfirmLoading,
			addPaymentLoading,
			paymentPreviewLoading,
			tokenModalVisible,
			reasons,
			selectedReason,
			unitPearlDetailsData,
			isVisible,
			checkLeadClosedOrNot,
			remarks,
			secondFormLeadData,
			cnicValidate,
			cnicEditable,
			leftSqft,
			bookingDetailsModalActive,
		} = this.state
		return (
			<View>
				<ProgressBar style={{ backgroundColor: "ffffff" }} progress={progressValue} color={'#0277FD'} />
				<View style={styles.mainParent}>
					{firstScreenDone === true ?
						<ScrollView>
							<View style={styles.fullHeight}>
								<FormScreenOne
									getProject={getProject}
									getFloors={getFloors}
									getUnit={getUnit}
									unitPrice={unitPrice}
									unitId={unitId}
									formData={formData}
									paymentPlan={paymentPlan}
									firstScreenValidate={firstScreenValidate}
									remainingPayment={remainingPayment}
									checkLeadClosedOrNot={checkLeadClosedOrNot}
									cnicValidate={cnicValidate}
									leftSqft={leftSqft}
									cnicEditable={cnicEditable}
									unitPearlDetailsData={unitPearlDetailsData}
									currencyConvert={this.currencyConvert}
									handleForm={this.handleForm}
									submitFirstScreen={this.submitFirstScreen}
									openUnitDetailsModal={this.openUnitDetailsModal}
									openPearlDetailsModal={this.openPearlDetailsModal}
									firstScreenConfirmModal={this.firstScreenConfirmModal}
									tokenModalToggle={this.tokenModalToggle}
									editTileForscreenOne={this.editTileForscreenOne}
								/>
							</View>
						</ScrollView>
						: null}

					{firstScreenDone === false ?
						<ScrollView>
							<View style={styles.secondContainer}>
								<FormScreenSecond
									data={secondScreenData}
									paymentPreviewLoading={paymentPreviewLoading}
									remainingPayment={remainingPayment}
									checkLeadClosedOrNot={checkLeadClosedOrNot}
									onlyReadFormData={formData}
									toggleBookingDetailsModal={this.toggleBookingDetailsModal}
									addPaymentModalToggle={this.addPaymentModalToggle}
									currencyConvert={this.currencyConvert}
									editTile={this.editTile}
								/>
							</View>
						</ScrollView>
						: null}

					{unitDetailsData && formData.pearl == null &&
						<UnitDetailsModal
							active={unitDetailModal}
							data={unitDetailsData}
							formData={formData}
							pearlModal={false}
							openUnitDetailsModal={this.openUnitDetailsModal}
						/>}
					{unitPearlDetailsData && formData.pearl &&
						<UnitDetailsModal
							active={unitDetailModal}
							data={unitPearlDetailsData}
							formData={formData}
							unitPrice={unitPrice}
							openUnitDetailsModal={this.openPearlDetailsModal}
							pearlModal={true}
						/>}
					{secondScreenData &&
						<BookingDetailsModal
							active={bookingDetailsModalActive}
							data={secondScreenData}
							formData={formData}
							pearlModal={false}
							toggleBookingDetailsModal={this.toggleBookingDetailsModal}
							openUnitDetailsModal={this.openUnitDetailsModal}
						/>}
					{getAllFloors != '' && getAllProject != '' &&
						<FirstScreenConfirmModal
							active={openFirstScreenModal}
							data={formData}
							getAllProject={getAllProject}
							getAllFloors={getAllFloors}
							allUnits={allUnits}
							firstScreenConfirmLoading={firstScreenConfirmLoading}
							firstScreenConfirmModal={this.firstScreenConfirmModal}
							submitFirstScreen={this.submitFirstScreen}
						/>}
					<AddPaymentModal
						active={addPaymentModalToggleState}
						secondFormData={secondFormData}
						secondCheckValidation={secondCheckValidation}
						modalLoading={modalLoading}
						addPaymentLoading={addPaymentLoading}
						remarks={remarks}
						secondFormLeadData={secondFormLeadData}
						addPaymentModalToggle={this.addPaymentModalToggle}
						secondHandleForm={this.secondHandleForm}
						secondFormSubmit={this.secondFormSubmit}
						goToPayAttachments={this.goToPayAttachments}
					/>
					<AddTokenModal
						active={tokenModalVisible}
						formData={formData}
						firstScreenValidate={firstScreenValidate}
						handleForm={this.handleForm}
						tokenModalToggle={this.tokenModalToggle}
					/>
				</View>
				<LeadRCMPaymentPopup
					reasons={reasons}
					selectedReason={selectedReason}
					isVisible={isVisible}
					CMlead={true}
					closeModal={() => this.closeModal()}
					changeReason={this.handleReasonChange}
					onPress={this.onHandleCloseLead}
				/>
				<View style={AppStyles.mainCMBottomNav}>
					<CMBottomNav
						goToAttachments={this.goToAttachments}
						navigateTo={this.navigateTo}
						goToDiaryForm={this.goToDiaryForm}
						goToComments={this.goToComments}
						closedLeadEdit={checkLeadClosedOrNot}
						alreadyClosedLead={this.closedLead}
						closeLead={this.formSubmit}
					/>
				</View>
			</View>
		)
	}
}

mapStateToProps = (store) => {
	return {
		user: store.user.user,
		lead: store.lead.lead,
		CMPayment: store.CMPayment.CMPayment,
	}
}

export default connect(mapStateToProps)(Payments)