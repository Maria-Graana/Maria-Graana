import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import styles from './style'
import AppStyles from '../../AppStyles'
import phone from '../../../assets/img/phone2.png'
import PropertyImg from '../../../assets/img/property.jpg'
class LeadTile extends React.Component {
  constructor(props) {
    super(props)
  }



  render() {

    const { selectInventory, data, selectedInventory, unSelectInventory, navigateTo, callNumber } = this.props
    return (
      <TouchableOpacity onPress={() => { navigateTo(data) }} onLongPress={() => !selectedInventory.includes(data.id) ? selectInventory(data.id) : unSelectInventory(data.id)}>

        <View style={[styles.tileMainWrap, selectedInventory.includes(data.id) && styles.selectedInventory]}>

          {/* <View style={[styles.leftimgView]}>
            <Image source={PropertyImg} style={[styles.propertyImg]} />
          </View> */}
          <View style={[styles.rightContentView]}>
            <View style={styles.topIcons}>
              <View>
                <Text style={[styles.tokenLabel, AppStyles.mrFive]}>
                  {data.status}
                </Text>
              </View>
              <View>
                <TouchableOpacity style={styles.actionBtn} onPress={() => { callNumber(`tel:${data.customer && data.customer.phone}`) }}>
                  <Image
                    style={[styles.fireIcon, AppStyles.mlFive]}
                    source={phone}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.contentMainWrap]}>
              {/* ****** Name Wrap */}
              <View style={[styles.contentMain, AppStyles.mbTen]}>
                <Text style={[styles.largeText, AppStyles.darkColor]}>
                  {data.customer && data.customer.customerName}
                </Text>
              </View>

              {/* ****** Price Wrap */}
              <View style={[styles.contentMultiMain, AppStyles.mbFive]}>
                <Text style={[styles.priceText, styles.multiColumn, AppStyles.darkColor, AppStyles.mrTen]}>
                  PKR
            						</Text>
                <Text style={[styles.priceText, styles.multiColumn, styles.priceColor]}>
                  {
                    data.price != null ? data.price : ''
                  }
                  {
                    data.maxPrice && data.maxPrice != null && data.maxPrice
                  }
                </Text>
              </View>

              {/* ****** Address Wrap */}
              <View style={[styles.contentMultiMain, AppStyles.mbFive]}>
                {
                  data.size != null &&
                  <Text style={[styles.normalText, AppStyles.darkColor, AppStyles.mrTen]}>
                    {data.size} {data.size_unit} {data.type} {data.purpose != null && 'for'} {data.purpose}
                  </Text>
                }
              </View>

              {/* ****** Location Wrap */}
              <View style={[styles.contentMultiMain, AppStyles.mbFive]}>
                <Text style={[styles.normalText, AppStyles.darkColor, AppStyles.mrTen]}>
                  f/12 Markaz, {data.city && data.city.name}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

export default LeadTile;