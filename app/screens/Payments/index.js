import React, { Component } from 'react';
import { View, ScrollView, KeyboardAvoidingView } from 'react-native';
import axios from 'axios'
import AppStyles from '../../AppStyles'
import { connect } from 'react-redux';
import FormScreenOne from './FormScreenOne';
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
import { cos } from 'react-native-reanimated';


class Payments extends Component {
	constructor(props) {
		super(props)
		const { lead } = this.props
		this.state = {
			progressValue: 0,
			getProject: [],
			getFloors: [],
			getUnit: [],
			allUnits: [],
			formData: {
				projectId: null,
				floorId: null,
				discount: null,
				discountedPrice: null,
				finalPrice: null,
				paymentPlan: null,
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
		}
	}

	componentDidMount() {
		this.fetchLead()
		this.getAllProjects()
		this.setPaymentPlanArray()
		// console.log(this.props.lead.project)
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

	getAllProjects = () => {
		axios.get(`/api/project/all`)
			.then((res) => {
				let projectArray = [];
				res && res.data.items.map((item, index) => { return (projectArray.push({ value: item.id, name: item.name })) })
				this.setState({
					getProject: projectArray,
					getAllProject: res.data
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
		const array = [];
		if (checkPaymentPlan.investment === true) {
			array.push({ value: 'Sold on Investment Plan', name: 'Investment Plan' })
		}
		if (checkPaymentPlan.rental === true) {
			array.push({ value: 'Sold on Rental Plan', name: 'Rental Plan' })
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
		const { formData } = this.state
		var body = {
			unitDiscount: formData.discount,
			discounted_price: formData.discountedPrice,
			discount_amount: formData.finalPrice,
			unitStatus: 'Hold',
			installmentDue: formData.paymentPlan,
			finalPrice: formData.finalPrice,
		}
		var leadId = []
		leadId.push(lead.id)
		axios.patch(`/api/leads/project`, body, { params: { id: leadId } })
			.then((res) => {
				console.log('done')
			})
	}

	render() {
		const {
			progressValue,
			getProject,
			getFloors,
			getUnit,
			unitDetailModal,
			unitDetailsData,
			formData,
			paymentPlan,
			unitPrice,
		} = this.state
		return (
			<View>
				<ProgressBar style={{ backgroundColor: "ffffff" }} progress={progressValue} color={'#0277FD'} />
				<FormScreenOne
					getProject={getProject}
					getFloors={getFloors}
					getUnit={getUnit}
					unitPrice={unitPrice}
					formData={formData}
					paymentPlan={paymentPlan}
					currencyConvert={this.currencyConvert}
					handleForm={this.handleForm}
					submitFirstScreen={this.submitFirstScreen}
					openUnitDetailsModal={this.openUnitDetailsModal}
				/>
				{
					unitDetailsData &&
					<UnitDetailsModal
						active={unitDetailModal}
						openUnitDetailsModal={this.openUnitDetailsModal}
						data={unitDetailsData}
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