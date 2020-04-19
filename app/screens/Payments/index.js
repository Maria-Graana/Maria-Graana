import React, { Component } from 'react';
import { View, KeyboardAvoidingView, ScrollView } from 'react-native';
import axios from 'axios'
import styles from './style'
import AppStyles from '../../AppStyles'
import { connect } from 'react-redux';
import InnerForm from './innerForm';
import StaticData from '../../StaticData';
import LeadRCMPaymentPopup from '../../components/LeadRCMPaymentModal/index'
import moment from 'moment'
import { ProgressBar, Colors } from 'react-native-paper';
import { setlead } from '../../actions/lead';
import helper from '../../helper';

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
				token: '',
				discount: '',
				commisionPayment: '',
				downPayment: '',
			},
			instalments: [],
			reasons: [],
			isVisible: false,
			selectedReason: '',
			checkReasonValidation: false,
			progressValue: 0
		}

	}

	componentDidMount() {
		this.fetchLead()
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
			},
			remainingPayment: data.area * data.pricePerSqFt,
		})
	}

	discountPayment = () => {
		const { readOnly, formData, totalInstalments } = this.state
		let totalPrice = readOnly.totalPrice
		let totalInstallments = 0
		totalInstalments.map((item, index) => {
			if (item.installmentAmount) {
				totalInstallments = totalInstallments + item.installmentAmount
			}
		})
		let remaining = totalPrice - formData['discount'] - formData['downPayment'] - formData['token'] - totalInstallments

		this.setState({ remainingPayment: remaining })
	}

	currentDate = (name) => {
		var date = new Date()
		if (name === 'downPayment') {
			this.setState({
				downPayment: moment(date).format('hh:mm a') + ' ' + moment(date).format('MMM DD')
			})
		}

		if (name === 'token') {
			this.setState({
				tokenDate: moment(date).format('hh:mm a') + ' ' + moment(date).format('MMM DD')
			})
		}
	}

	handleForm = (value, name) => {
		const { formData } = this.state
		let newFormData = { ...formData }
		newFormData[name] = value
		this.setState({ formData: newFormData }, () => {
			if (name === 'projectId' && value != '') {
				this.getFloors(newFormData.projectId)
			}
			if (name === 'floorId' && value != '') {
				this.getUnits(newFormData.projectId, newFormData.floorId)
			}
			if (name === 'unitId' && value != '') {
				this.readOnly(value)
			}
			if (name === 'discount') {
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
			if (name === 'instalments') {
				this.instalmentsField(value)
			}
		})
	}

	handleInstalments = (value, index) => {
		const { totalInstalments } = this.state
		var date = new Date()
		let newInstallments = [...totalInstalments]
		newInstallments[index].installmentAmount = parseInt(value)
		newInstallments[index].installmentDate = moment(date).format('hh:mm a') + ' ' + moment(date).format('MMM DD')
		this.setState({ totalInstalments: newInstallments }, () => {
			this.discountPayment()
		})
		
	}

	formSubmit = () => {
		const { lead } = this.props
		const { formData, totalInstalments, remainingPayment } = this.state
		let body = {
			discount: parseInt(formData.discount),
			downPayment: parseInt(formData.downPayment),
			floorId: formData.floorId,
			token: parseInt(formData.token),
			unitId: formData.unitId,
			installments: totalInstalments,
			no_of_installments: totalInstalments.length,
		}
		console.log(body)
		console.log('projectId', formData.projectId)
		axios.patch(`/api/leads/project?id=${lead.id}`, body)
			.then((res) => {
				if (remainingPayment === 0) {
					this.setState({ reasons: StaticData.paymentPopup, isVisible: true, checkReasonValidation: '' })
				} else {
					this.setState({ reasons: StaticData.paymentPopupDone, isVisible: true, checkReasonValidation: '' })
				}
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
			downPayment,
			tokenDate,
			progressValue
		} = this.state

		return (
			<View>
				<ProgressBar progress={progressValue} color={'#0277FD'} />
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
							checkValidation={checkValidation}
							handleInstalments={this.handleInstalments}
							handleForm={this.handleForm}
							formSubmit={this.formSubmit}
							readOnly={readOnly}
							remainingPayment={remainingPayment}
							formData={formData}
							tokenDate={tokenDate}
							downPayment={downPayment}
						/>
					</View>
				</ScrollView>
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


