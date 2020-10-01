import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
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
import AddPaymentModal from '../../components/AddPaymentModal'
import AddTokenModal from '../../components/AddTokenModal'
import FirstScreenConfirmModal from '../../components/FirstScreenConfirmModal'
import styles from './style';
import AddAttachmentPopup from '../../components/AddAttachmentPopup'
import * as DocumentPicker from 'expo-document-picker';
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
				cnic: lead.customer && lead.customer.cnic != null ? lead.customer.cnic : null,
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
			cnicValidate: false,
			secondFormLeadData: {},
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
		}
	}

	componentDidMount() {
		const { formData, remarks } = this.state
		const { navigation } = this.props

		this.fetchLead()
		this.getAllProjects()
		this.setdefaultFields(this.props.lead)
		this.handleForm(formData.projectId, 'projectId')
		this._unsubscribe = navigation.addListener('focus', () => {
			this.reopenPaymentModal();
		})
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
				console.log(error)
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
				console.log('project')
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
			})
	}

	getUnits = (projectId, floorId) => {
		const { lead } = this.props
		axios.get(`/api/project/shops?projectId=${projectId}&floorId=${floorId}&status=Available`)
			.then((res) => {
				let array = [];
				res && res.data.rows.map((item, index) => { return (array.push({ value: item.id, name: item.name })) })
				this.setState({
					getUnit: array,
					allUnits: res.data.rows,
				})
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

	setUnitPrice = (id) => {
		const { allUnits, formData } = this.state
		let object = {};
		var newFormdata = { ...formData }
		object = allUnits.find((item) => { return item.id == id && item })
		this.setState({
			unitPrice: object.unit_price,
			remainingPayment: object.unit_price,
		})
	}

	setPaymentPlanArray = (lead) => {
		const { paymentPlan, checkPaymentPlan } = this.state
		// const { lead } = this.props
		const array = [];

		if (checkPaymentPlan.investment === true && lead.paidProject != null && lead.paidProject != null) {
			array.push({ value: 'Sold on Investment Plan', name: `Investment Plan ${lead.paidProject.full_payment_discount > 0 ? `(Full Payment Disc: ${lead.paidProject.full_payment_discount}%)` : ''}` })
		}
		if (checkPaymentPlan.rental === true && lead.paidProject != null && lead.paidProject != null) {
			array.push({ value: 'Sold on Rental Plan', name: `Rental Plan ${lead.paidProject.full_payment_discount > 0 ? `(Full Payment Disc: ${lead.paidProject.full_payment_discount}%)` : ''}` })
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
		const { formData, unitPrice } = this.state


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

		// If user select payment drop down so discount and discounted price will be refresh
		if (name === 'paymentPlan') {
			newFormData['discountedPrice'] = ''
			newFormData['discount'] = ''
		}

		this.setState({
			formData: newFormData,
		}, () => {

			//Set Discount Price
			if (name === 'discount' || name === 'paymentPlan') {
				this.allCalculations(name)
			}

			// Set Discount for Token
			if (name === 'token') {
				this.allCalculations('token')
			}

			// when Project id chnage the unit filed will be refresh
			if (name === 'projectId' && formData.projectId != null) {
				this.refreshUnitPrice(name)
			}

			// when floor id chnage the unit filed will be refresh
			if (name === 'floorId' && formData.floorId != null) {
				this.refreshUnitPrice(name)
			}

			// when floor id chnage the unit filed will be refresh
			if (name === 'unitId' && formData.unitId != null) {
				this.refreshUnitPrice(name)
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

	allCalculations = (name) => {
		const { formData, unitPrice } = this.state
		const { lead } = this.props
		const newFormData = { ...formData }

		var totalPrice = unitPrice
		var frontDiscount = formData.discount
		var backendDiscount = lead.paidProject != null && lead.paidProject.full_payment_discount
		var grandTotal = ''
		var oldGrandTotal = ''
		var totalToken = ''

		if (formData.paymentPlan === 'Sold on Rental Plan' || formData.paymentPlan === 'Sold on Investment Plan') {
			oldGrandTotal = (Number(totalPrice)) * (1 - Number((backendDiscount / 100)));
			grandTotal = (Number(totalPrice)) * (1 - Number((frontDiscount / 100))) * (1 - Number((backendDiscount / 100)))
		}
		else {
			oldGrandTotal = Number(totalPrice);
			grandTotal = (Number(totalPrice)) * (1 - Number((frontDiscount / 100))) * (1 - Number((0 / 100)))
		}

		if (name === 'discount') {
			var formula = (oldGrandTotal / 100) * frontDiscount
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
			this.setState({ unitPrice: null, })
		}

		if (name === 'unitId') {
			newFormData['discount'] = null
			newFormData['finalPrice'] = null
			newFormData['discountedPrice'] = null
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

	submitFirstScreen = () => {
		const { lead } = this.props
		const { formData, remainingPayment, cnicValidate } = this.state

		this.setState({
			firstScreenConfirmLoading: true,
		})

		var body = {
			unitId: formData.unitId,
			projectId: formData.projectId,
			floorId: formData.floorId,
			unitDiscount: formData.discount === null || formData.discount === '' ? null : formData.discount,
			discounted_price: formData.discountedPrice === null || formData.discountedPrice === '' ? null : formData.discountedPrice,
			discount_amount: formData.finalPrice === null || formData.finalPrice === '' ? null : formData.finalPrice,
			unitStatus: 'Token',
			installmentDue: formData.paymentPlan,
			finalPrice: formData.finalPrice === null || formData.finalPrice === '' ? null : formData.finalPrice,
			remainingPayment: remainingPayment,
			installmentAmount: formData.token,
			type: formData.type,
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
						helper.errorToast('Something went wrong!!!')
						this.setState({
							firstScreenConfirmLoading: false,
						})
					})
			}).catch(() => {
				helper.errorToast('Something went wrong!!')
				this.setState({
					firstScreenConfirmLoading: false,
				})
			})
	}

	firstScreenConfirmModal = (status) => {
		const { formData, cnicValidate } = this.state
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
			cnicValidate != true
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

	addPaymentModalToggle = (status) => {
		if (status === true) {
			this.clearPaymentsValuesFromRedux(status)
			this.setState({
				addPaymentModalToggleState: status,
				secondCheckValidation: false,
				secondFormLeadData: {},
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

				// ====================== API call for added attachments
				axios.post(`/api/leads/project/payments`, body)
					.then((res) => {

						// ====================== If have attachments then this check will b execute
						if (CMPayment.attachments.length > 0) {

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
								// ====================== API call for Attachments base on Payment ID
								axios.post(`/api/leads/paymentAttachment?id=${res.data.id}`, fd)
									.then((res) => {
										this.fetchLead();
										this.setState({
											addPaymentModalToggleState: false,
											remainingPayment: remainingPayment - secondFormData.installmentAmount,
											addPaymentLoading: false,
										}, () => {
											helper.successToast('Payment Added')
											this.clearPaymentsValuesFromRedux(false);
										})
									})
							})

						} else {
							this.fetchLead();
							this.setState({
								addPaymentModalToggleState: false,
								secondFormData: {
									installmentAmount: null,
									type: '',
									details: '',
									cmLeadId: this.props.lead.id,
								},
								remainingPayment: remainingPayment - secondFormData.installmentAmount,
								addPaymentLoading: false,
							}, () => {
								helper.successToast('Payment Added')
							})
						}
					}).catch(() => {
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
				} else {
					total = secondFormData.installmentAmount - paymentOldValue
					total = remainingPayment - total
				}
				var body = {
					...secondFormData,
					remainingPayment: total,
					cmLeadId: this.props.lead.id,
				}
				axios.patch(`/api/leads/project/payment?id=${paymentId}`, body)
					.then((res) => {
						this.fetchLead();
						this.setState({
							addPaymentModalToggleState: false,
							secondFormData: {
								installmentAmount: null,
								type: '',
								details: '',
								cmLeadId: this.props.lead.id
							},
							remainingPayment: total,
							editaAble: false,
							addPaymentLoading: false,
						}, () => {
							helper.successToast('Payment Updated')
						})
					}).catch(() => {
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
				var setValuesForRedux =  {
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
		const { navigation, lead } = this.props;
		this.setState({
			addPaymentModalToggleState: false,
		})
		navigation.navigate('AttachmentsForPayments', { rcmLeadId: lead.id });
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
					console.log(error);
				})
		}
		else {
			alert('Please select a reason for lead closure!')
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
			checkReasonValidation,
			isVisible,
			checkLeadClosedOrNot,
			remarks,
			secondFormLeadData,
			cnicValidate,
			cnicEditable,
		} = this.state
		return (
			<View>
				<ProgressBar style={{ backgroundColor: "ffffff" }} progress={progressValue} color={'#0277FD'} />
				<View style={styles.mainParent}>
					{
						firstScreenDone === true ?
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
										cnicEditable={cnicEditable}
										currencyConvert={this.currencyConvert}
										handleForm={this.handleForm}
										submitFirstScreen={this.submitFirstScreen}
										openUnitDetailsModal={this.openUnitDetailsModal}
										firstScreenConfirmModal={this.firstScreenConfirmModal}
										tokenModalToggle={this.tokenModalToggle}
										editTileForscreenOne={this.editTileForscreenOne}
									/>
								</View>
							</ScrollView>
							: null
					}

					{
						firstScreenDone === false ?
							<ScrollView>
								<View style={styles.secondContainer}>
									<FormScreenSecond
										data={secondScreenData}
										paymentPreviewLoading={paymentPreviewLoading}
										remainingPayment={remainingPayment}
										checkLeadClosedOrNot={checkLeadClosedOrNot}
										onlyReadFormData={formData}
										addPaymentModalToggle={this.addPaymentModalToggle}
										currencyConvert={this.currencyConvert}
										editTile={this.editTile}
									/>
								</View>
							</ScrollView>
							: null
					}

					{
						unitDetailsData &&
						<UnitDetailsModal
							active={unitDetailModal}
							data={unitDetailsData}
							openUnitDetailsModal={this.openUnitDetailsModal}
						/>
					}

					{
						getAllFloors != '' && getAllProject != '' && allUnits != '' &&
						<FirstScreenConfirmModal
							active={openFirstScreenModal}
							data={formData}
							getAllProject={getAllProject}
							getAllFloors={getAllFloors}
							allUnits={allUnits}
							firstScreenConfirmLoading={firstScreenConfirmLoading}
							firstScreenConfirmModal={this.firstScreenConfirmModal}
							submitFirstScreen={this.submitFirstScreen}
						/>
					}

					<AddPaymentModal
						active={addPaymentModalToggleState}
						secondFormData={secondFormData}
						secondCheckValidation={secondCheckValidation}
						modalLoading={modalLoading}
						addPaymentLoading={addPaymentLoading}
						remarks={remarks}
						secondFormLeadData={secondFormLeadData}
						attechmentModalToggle={this.attechmentModalToggle}
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
					// checkValidation={checkReasonValidation}
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
						// closedLeadEdit={leadClosedCheck}
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