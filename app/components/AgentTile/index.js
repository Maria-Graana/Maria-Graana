import React from 'react'
import { View, Text, Image, TouchableOpacity, } from 'react-native'
import styles from './style'
import AppStyles from '../../AppStyles'
import { Ionicons, FontAwesome } from '@expo/vector-icons';

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
		const { data } = this.props
		const imagesList = ['https://pickaface.net/gallery/avatar/unr_ironman_170308_2112_9ldw5b.png']
		return (
			<TouchableOpacity
				onLongPress={() => { }}
			>
				<View style={styles.tileContainer}>
					<View style={[AppStyles.mb1, styles.pad5]}>
						<Text style={styles.currencyText}> PKR  <Text style={styles.priceText}>{data.price}</Text> </Text>
						<Text style={styles.marlaText}> {data.size} {data.size_unit} House For Sale </Text>
						<Text style={styles.addressText}> F-10 Markaz, Islamabad </Text>
						<View style={styles.iconContainer}>
							<View style={styles.iconInner}>
								<Ionicons name="ios-bed" size={20} color={AppStyles.colors.primaryColor} />
								<Text> {data.bed} </Text>
							</View>
							<View style={styles.iconInner}>
								<FontAwesome name="bath" size={17} color={AppStyles.colors.primaryColor} />
								<Text> {data.bath} </Text>
							</View>
						</View>
					</View>
					<View style={styles.underLine} />
					<View style={[styles.pad5, {marginTop: 10}]}>
						<Text style={styles.agentText}> Agent Name </Text>
						<Text style={styles.labelText}> {data.armsuser.firstName} {data.armsuser.lastName}</Text>
						<Text style={styles.agentText}> Contact No </Text>
						<Text style={styles.labelText}> {data.armsuser.phoneNumber} </Text>
					</View>
				</View>
			</TouchableOpacity>
		)
	}
}

export default InventoryTile;