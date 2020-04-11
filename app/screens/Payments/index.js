import React, { Component } from 'react';
import { View, KeyboardAvoidingView, ScrollView } from 'react-native';
import axios from 'axios'
import styles from './style'
import AppStyles from '../../AppStyles'
import { connect } from 'react-redux';
import InnerForm from './innerForm';
import StaticData from '../../StaticData';
import LeadRCMPaymentPopup from '../../components/LeadRCMPaymentModal/index'

class Payments extends Component {
	constructor(props) {
		super(props)

		this.state = {
			getProject: [],
			checkValidation: false,
			getUnit: [],
			getFloors: [],
			totalInstalments: [],
			units: [],
			remainingPayment: '',
			readOnly: {
				totalSize: '',
				rate: '',
				totalPrice: '',
			},
			formData: {
				projectId: '',
				floorId: '',
				unitId: '',
				discount:'',
				token: '',
				commisionPayment: '',
				downPayment: '',
			},
			instalments: [],
			reasons: [],
			isVisible: false,
			selectedReason: '',
			checkReasonValidation: false
		}

	}

	componentDidMount() {
		this.getAllProjects();
	}

	getAllProjects = () => {
		axios.get(`/api/project/all`)
			.then((res) => {
				let projectArray = [];
				res && res.data.items.map((item, index) => { return (projectArray.push({ value: item.id, name: item.name })) })
				this.setState({
					getProject: projectArray
				})
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
		axios.get(`/api/project/shops?projectId=${projectId}&floorId=${floorId}`)
			.then((res) => {
				let array = [];
				res && res.data.rows.map((item, index) => { return (array.push({ value: item.id, name: item.name })) })
				this.setState({
					getUnit: array,
					units: res.data.rows
				})
			})
	}
	instalmentsField = (value) => {
		let array = []
		for (var i = 1; i <= value; i++) {
			array.push({ installmentAmount: '' })
		}
		this.setState({
			totalInstalments: array
		})
	}

	readOnly = (unitId) => {
		const { units } = this.state
		let array = {};
		array = units && units.filter((item) => { return item.id === unitId && item })
		let data = array[0]
		this.setState({
			readOnly: {
				totalSize: data.area + ' ' + data.area_unit,
				rate: data.pricePerSqFt,
				totalPrice: data.area * data.pricePerSqFt,
			}
		})
	}

	remainingPayment = (discount) => {
		// Total Price - Discount - Any payment done
		const { readOnly } = this.state
		var remaining = readOnly.totalPrice - discount
		this.setState({
				remainingPayment: remaining
		})
	}

	handleForm = (value, name) => {
		const { formData } = this.state
		formData[name] = value
		this.setState({ formData })

		if (name === 'projectId' && value != '') {
			this.getFloors(formData.projectId)
		}
		if (name === 'floorId' && value != '') {
			this.getUnits(formData.projectId, formData.floorId)
		}
		if (name === 'unitId' && value != '') {
			this.readOnly(value)
		}
		if (name === 'discount' && value != '') {
			this.remainingPayment(value)
		}
		if (name === 'instalments' && value != '') {
			this.instalmentsField(value)
		}
	}

	handleInstalments = (value, index) => {
		const { totalInstalments } = this.state
		totalInstalments[index].installmentAmount = parseInt(value)
		this.setState(totalInstalments)
	}

	formSubmit = () => {
		const { formData, totalInstalments } = this.state
		if (!formData.projectId || !formData.floorId || !formData.unitId || !formData.token || !formData.downPayment) {
			this.setState({
				checkValidation: true
			})
		} else {
			let body = {
				discount: parseInt(formData.discount),
				downPayment: parseInt(formData.downPayment),
				floorId: formData.floorId,
				token: parseInt(formData.token),
				unitId: formData.unitId,
				installments: totalInstalments,
				no_of_installments: totalInstalments.length,
			}
			axios.patch(`/api/leads/project?id=${formData.projectId}`, body)
				.then((res) => {
					if (body.commisionPayment !== null && body.commisionPayment === '') {
						this.setState({ reasons: StaticData.leadCloseReasons, isVisible: true, checkReasonValidation: '' })
					} else {
						this.setState({ reasons: StaticData.leadCloseReasonsWithPayment, isVisible: true, checkReasonValidation: '' })
					}
				})
		}
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
					navigation.navigate('Lead');
				});
			}).catch(error => {
				console.log(error);
			})
		}
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
		} = this.state
		return (
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
					/>
					<InnerForm
						getFloor={getFloors}
						getUnit={getUnit}
						getProject={getProject}
						getInstallments={StaticData.getInstallments}
						formData={formData}
						totalInstalments={totalInstalments}
						checkValidation={checkValidation}
						handleInstalments={this.handleInstalments}
						handleForm={this.handleForm}
						formSubmit={this.formSubmit}
						readOnly={readOnly}
						remainingPayment={remainingPayment}
					/>
				</View>
			</ScrollView>
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


