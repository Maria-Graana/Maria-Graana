import React from 'react'
import { View, Text, Image, TouchableOpacity, } from 'react-native'
import styles from './style'
import AppStyles from '../../AppStyles'
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import Carousel from 'react-native-snap-carousel';

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
		const { } = this.props
		const imagesList = ['https://pickaface.net/gallery/avatar/unr_ironman_170308_2112_9ldw5b.png']
		return (
			<TouchableOpacity
				onLongPress={() => { }}
			>
				<View style={styles.tileContainer}>
					<View style={[styles.pad5]}>
						{
							imagesList.length ?
								<Carousel
									// ref={(c) => { this._carousel = c; }}
									data={imagesList}
									renderItem={this._renderItem}
									sliderWidth={110}
									itemWidth={110}
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
					<View style={[AppStyles.mb1, styles.pad5]}>
						<Text style={styles.currencyText}> PKR  <Text style={styles.priceText}>2.1 Crore</Text> </Text>
						<Text style={styles.marlaText}> 12 Marla House For Sale </Text>
						<Text style={styles.addressText}> F-10 Markaz, Islamabad </Text>
						<View style={styles.iconContainer}>
							<View style={styles.iconInner}>
								<Ionicons name="ios-bed" size={20} color={AppStyles.colors.primaryColor} />
								<Text> 4 </Text>
							</View>
							<View style={styles.iconInner}>
								<FontAwesome name="bath" size={17} color={AppStyles.colors.primaryColor} />
								<Text> 4 </Text>
							</View>
						</View>
					</View>
					<View style={styles.phoneIcon}>
						<FontAwesome name="phone" size={25} color={AppStyles.colors.primaryColor} />
					</View>
				</View>
			</TouchableOpacity>
		)
	}
}

export default InventoryTile;