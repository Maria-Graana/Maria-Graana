import React, { Component } from 'react';
import { View, ScrollView, KeyboardAvoidingView } from 'react-native';
import axios from 'axios'
import AppStyles from '../../AppStyles'
import { connect } from 'react-redux';
import FormScreenOne from './FormScreenOne';
import FormScreenSecond from './FormScreenSecond';
import StaticData from '../../StaticData';
import moment from 'moment'
import { ProgressBar } from 'react-native-paper';
import helper from '../../helper';
import { setlead } from '../../actions/lead';
// delete Items
// import LeadRCMPaymentPopup from '../../components/LeadRCMPaymentModal/index'
// import PaymentAlert from '../../components/PaymentAlert'
import CMBottomNav from '../../components/CMBottomNav'
import UnitDetailsModal from '../../components/UnitDetailsModal'
import AddPaymentModal from '../../components/AddPaymentModal'
import FirstScreenConfirmModal from '../../components/FirstScreenConfirmModal'
import { cos } from 'react-native-reanimated';
import { formatPrice } from '../../PriceFormate';


class Payments extends Component {
	constructor(props) {
		super(props)
		const { lead } = this.props
		this.state = {
			progressValue: 0,
			getProject: [],
			getFloors: [],
			getAllFloors: [],
			getUnit: [],
			allUnits: [],
			formData: {
				projectId: lead.project != null ? lead.project.id : null,
				floorId: null,
				discount: null,
				discountedPrice: null,
				finalPrice: null,
				paymentPlan: null,
				unitId: null,
			},
			secondFormData: {
				installmentAmount: null,
				type: '',
				cmLeadId: lead.id,
				details: '',
			},
			unitId: null,
			unitPrice: null,
			checkPaymentPlan: {
				years: lead.project != null && lead.project.installment_plan != null || '' ? lead.project.installment_plan : null,
				monthly: lead.project != null && lead.project.monthly_installment_availablity === 'yes' ? true : false,
				rental: lead.project != null && lead.project.rent_available === 'yes' ? true : false,
				investment: true,
				quartarly: true,
			},
			paymentPlan: [],
			openFirstScreenModal: false,
			firstScreenValidate: false,
			firstScreenDone: lead.unit != null && lead.unit.bookingStatus === 'Hold' ? false : true,
			// firstScreenDone: true,
			secondScreenData: lead,
			addPaymentModalToggleState: false,
			secondCheckValidation: false,
			editaAble: false,
			paymentId: null,
			remainingPayment: lead.remainingPayment != null ? lead.remainingPayment : '',
			paymentOldValue: null,
		}
	}

	componentDidMount() {
		const { formData } = this.state
		this.fetchLead()
		this.getAllProjects()
		this.setPaymentPlanArray()
		this.handleForm(formData.projectId, 'projectId')
	}

	fetchLead = () => {
		const { lead } = this.props
		const { cmProgressBar } = StaticData
		axios.get(`/api/leads/project/byId?id=${lead.id}`)
			.then((res) => {
				this.props.dispatch(setlead(res.data))
				this.setState({
					progressValue: cmProgressBar[res.data.status] || 0,
					secondScreenData: res.data,
				})
			})
			.catch((error) => {
				console.log(error)
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
		const { allUnits } = this.state
		let object = {};
		object = allUnits.find((item) => { return item.id == id && item })
		this.setState({
			unitPrice: object.unit_price,
		})
	}

	setPaymentPlanArray = () => {
		const { paymentPlan, checkPaymentPlan } = this.state
		const { lead } = this.props
		const array = [];

		if (checkPaymentPlan.investment === true) {
			array.push({ value: 'Sold on Investment Plan', name: `Investment Plan (Full Payment Disc. ${lead.project.full_payment_discount}%)` })
		}
		if (checkPaymentPlan.rental === true) {
			array.push({ value: 'Sold on Rental Plan', name: `Rental Plan (Full Payment Disc. ${lead.project.full_payment_discount}%)` })
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

	handleForm = (value, name) => {
		const { formData, unitPrice } = this.state

		// Set Values In form Data
		const newFormData = { ...formData }
		newFormData[name] = value

		// Get Floor base on Project Id
		if (name === 'projectId') {
			this.getFloors(value)
		}

		// Get Floor base on Floor ID & Project Id
		if (name === 'floorId') {
			this.getUnits(value, formData.projectId)
		}

		//Set Selected Unit Details
		if (name === 'unitId') {
			this.setUnitPrice(value)
		}

		this.setState({
			formData: newFormData,
		}, () => {

			//Set Discount Price
			if (name === 'discount' || name === 'paymentPlan') {
				this.calculatedPercentFormula(name, value)
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

	calculatedPercentFormula = (name, value) => {
		const { formData, unitPrice, paymentPlan } = this.state
		const { lead } = this.props

		const newFormData = { ...formData }
		newFormData[name] = value

		var totalPrice = unitPrice
		var frontDiscount = formData.discount
		var backendDiscount = lead.project.full_payment_discount
		var grandTotal = ''

		if (name === 'discount') {
			grandTotal = (Number(totalPrice)) * (1 - Number((frontDiscount / 100))) * (1 - Number((0 / 100)))
			if (value != '') {
				newFormData['discountedPrice'] = grandTotal
			} else {
				newFormData['discountedPrice'] = ''
			}
		}

		if (formData.paymentPlan === 'Sold on Rental Plan' || formData.paymentPlan === 'Sold on Investment Plan') {
			grandTotal = (Number(totalPrice)) * (1 - Number((frontDiscount / 100))) * (1 - Number((backendDiscount / 100)))
		} else {
			grandTotal = (Number(totalPrice)) * (1 - Number((frontDiscount / 100))) * (1 - Number((0 / 100)))
		}

		newFormData['finalPrice'] = grandTotal
		this.setState({
			formData: newFormData,
			remainingPayment: grandTotal,
		})
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
		var result = total - ((percent / 100) * total)
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
		const { formData, unitId } = this.state
		var body = {
			unitId: formData.unitId,
			projectId: formData.projectId,
			floorId: formData.floorId,
			unitDiscount: formData.discount,
			discounted_price: formData.discountedPrice,
			discount_amount: formData.finalPrice,
			unitStatus: 'Hold',
			installmentDue: formData.paymentPlan,
			finalPrice: formData.finalPrice,
			remainingPayment: formData.finalPrice,
		}
		var leadId = []
		leadId.push(lead.id)
		axios.patch(`/api/leads/project`, body, { params: { id: leadId } })
			.then((res) => {
				axios.get(`/api/leads/project/byId?id=${lead.id}`)
					.then((res) => {
						this.props.dispatch(setlead(res.data))
						this.setState({
							secondScreenData: res.data,
							openFirstScreenModal: false,
							firstScreenDone: false,
						}, () => {
							helper.successToast('Lead Booked')
						})
					})
			})
	}

	firstScreenConfirmModal = (status) => {
		const { formData } = this.state
		if (formData.projectId != null && formData.floorId != null && formData.unitId != null && formData.paymentPlan != null) {
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
		this.setState({
			addPaymentModalToggleState: status
		})
	}

	secondHandleForm = (value, name) => {
		const { secondFormData } = this.state
		const newSecondFormData = secondFormData
		newSecondFormData[name] = value
		this.setState({
			secondFormData: newSecondFormData,
		})
	}

	secondFormSubmit = () => {
		const {
			secondFormData,
			editaAble,
			paymentId,
			formData,
			remainingPayment,
			paymentOldValue,
		} = this.state


		if (secondFormData.installmentAmount != null || secondFormData.type != '') {
			if (editaAble === false) {
				var body = {
					...secondFormData,
					remainingPayment: remainingPayment - secondFormData.installmentAmount,
				}
				axios.post(`/api/leads/project/payments`, body)
					.then((res) => {
						this.fetchLead();
						this.setState({
							addPaymentModalToggleState: false,
							secondFormData: {
								installmentAmount: null,
								type: '',
								details: '',
							},
							remainingPayment: remainingPayment - secondFormData.installmentAmount,
						}, () => {
							helper.successToast('Payment Added')
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
				}
				console.log(body)
				axios.patch(`/api/leads/project/payment?id=${paymentId}`, body)
					.then((res) => {
						this.fetchLead();
						this.setState({
							addPaymentModalToggleState: false,
							secondFormData: {
								installmentAmount: null,
								type: '',
								details: '',
							},
							remainingPayment: total,
							editaAble: false,
						}, () => {
							helper.successToast('Payment Edit Success')
						})
					})
			}
		} else {
			this.setState({
				secondCheckValidation: true,
			})
		}
	}
	editTile = (id) => {
		axios.get(`/api/leads/project/byId?id=${this.props.lead.id}`)
			.then((res) => {
				let editLeadData = [];
				editLeadData = res && res.data.payment.find((item, index) => { return item.id === id ? item : null })
				this.setState({
					secondFormData: {
						installmentAmount: editLeadData.installmentAmount,
						type: editLeadData.type,
						cmLeadId: this.props.lead.id,
						details: editLeadData.details,
					},
					addPaymentModalToggleState: true,
					editaAble: true,
					paymentId: id,
					paymentOldValue: editLeadData.installmentAmount,
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
			paymentOldValue,
		} = this.state
		return (
			<View>
				<ProgressBar style={{ backgroundColor: "ffffff" }} progress={progressValue} color={'#0277FD'} />
				{
					firstScreenDone === true &&
					<FormScreenOne
						getProject={getProject}
						getFloors={getFloors}
						getUnit={getUnit}
						unitPrice={unitPrice}
						unitId={unitId}
						formData={formData}
						paymentPlan={paymentPlan}
						firstScreenValidate={firstScreenValidate}
						currencyConvert={this.currencyConvert}
						handleForm={this.handleForm}
						submitFirstScreen={this.submitFirstScreen}
						openUnitDetailsModal={this.openUnitDetailsModal}
						firstScreenConfirmModal={this.firstScreenConfirmModal}
					/>
				}

				{
					firstScreenDone === false &&
					<FormScreenSecond
						data={secondScreenData}
						remainingPayment={remainingPayment}
						addPaymentModalToggle={this.addPaymentModalToggle}
						currencyConvert={this.currencyConvert}
						editTile={this.editTile}
					/>
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
						firstScreenConfirmModal={this.firstScreenConfirmModal}
						submitFirstScreen={this.submitFirstScreen}
					/>
				}

				<AddPaymentModal
					active={addPaymentModalToggleState}
					secondFormData={secondFormData}
					secondCheckValidation={secondCheckValidation}
					addPaymentModalToggle={this.addPaymentModalToggle}
					secondHandleForm={this.secondHandleForm}
					secondFormSubmit={this.secondFormSubmit}
				/>

				<View style={AppStyles.mainCMBottomNav}>
					<CMBottomNav
						goToAttachments={this.goToAttachments}
						navigateTo={this.navigateTo}
						goToDiaryForm={this.goToDiaryForm}
						goToComments={this.goToComments}
					// alreadyClosedLead={this.closedLead}
					// closedLeadEdit={leadClosedCheck}
					// closeLead={this.closeLead}
					/>
					{/* <CMBottomNav
						
					/> */}
				</View>
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