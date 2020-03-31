import React from 'react'
import { View, Text, Image, TouchableOpacity, } from 'react-native'
import styles from './style'
import AppStyles from '../../AppStyles'
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import Carousel from 'react-native-snap-carousel';
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
		const { data } = this.props
		const imagesList = ['https://i.ytimg.com/vi/JvkrkSpVYg0/maxresdefault.jpg', 'https://4.bp.blogspot.com/--aHpPUF-b9Y/WFzfPaRg7EI/AAAAAAAAAE0/t050gnUwxfIOxyGnpBWupvXXpXCapScfACLcB/s1600/unique-beautiful-houses-on-home-garden-with-beautiful-beautiful-home-designs-in-kerala-beautiful-home-design-in-india-1024x680.jpg', 'https://beautyharmonylife.com/wp-content/uploads/2013/08/558084_455703801173433_581948460_n.jpg']
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
					<View style={styles.phoneIcon}>
						<FontAwesome name="phone" size={25} color={AppStyles.colors.subTextColor} />
					</View>
				</View>
				<View style={{ flex: 1 }}>
					<CheckBox color={AppStyles.colors.primaryColor} checked={true} />
				</View>
			</TouchableOpacity>
		)
	}
}

export default InventoryTile;