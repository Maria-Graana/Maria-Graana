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
import { FAB } from 'react-native-paper';

class Payments extends Component {
	constructor(props) {
		super(props)
		const { lead } = this.props

		this.state = {
			getProject: [],
			checkValidation: false,
			getUnit: [],
			arrowCheck: {
				discount: false,
				token: false,
				downPayment: false,
				installments: false,
			},
			getFloors: [],
			tokenDate: lead.tokenPaymentTime ? moment(lead.tokenPaymentTime).format('hh:mm a') + ' ' + moment(lead.tokenPaymentTime).format('MMM DD') : '',
			downPaymentTime: lead.tokenPaymentTime ? moment(lead.tokenPaymentTime).format('hh:mm a') + ' ' + moment(lead.tokenPaymentTime).format('MMM DD') : '',
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
			},
			instalments: lead.no_of_installments ? lead.no_of_installments : '',
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
		this.setFields();
	}

	setFields = () => {
		const { formData, arrowCheck } = this.state
		const { lead } = this.props
		let data = lead
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
			},
			instalments: data.no_of_installments ? data.no_of_installments : '',
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
				name = 'discount'
				arrowCheck[name] = false
			}
			if (data.token != null) {
				this.discountPayment(formData)
				this.discountPayment()
				name = 'token'
				arrowCheck[name] = false
			}
			if (data.downPayment != null) {
				this.discountPayment(formData)
				this.discountPayment()
				name = 'downPayment'
				arrowCheck[name] = false
			}
			if (data.no_of_installments != null) {
				this.instalmentsField(data.no_of_installments)
				this.discountPayment()
			}
			if (data.cmInstallments.length) {
				name = 'installments'
				arrowCheck[name] = false
			}

			this.setState({ arrowCheck })

		})
	}

	getAllProjects = () => {
		axios.get(`/api/project/all`)
			.then((res) => {
				let projectArray = [];
				res && res.data.items.map((item, index) => { return (projectArray.push({ value: item.id, name: item.name })) })
				this.setState({
					getProject: projectArray
				})
			}).catch((error) => {
				console.log('project')
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
		axios.get(`/api/project/shops?projectId=${projectId}&floorId=${floorId}`)
			.then((res) => {
				let array = [];
				res && res.data.rows.map((item, index) => { return (array.push({ value: item.id, name: item.name })) })
				this.setState({
					getUnit: array,
					units: res.data.rows
				}, () => {
					if (lead.unitId != null) {
						this.readOnly(lead.unitId)
					}
				})
			})
	}

	instalmentsField = (value) => {
		const { totalInstalments } = this.state
		const { lead } = this.props
		let array = []
		for (var i = 0; i < value; i++) {
			array.push({
				installmentAmount: lead.cmInstallments.length > i ? lead.cmInstallments[i].installmentAmount : '',
				installmentAmountDate: lead.cmInstallments.length > i ? lead.cmInstallments[i].createdAt : ''
			})
		}
		this.setState({
			totalInstalments: array,
			instalments: value
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
		const { readOnly, formData, totalInstalments } = this.state
		let totalPrice = readOnly.totalPrice
		let totalInstallments = ''
		totalInstalments.map((item, index) => {
			if (item.installmentAmount) {
				totalInstallments = Number(totalInstallments) + Number(item.installmentAmount)
			}
		})
		let remaining = ''
		if (readOnly.totalPrice != '') {
			remaining = totalPrice - formData['discount'] - formData['downPayment'] - formData['token'] - Number(totalInstallments)
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
	}

	handleForm = (value, name) => {
		const { formData, arrowCheck } = this.state
		let newFormData = { ...formData }
		newFormData[name] = value

		if (name === 'discount') {
			arrowCheck[name] = true
		}
		if (name == 'token') {
			arrowCheck[name] = true
		}
		if (name === 'downPayment') {
			arrowCheck[name] = true
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

	formSubmit = () => {
		const { lead } = this.props
		const { formData, totalInstalments, remainingPayment, readOnly } = this.state
		let body = {
			discount: formData.discount ? parseInt(formData.discount) : null,
			downPayment: formData.downPayment ? parseInt(formData.downPayment) : null,
			floorId: formData.floorId ? formData.floorId : null,
			token: formData.token ? parseInt(formData.token) : null,
			unitId: formData.unitId ? formData.unitId : null,
			installments: totalInstalments ? totalInstalments : null,
			no_of_installments: totalInstalments.length ? totalInstalments.length : null,
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

	submitValues = (name) => {
		const { formData, instalments, totalInstalments, tokenDate, arrowCheck } = this.state
		const { lead } = this.props
		formData[name] = formData[name]
		let body = {};
		let newArrowCheck = { ...arrowCheck }
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
			body = { discount: formData[name] ? formData[name] : null }
			newArrowCheck[name] = false
		}
		if (name === 'token') {
			body = { token: formData[name] ? formData[name] : null, tokenPaymentTime: tokenDate }
			this.currentDate(name)
			newArrowCheck[name] = false
		}
		if (name === 'downPayment') {
			body = { downPayment: formData[name] ? formData[name] : null }
			this.currentDate(name)
			newArrowCheck[name] = false
		}
		if (name === 'no_installments') {
			body = { no_of_installments: instalments }
		}
		if (name === 'installments') {
			body = { installments: totalInstalments ? totalInstalments : null }
			newArrowCheck[name] = false
		}
		axios.patch(`/api/leads/project?id=${lead.id}`, body)
			.then((res) => {
				this.setState({ arrowCheck: newArrowCheck })
			}).catch((error) => {
				console.log('Some thing went wrong!!!', error)
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

	goToComments = () => {
		const { navigation, route } = this.props;
		navigation.navigate('Comments', { cmLeadId: this.props.lead.id });
	}

	goToAttachments = () => {
		const { navigation, route } = this.props;
		navigation.navigate('Attachments', { cmLeadId: this.props.lead.id });
	}

	goToDiaryForm = () => {
		const { navigation, route, user } = this.props;
		navigation.navigate('AddDiary', {
			update: false,
			cmLeadId: this.props.lead.id,
			agentId: user.id
		});
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
			open,
			arrowCheck,
		} = this.state
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
						/>
					</View>
				</ScrollView>
				<FAB.Group
					open={open}
					icon="plus"
					fabStyle={{ backgroundColor: AppStyles.colors.primaryColor }}
					color={AppStyles.bgcWhite.backgroundColor}
					actions={[
						{ icon: 'plus', label: 'Comment', color: AppStyles.colors.primaryColor, onPress: () => this.goToComments() },
						{ icon: 'plus', label: 'Attachment', color: AppStyles.colors.primaryColor, onPress: () => this.goToAttachments() },
						{ icon: 'plus', label: 'Diary Task', color: AppStyles.colors.primaryColor, onPress: () => this.goToDiaryForm() },

					]}
					onStateChange={({ open }) => this.setState({ open })}
				/>
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


