import React from 'react'
import { View, Text, Image, TouchableOpacity, } from 'react-native'
import styles from './style'
import AppStyles from '../../AppStyles'
import helper from '../../helper'
import { Ionicons, FontAwesome, Entypo, Feather } from '@expo/vector-icons';
import Carousel from 'react-native-snap-carousel';
import { CheckBox } from 'native-base';
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

	render() {
		const { data, isMenuVisible, showCheckBoxes } = this.props
		const { menuShow } = this.state
		let imagesList = []
		let show = isMenuVisible
		let phoneNumber = null

		if (data.images.length > 0) {
			imagesList = data.images.map((item) => {
				return item.url
			})
		}
		if (isMenuVisible) {
			if (data.diaries && data.diaries.length) {
				if (data.diaries[0].status === 'completed') show = false
			}
		}
		if (data.graana_id) phoneNumber = data.user ? data.user.phone : null
		else phoneNumber = data.user && data.user.phoneNumber ? data.user.phoneNumber : null

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
					<View style={styles.phoneIcon}>
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
								<View style={{ marginRight: 15, marginTop: 5 }}>
									<CheckBox onPress={() => { this.props.addProperty(data) }} color={AppStyles.colors.primaryColor} checked={data.checkBox} />
								</View>
								:
								<View />
						}
						<View style={{ flexDirection: 'row-reverse' }}>
							<FontAwesome onPress={() => { helper.callNumber(`tel:${phoneNumber}`) }} name="phone" size={30} color={AppStyles.colors.subTextColor} />
						</View>
					</View>
				</View>

			</TouchableOpacity>
		)
	}
}

export default InventoryTile;
