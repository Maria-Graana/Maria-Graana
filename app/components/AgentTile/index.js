import React from 'react'
import { View, Text, Image, TouchableOpacity, } from 'react-native'
import styles from './style'
import AppStyles from '../../AppStyles'
import { Ionicons, FontAwesome, Entypo } from '@expo/vector-icons';
import { CheckBox } from 'native-base';
import helper from '../../helper'
import { Menu, Divider } from 'react-native-paper';

class InventoryTile extends React.Component {
	constructor(props) {
		super(props)
	}

	_renderItem = (item) => {
		return (
			<Image style={styles.noImage} source={{ uri: item.item }} />
		)
	}

	render() {
		const { data, isMenuVisible, showCheckBoxes, menuShow, organization, toggleMenu } = this.props
		let phoneNumber = null
		if (organization !== 'arms') phoneNumber = data.user ? data.user.phone : null
		else phoneNumber = data.user ? data.user.phoneNumber : null

		return (
			<TouchableOpacity
				style={{ flexDirection: "row" }}
				onLongPress={() => {
					this.props.displayChecks()
					this.props.addProperty(data)
				}}
				onPress={() => { this.props.addProperty(data) }}
			>
				<View style={styles.tileContainer}>
					<View style={[AppStyles.mb1, styles.pad5]}>
						<Text style={styles.currencyText}> PKR  <Text style={styles.priceText}>{data.price}</Text> </Text>
						<Text numberOfLines={1} style={styles.marlaText}> {data.size} {data.size_unit} {data.subtype && helper.capitalize(data.subtype)} For {data.purpose && helper.capitalize(data.purpose)} </Text>
						<Text numberOfLines={1} style={styles.addressText}> {data.area ? data.area.name + ', ' : null} {data.city ? data.city.name : null} </Text>
						<View style={styles.iconContainer}>
							<View style={styles.iconInner}>
								<Ionicons name="ios-bed" size={25} color={AppStyles.colors.subTextColor} />
								<Text style={{ fontSize: 18 }}> {data.bed} </Text>
							</View>
							<View style={styles.iconInner}>
								<FontAwesome name="bath" size={22} color={AppStyles.colors.subTextColor} />
								<Text style={{ fontSize: 18 }}> {data.bath} </Text>
							</View>
						</View>
					</View>
					<View style={styles.underLine} />
					<View style={[styles.pad5, { marginRight: 5 }]}>
						<View style={{ flexDirection: 'row', height: 20 }}>
							<View style={{ flex: 1 }}></View>
							{
								isMenuVisible &&
								<Menu
									visible={menuShow}
									onDismiss={() => toggleMenu(false)}
									anchor={
										<Entypo onPress={() => toggleMenu(true)} name='dots-three-vertical' size={20} />
									}
								>
									<Menu.Item onPress={() => { }} title="Done" />
									<Menu.Item onPress={() => { }} title="Cancel" />
								</Menu>
							}
						</View>
						<View style={{ marginTop: 10, height: 120 }}>
							<Text style={styles.agentText}> Agent Name </Text>
							<Text numberOfLines={1} style={styles.labelText}>{data.user ? data.user.firstName : '- - -'} {data.user ? data.user.lastName : '- - -'}</Text>
							{
								showCheckBoxes ?
									<View style={{ marginTop: 20, marginRight: 15 }}>
										<CheckBox onPress={() => { this.props.addProperty(data) }} color={AppStyles.colors.primaryColor} checked={data.checkBox} />
									</View>
									:
									null
							}
							<View style={{ flexDirection: 'row-reverse', height: 60 }}>
								{/* <View style={{ flex: 1 }}></View> */}
								<FontAwesome onPress={() => { helper.callNumber(phoneNumber) }} style={{ paddingTop: 25, paddingRight: 0 }} name="phone" size={30} color={AppStyles.colors.subTextColor} />
							</View>
						</View>
					</View>
				</View>


			</TouchableOpacity>
		)
	}
}

export default InventoryTile;