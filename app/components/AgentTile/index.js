import React from 'react'
import { View, Text, Image, TouchableOpacity, } from 'react-native'
import styles from './style'
import AppStyles from '../../AppStyles'
import { Ionicons, FontAwesome, Entypo } from '@expo/vector-icons';
import { CheckBox } from 'native-base';
import helper from '../../helper'
import { Menu } from 'react-native-paper';

class InventoryTile extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			menuShow: false
		}
	}

	_renderItem = (item) => {
		return (
			<Image style={styles.noImage} source={{ uri: item.item }} />
		)
	}

	toggleMenu = (val) => {
		this.setState({ menuShow: val })
	}

	displayName = (organization, data) => {
       if(organization !== 'arms'){
            if(data.user){
                return data.user.first_name + ' ' + data.user.last_name;
			}
			else{
                 return '- - -';
			}
	   }
	   else{
          if(data.user){
			return data.user.firstName + ' ' + data.user.lastName;
		  }
		  else{
			return '- - -';
		  }
	   }
	}

	render() {
		const { data, isMenuVisible, showCheckBoxes, organization } = this.props
		const { menuShow } = this.state
		let phoneNumber = null
		let agentName = data ? this.displayName(organization, data) : '';
		if (organization !== 'arms') phoneNumber = data.user ? data.user.phone : null
		else phoneNumber = data.user ? data.user.phoneNumber : null
		let show = isMenuVisible
		if (isMenuVisible) {
			if (data.diaries && data.diaries.length) {
				if (data.diaries[0].status === 'completed') show = false
			}
		}
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
					<View style={[AppStyles.mb1, styles.pad5, { paddingBottom: 2, justifyContent: 'space-between' }]}>
						<View>
							<Text style={styles.currencyText}> PKR  <Text style={styles.priceText}>{data.price}</Text> </Text>
							<Text numberOfLines={1} style={styles.marlaText}> {data.size} {data.size_unit} {data.subtype && helper.capitalize(data.subtype)} For {data.purpose && helper.capitalize(data.purpose)} </Text>
							<Text numberOfLines={1} style={styles.addressText}> {data.area ? data.area.name + ', ' : null} {data.city ? data.city.name : null} </Text>
						</View>
						<View style={styles.iconContainer}>
							<View style={[styles.iconInner, { paddingBottom: 0 }]}>
								<Ionicons name="ios-bed" size={25} color={AppStyles.colors.subTextColor} />
								<Text style={{ fontSize: 18 }}> {data.bed} </Text>
							</View>
							<View style={[styles.iconInner, { paddingBottom: 0 }]}>
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
								show ?
									<Menu
										visible={menuShow}
										onDismiss={() => this.toggleMenu(false)}
										anchor={
											<Entypo onPress={() => this.toggleMenu(true)} name='dots-three-vertical' size={20} />
										}
									>
										{
											data.diaries && data.diaries.length && data.diaries[0].status === 'pending' ?
												<View>
													<Menu.Item onPress={() => { this.props.doneViewing(data) }} title="Viewing done" />
													<Menu.Item onPress={() => { this.props.cancelViewing(data) }} title="Cancel Viewing" />
												</View>
												:
												<Menu.Item onPress={() => { this.props.deleteProperty(data) }} title="Remove from the list" />
										}
									</Menu>
									:
									null
							}
							{
								showCheckBoxes ?
									<View style={{ marginTop: 5, marginRight: 15 }}>
										<CheckBox onPress={() => { this.props.addProperty(data) }} color={AppStyles.colors.primaryColor} checked={data.checkBox} />
									</View>
									:
									null
							}
						</View>
						<View style={{ marginTop: 10, height: 125, justifyContent: 'space-between' }}>
							<View>
								<Text style={styles.agentText}> Agent Name </Text>
						<Text numberOfLines={1} style={styles.labelText}>{agentName}</Text>
							</View>
							<View style={{ flexDirection: 'row-reverse' }}>
								{/* <View style={{ flex: 1 }}></View> */}
								<FontAwesome onPress={() => { helper.callNumber(`tel:${phoneNumber}`) }} style={{ paddingTop: 40, paddingRight: 0 }} name="phone" size={30} color={AppStyles.colors.subTextColor} />
							</View>
						</View>
					</View>
				</View>


			</TouchableOpacity>
		)
	}
}

export default InventoryTile;
