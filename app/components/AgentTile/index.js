import React from 'react'
import { View, Text, Image, TouchableOpacity, } from 'react-native'
import styles from './style'
import AppStyles from '../../AppStyles'
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { CheckBox } from 'native-base';

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
		const { data, showCheckBoxes } = this.props
		return (
			<TouchableOpacity
				style={{ flexDirection: "row" }}
				onLongPress={() => {
					this.props.displayChecks()
					this.props.addProperty(data)
				}}
				onPress={ () => {this.props.addProperty(data)}}
			>
				<View style={styles.tileContainer}>
					<View style={[AppStyles.mb1, styles.pad5]}>
						<Text style={styles.currencyText}> PKR  <Text style={styles.priceText}>{data.price}</Text> </Text>
						<Text style={styles.marlaText}> {data.size} {data.size_unit} House For Sale </Text>
						<Text style={styles.addressText}> F-10 Markaz, Islamabad </Text>
						<View style={styles.iconContainer}>
							<View style={styles.iconInner}>
								<Ionicons name="ios-bed" size={20} color={AppStyles.colors.subTextColor} />
								<Text> {data.bed} </Text>
							</View>
							<View style={styles.iconInner}>
								<FontAwesome name="bath" size={17} color={AppStyles.colors.subTextColor} />
								<Text> {data.bath} </Text>
							</View>
						</View>
					</View>
					<View style={styles.underLine} />
					<View style={[styles.pad5, { marginTop: 10 }]}>
						<Text style={styles.agentText}> Agent Name </Text>
						<Text style={styles.labelText}> {data.user ? data.user.firstName : '- - -'} {data.user ? data.user.lastName : '- - -'}</Text>
						<Text style={styles.agentText}> Contact No </Text>
						<Text style={styles.labelText}> {data.user ? data.user.phoneNumber : '- - -'} </Text>
					</View>
				</View>
				{
					showCheckBoxes ?
						<View style={{ marginTop: 20, marginRight: 10 }}>
							<CheckBox color={AppStyles.colors.primaryColor} checked={data.checkBox} />
						</View>
						:
						null
				}

			</TouchableOpacity>
		)
	}
}

export default InventoryTile;