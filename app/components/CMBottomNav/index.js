import React from "react";
import { View, Text, Image, TouchableOpacity, Linking } from "react-native";
import AppStyles from '../../AppStyles';
import styles from './style'
import { connect } from 'react-redux';
import Avatar from '../Avatar';
import helper from '../../helper';
import { Button, Menu, Divider, Provider } from 'react-native-paper';
import axios from 'axios';

class CMBottomNav extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			visible: false,
		}
	}


	callNumber = (url) => {
		if (url != 'tel:null') {
			Linking.canOpenURL(url)
				.then(supported => {
					if (!supported) {
						console.log("Can't handle url: " + url);
					} else {
						return Linking.openURL(url)
					}
				}).catch(err => console.error('An error occurred', err));
		} else {
			helper.errorToast(`No Phone Number`)
		}
	}

	openMenu = (status) => {
		this.setState({
			visible: status
		})
	}

	call = () => {
		const { contacts, customer } = this.props
		let newContact = helper.createContactPayload(customer)
		this.updateStatus()
		helper.callNumber(newContact, contacts)
	}

	updateStatus = () => {
		const { lead, user } = this.props
		if (lead.assigned_to_armsuser_id === user.id) {
			if (lead.status === 'open') {
				axios.patch(`/api/leads/?id=${lead.id}`,
					{
						status: 'called'
					})
					.then((res) => {
						console.log('success')
					})
					.catch((error) => {
						console.log(`ERROR: /api/leads/?id=${data.id}`, error)
					})
			}
		}
	}

	render() {
		const {
			navigateTo,
			goToComments,
			goToDiaryForm,
			goToAttachments,
			closedLeadEdit,
			closeLead,
			alreadyClosedLead,
			callButton,
		} = this.props
		const { visible } = this.state


		return (
			<View style={styles.bottomNavMain}>
				<TouchableOpacity style={styles.bottomNavBtn} onPress={() => navigateTo()}>
					<Image style={styles.bottomNavImg} source={require('../../../assets/img/details.png')} />
					<Text style={styles.bottomNavBtnText}>Details</Text>
				</TouchableOpacity>
				{
					callButton != true &&
					<TouchableOpacity style={styles.bottomNavBtn} onPress={() => goToComments()}>
						<Image style={styles.bottomNavImg} source={require('../../../assets/img/msg.png')} />
						<Text style={styles.bottomNavBtnText}>Comments</Text>
					</TouchableOpacity>
				}
				{
					callButton != true &&
					<TouchableOpacity style={styles.bottomNavBtn} onPress={() => goToAttachments()}>
						<Image style={styles.bottomNavImg} source={require('../../../assets/img/files.png')} />
						<Text style={styles.bottomNavBtnText}>Files</Text>
					</TouchableOpacity>
				}
				<TouchableOpacity style={styles.bottomNavBtn} onPress={() => goToDiaryForm()}>
					<Image style={styles.bottomNavImg} source={require('../../../assets/img/roundPlus.png')} />
					<Text style={styles.bottomNavBtnText}>Add Task</Text>
				</TouchableOpacity>
				<TouchableOpacity style={styles.bottomNavBtn} onPress={() => { closedLeadEdit == true ? closeLead() : alreadyClosedLead() }}>
					<Image style={styles.bottomNavImg} source={require('../../../assets/img/roundCheck.png')} />
					<Text style={styles.bottomNavBtnText}>Close</Text>
				</TouchableOpacity>
				{
					callButton === true &&
					<TouchableOpacity style={styles.bottomNavBtn} onPress={() => this.call()}>
						<Image style={styles.bottomNavImg} source={require('../../../assets/img/callIcon.png')} />
						<Text style={styles.bottomNavBtnText}>Call</Text>
					</TouchableOpacity>
				}
				{
					callButton === true &&
					// <TouchableOpacity style={[styles.bottomNavBtn, styles.forMenuIcon]} onPress={() => goToAttachments()}>
					//   <Image style={styles.bottomNavImg} source={require('../../../assets/img/menuIcon.png')} />
					//   <Text style={[styles.bottomNavBtnText, styles.colorWhite]}>Menu</Text>
					// </TouchableOpacity>
					<View style={[styles.bottomNavBtn2, visible === true && styles.forMenuIcon]}>
						<Menu
							visible={visible}
							onDismiss={() => this.openMenu(false)}
							anchor={
								<TouchableOpacity onPress={() => this.openMenu(true)} style={styles.align}>
									{
										visible === true ?
											<Image style={styles.bottomNavImg} source={require('../../../assets/img/menuIcon.png')} />
											:
											<Image style={styles.bottomNavImg} source={require('../../../assets/img/menuIcon2.png')} />
									}
									<Text style={[styles.bottomNavBtnText, visible === true && styles.colorWhite]}>Menu</Text>
								</TouchableOpacity>
							}>
							<Menu.Item onPress={() => { goToComments() }} icon={require('../../../assets/img/msg.png')} title="Comments" />
							<Menu.Item onPress={() => { goToAttachments() }} icon={require('../../../assets/img/files.png')} title="Files" />
						</Menu>
					</View>

				}

			</View>
		)
	}
}

mapStateToProps = (store) => {
	return {
		user: store.user.user,
		contacts: store.contacts.contacts,
	}
}

export default connect(mapStateToProps)(CMBottomNav)