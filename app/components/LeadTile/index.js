import { Image, Text, TouchableOpacity, View } from 'react-native'

import AppStyles from '../../AppStyles'
import moment from 'moment'
import React from 'react'
import phone from '../../../assets/img/phone2.png'
import styles from './style'
import helper from '../../helper';
import { connect } from 'react-redux';
import axios from 'axios';

class LeadTile extends React.Component {
	constructor(props) {
		super(props)
	}

	call = (data) => {
		const { contacts, purposeTab, updateStatus, user } = this.props
		let newContact = helper.createContactPayload(data.customer)
		if (purposeTab === 'invest') this.sendCallStatus(data)
		else {
			if (data.assigned_to_armsuser_id === user.id) updateStatus(data)
		}
		helper.callNumber(newContact, contacts)
	}

	sendCallStatus = (data) => {
		const start = moment().format();
		let body = {
			start: start,
			end: start,
			time: start,
			date: start,
			taskType: 'called',
			response: 'Called',
			subject: 'Call to client ' + data.customer.customerName,
			cutomerId: data.customer.id,
			leadId: data.id,
			taskCategory: 'leadTask',
		}
		axios.post(`api/leads/project/meeting`, body)
			.then((res) => {
			})
	}

	leadSize = () => {
		const { data } = this.props
		let minSize = !data.projectId && data.size && data.size !== 0 ? data.size : ''
		let maxSize = !data.projectId && data.max_size && data.max_size !== 0 ? data.max_size : ''
		let size = ''
		if (minSize == maxSize) {
			size = minSize + ' '
		} else {
			maxSize = maxSize !== '' ? ' - ' + maxSize : maxSize
			size = minSize + maxSize + ' '
		}
		return size
	}

	render() {
		const { data, navigateTo, callNumber, user, purposeTab, contacts, handleLongPress } = this.props
		var changeColor = data.assigned_to_armsuser_id == user.id || data.shared_with_armsuser_id == user.id   ? styles.blueColor : AppStyles.darkColor
		var changeStatusColor =data.assigned_to_armsuser_id == user.id || data.shared_with_armsuser_id == user.id ? styles.tokenLabel : styles.tokenLabelDark
		var descriptionColor = data.assigned_to_armsuser_id == user.id || data.shared_with_armsuser_id == user.id ? styles.desBlue : styles.desDark
		let projectName = data.project ? helper.capitalize(data.project.name) : data.projectName
		let customerName = data.customer && data.customer.customerName && helper.capitalize(data.customer.customerName)
		let areasLength = !data.projectId && data.armsLeadAreas &&
			data.armsLeadAreas.length > 1 ?
			` (+${Number(data.armsLeadAreas.length) - 1} ${data.armsLeadAreas.length > 2 ? 'areas' : 'area'})`
			:
			''
		let leadSize = this.leadSize()
		return (
			<TouchableOpacity onLongPress={() => handleLongPress(data)} onPress={() => { navigateTo(data) }}>
				<View style={[styles.tileMainWrap, data.readAt === null && styles.selectedInventory]}>
					<View style={[styles.rightContentView]}>
						<View style={styles.topIcons}>
							<View style={styles.extraStatus}>
								<Text style={[changeStatusColor, AppStyles.mrFive, styles.viewStyle]} numberOfLines={1}>
									{/* Disabled Sentry in development  Sentry in */}
									{
										data.status === 'token' ?
											<Text>DEAL SIGNED - TOKEN</Text>
											:
											data.status.split('_').join(' ').toUpperCase()
									}
								</Text>

								{data.shared_with_armsuser_id &&
									<View style={styles.sharedLead}>
										<Text style={[AppStyles.mrFive, styles.viewStyle, {color:AppStyles.colors.primaryColor, fontSize: AppStyles.noramlSize.fontSize, fontFamily: AppStyles.fonts.lightFont}]}>Shared Lead</Text>
									</View>
								}
							</View>
						</View>
						<View style={[styles.contentMainWrap]}>
							<View style={styles.leftContent}>
								{/* ****** Name Wrap */}
								<View style={[styles.contentMain, AppStyles.mbTen]}>
									<Text style={[styles.largeText, changeColor]} numberOfLines={1}>
										{/* Disabled Sentry in development  Sentry in */}
										{customerName}
									</Text>
								</View>

								{/* ****** Price Wrap */}
								{
									data.description != null && data.description != '' && purposeTab === 'invest' &&
									<View style={[styles.contentMultiMain, AppStyles.mbFive]}>
										<Text style={[styles.normalText, AppStyles.darkColor, AppStyles.mrTen, descriptionColor]} numberOfLines={1}>
											{data.description}
										</Text>
									</View>
								}
								{
									purposeTab != 'invest' &&
									<View style={[styles.contentMultiMain, AppStyles.mbFive]}>
										<Text style={[styles.priceText, AppStyles.darkColor]}>
											PKR
                    					</Text>
										<Text style={[styles.priceText, changeColor]}>
											{` ${!data.projectId && data.min_price ? helper.checkPrice(data.min_price) + ' - ' : ''}`}
											{!data.projectId && data.price ? helper.checkPrice(data.price) : ''}
											{data.projectId && data.minPrice && helper.checkPrice(data.minPrice) + ' - '}
											{data.projectId && data.maxPrice && helper.checkPrice(data.maxPrice)}
										</Text>
									</View>
								}
								{/* ****** Address Wrap */}
								<View style={[styles.contentMultiMain, AppStyles.mbFive]}>
									{
										data.size != null && !data.projectId &&
										<Text style={[styles.normalText, AppStyles.darkColor, AppStyles.mrTen]} numberOfLines={1}>
											{leadSize}
											{data.size_unit && data.size_unit !== null && data.size !== 0 ? helper.capitalize(data.size_unit) + ' ' : null}
											{helper.capitalize(data.subtype)} {data.purpose != null && 'to '}
											{data.purpose === 'sale' ? 'Buy' : 'Rent'}
										</Text>
									}
								</View>
								{/* ****** Location Wrap */}
								<View style={[styles.contentMultiMain, AppStyles.mbFive]}>
									<Text style={[styles.normalText, AppStyles.darkColor, AppStyles.mrTen]} numberOfLines={1}>
										{
											!data.projectId && data.armsLeadAreas && data.armsLeadAreas.length > 0 ?
												data.armsLeadAreas[0].area.name + `${areasLength}` + ' - '
												: ''
										}
										{!data.projectId && data.city && data.city.name}
										{purposeTab === 'invest' && helper.capitalize(projectName)}
										{
											data.projectType && data.projectType != '' &&
											` - ${helper.capitalize(data.projectType)}`
										}
									</Text>
								</View>
								{/* ****** Location Wrap */}
								<View style={[styles.contentMultiMain, AppStyles.mbFive]}>
									<Text style={[styles.normalText, styles.lightColor, AppStyles.mrTen]} numberOfLines={1}>
										{data.id ? `ID: ${data.id}, ` : ''} {`Created: ${moment(data.createdAt).format("MMM DD YYYY, hh:mm A")}`}
									</Text>
								</View>
							</View>
							<View style={styles.phoneMain}>
								<TouchableOpacity style={styles.actionBtn} onPress={() => { this.call(data) }}>
									<Image
										style={[styles.fireIcon, AppStyles.mlFive]}
										source={phone}
									/>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</View>
			</TouchableOpacity>
		)
	}
}

mapStateToProps = (store) => {
	return {
		user: store.user.user,
		contacts: store.contacts.contacts,
	}
}

export default connect(mapStateToProps)(LeadTile)