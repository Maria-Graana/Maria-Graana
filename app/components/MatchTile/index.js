import React from 'react'
import { View, Text, Image, TouchableOpacity, } from 'react-native'
import styles from './style'
import AppStyles from '../../AppStyles'
import helper from '../../helper'
import { Ionicons, FontAwesome, Entypo, Feather } from '@expo/vector-icons';
import Carousel from 'react-native-snap-carousel';
import { CheckBox } from 'native-base';
import { Menu,Divider} from 'react-native-paper';


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
		const { data, isMenuVisible,menuShow, showCheckBoxes, organization, toggleMenu } = this.props
		let imagesList = []
		let phoneNumber = null
		if ('armsPropertyImages' in data && data.armsPropertyImages !== undefined) {
			if (data.armsPropertyImages.length > 0) {
				imagesList = data.armsPropertyImages.map((item) => {
					return item.url
				})
			}
		}

		if (organization !== 'arms') phoneNumber = data.user ? data.user.phone : null
		else phoneNumber = data.user.phoneNumber

		return (
			<TouchableOpacity style={{ flexDirection: 'row', marginVertical: 2 }}
				onLongPress={() => {
					this.props.displayChecks()
					this.props.addProperty(data)
				}}
				onPress={() => { this.props.addProperty(data) }}
			>
				<View style={styles.tileContainer}>
					<View style={[styles.pad5]}>
						{
							imagesList.length ?
								<Carousel
									// ref={(c) => { this._carousel = c; }}
									data={imagesList}
									renderItem={this._renderItem}
									sliderWidth={130}
									itemWidth={130}
									enableSnap={true}
									enableMomentum={false}
									autoplay={true}
									lockScrollWhileSnapping={true}
									autoplayDelay={3000}
									loop={true}
									containerCustomStyle={{ position: 'relative' }}
								/>
								:
								<Image
									source={require('../../../assets/images/no-image-found.png')}
									style={styles.noImage}
								/>
						}
					</View>
					<View style={styles.imageCountViewStyle}>
						<Feather name={'camera'} color={'#fff'} size={16} />
						<Text style={styles.imageCount}>{data.armsPropertyImages && data.armsPropertyImages.length}</Text>
					</View>
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
					<View style={styles.phoneIcon}>
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
						<View style={{ flexDirection: 'row-reverse' }}>
							<FontAwesome onPress={() => { helper.callNumber(phoneNumber) }} name="phone" size={30} color={AppStyles.colors.subTextColor} />
						</View>
					</View>
				</View>
				{
					showCheckBoxes ?
						<View style={{ marginRight: 5, marginTop: 5 }}>
							<CheckBox onPress={() => { this.props.addProperty(data) }} color={AppStyles.colors.primaryColor} checked={data.checkBox} />
						</View>
						:
						null
				}
			</TouchableOpacity>
		)
	}
}

export default InventoryTile;