import { Feather, FontAwesome, Foundation, Ionicons } from '@expo/vector-icons'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import AppStyles from '../../AppStyles'
import Carousel from 'react-native-snap-carousel';
import React from 'react'
import _ from 'underscore';
import { formatPrice } from '../../PriceFormate'
import styles from './style'

class InventoryTile extends React.Component {
  constructor(props) {
    super(props)
  }

  onPress = (data) => {
    this.props.onPress(data)
  }

  onLongPress = (id) => {
    this.props.onLongPress(id);
  }


  _renderItem = (item) => {
    return (
      <Image style={styles.imageStyle} source={{ uri: item.item.url }} />
    )
  }

  render() {
    const { data, onCall } = this.props;
    const imagesList = data.armsPropertyImages;
    //console.log(data);
    return (
      <TouchableOpacity style={styles.mainContainer} onPress={() => this.onPress(data)} onLongPress={() => this.onLongPress(data.id)} activeOpacity={0.7}>
        <View>
          {
            imagesList.length ?
              <Carousel 
                // ref={(c) => { this._carousel = c; }}
                data={imagesList}
                renderItem={this._renderItem}
                sliderWidth={wp('34%')}
                itemWidth={wp('33%')}
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
                style={styles.imageStyle}
              />
          }
        </View>

        <View style={styles.imageCountViewStyle}>
          <Feather name={'camera'} color={'#fff'} size={16} />
          <Text style={styles.imageCount}>{data.armsPropertyImages.length}</Text>
        </View>

        <View style={{ width: wp('60%') }}>

          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.currencyTextStyle}>PKR</Text>
            <Text style={styles.priceTextStyle} numberOfLines={1}>{formatPrice(data.price)}</Text>
          </View >

          <Text style={styles.textControlStyle} numberOfLines={1}>
            {`${data.size} ${data.size_unit.charAt(0).toUpperCase() + data.size_unit.slice(1)} ${data.subtype.charAt(0).toUpperCase() + data.subtype.slice(1)} for ${data.purpose.charAt(0).toUpperCase() + data.purpose.slice(1)}`}
          </Text>

          <Text style={[styles.textControlStyle, { fontFamily: AppStyles.fonts.lightFont }]} numberOfLines={1}>
            {`${data.area.name}, ${data.city.name}`}
          </Text>

          {
            data.type === 'residential' &&
            <View style={styles.bedBathViewStyle}>
              <Ionicons name={'ios-bed'} color={AppStyles.colors.subTextColor} size={18} />
              <Text style={styles.bedTextStyle}>
                {data.bed === null ? '0' : String(data.bed)}
              </Text>
              <FontAwesome style={{ paddingLeft: 8 }} name={'bathtub'} color={AppStyles.colors.subTextColor} size={18} />
              <Text
                style={styles.bedTextStyle}>
                {data.bath === null ? '0' : String(data.bath)}
              </Text>
            </View>
          }



        </View>
        {
          data.customer && data.customer.phone !== '' ?
          <View style={{position: "absolute", bottom:5, left: wp('82%')}}>
            <Foundation name={'telephone'} onPress={() => onCall(data.customer.phone)} color={AppStyles.colors.subTextColor} size={30} style={styles.phoneButton} />
            </View>
            :
            null
        }


      </TouchableOpacity>

    )
  }
}

export default InventoryTile;