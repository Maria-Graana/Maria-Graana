import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import styles from './style'
import AppStyles from '../../AppStyles'
import phone from '../../../assets/img/phone.png'
import PropertyImg from '../../../assets/img/property.jpg'
class LeadTile extends React.Component {
  constructor(props) {
    super(props)
  }



  render() {

    const { showDropdown, navigateTo, dotsDropDown, selectInventory, data, selectedInventory, dropDownId, unSelectInventory, goToInventoryForm } = this.props
    return (
      <TouchableOpacity
        onPress={() => { this.props.navigateTo() }}
        onLongPress={() => !selectedInventory.includes(data.id) ? selectInventory(data.id) : unSelectInventory(data.id)}>

        <View style={[styles.tileMainWrap, selectedInventory.includes(data.id) && styles.selectedInventory]}>

          <View style={[styles.leftimgView]}>
            <Image source={PropertyImg} style={[styles.propertyImg]} />
          </View>
          <View style={[styles.rightContentView]}>
            <View style={styles.topIcons}>
              <View>
                <Text style={[styles.tokenLabel, AppStyles.mrFive]}>
                  To-Do
												</Text>
              </View>
              <View>
                <Image
                  style={[styles.fireIcon, AppStyles.mlFive]}
                  source={phone}
                />
              </View>
            </View>

            <View style={[styles.contentMainWrap]}>
              {/* ****** Name Wrap */}
              <View style={[styles.contentMain, AppStyles.mbTen]}>
                <Text style={[styles.largeText, AppStyles.darkColor]}>
                  Ahsan khan
												</Text>
              </View>

              {/* ****** Price Wrap */}
              <View style={[styles.contentMultiMain, AppStyles.mbFive]}>
                <Text style={[styles.priceText, styles.multiColumn, AppStyles.darkColor, AppStyles.mrTen]}>
                  PKR
            						</Text>
                <Text style={[styles.priceText, styles.multiColumn, styles.priceColor]}>
                  2 Crore - 5 Crore
            						</Text>
              </View>

              {/* ****** Address Wrap */}
              <View style={[styles.contentMultiMain, AppStyles.mbFive]}>
                <Text style={[styles.normalText, AppStyles.darkColor, AppStyles.mrTen]}>
                  12 Marla hous for sale
            						</Text>
              </View>

              {/* ****** Location Wrap */}
              <View style={[styles.contentMultiMain, AppStyles.mbFive]}>
                <Text style={[styles.normalText, AppStyles.darkColor, AppStyles.mrTen]}>
                  F-10 Markaz, Islamabad
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