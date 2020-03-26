import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { Feather, Ionicons, FontAwesome, Foundation } from '@expo/vector-icons'
import styles from './style'
import AppStyles from '../../AppStyles'
import { formatPrice } from '../../PriceFormate'

const PlaceHolderImage = require('../../../assets/img/img-3.png')

class InventoryTile extends React.Component {
  constructor(props) {
    super(props)
  }

  onPress = () => {

  }

  onLongPress = (id) => {
    this.props.onLongPress(id);
  }


  render() {
    const { onPress, onLongPress, data } = this.props;
    return (
      <TouchableOpacity onPress={this.onPress} onLongPress={() => this.onLongPress(data.id)} activeOpacity={0.7}>
        <View style={styles.mainContainer}>

          <Image style={styles.imageStyle} source={PlaceHolderImage} />
          <View style={styles.imageCountViewStyle}>
            <Feather name={'camera'} color={'#fff'} size={16} />
            <Text style={styles.imageCount}>{data.armsPropertyImages.length}</Text>
          </View>

          <View style={{ flex: 1, flexDirection: 'column', paddingLeft: 15 }}>

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


            <View style={styles.bedBathViewStyle}>
              <Ionicons name={'ios-bed'} color={AppStyles.colors.subTextColor} size={18} />
              <Text style={styles.bedTextStyle}>
                {data.bed}
              </Text>
              <FontAwesome style={{ paddingLeft: 8 }} name={'bathtub'} color={AppStyles.colors.subTextColor} size={18} />
              <Text
                style={styles.bedTextStyle}>
                {data.bath}
              </Text>
            </View>

          </View>

          <Foundation name={'telephone'} color={AppStyles.colors.subTextColor} size={32} style={styles.phoneButton} />

        </View>
      </TouchableOpacity>

    )
  }
}

export default InventoryTile;