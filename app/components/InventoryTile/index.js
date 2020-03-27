import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import styles from './style'
import AppStyles from '../../AppStyles'
import fire from '../../../assets/images/fire.png'
import phone from '../../../assets/images/phone.png'
import { MaterialCommunityIcons } from '@expo/vector-icons';
class InventoryTile extends React.Component {
  constructor(props) {
    super(props)
  }



  render() {

    const { showDropdown, navigateTo, dotsDropDown, selectInventory, data, selectedInventory, dropDownId, unSelectInventory, goToInventoryForm } = this.props
    return (
      <TouchableOpacity 
      onPress={(data) => navigateTo(data)}
      onLongPress={() => !selectedInventory.includes(data.id) ? selectInventory(data.id) : unSelectInventory(data.id)}>
        <View style={[styles.tileMainWrap, selectedInventory.includes(data.id) && styles.selectedInventory]}>
          <View style={styles.topIcons}>
            <View>
              <Text style={[styles.tokenLabel, AppStyles.mrFive, AppStyles.whiteColor]}>
                {data.action}
          </Text>
            </View>
            <View>
              <Image
                style={[styles.fireIcon, AppStyles.mlFive]}
                source={fire}
              />
            </View>
            <View style={styles.dropDownParent}>
              <TouchableOpacity onPress={() => { showDropdown(data.id) }}>
                <MaterialCommunityIcons name="dots-vertical" size={32} color="#333" style={styles.verticalIcon} />
              </TouchableOpacity>
              {
                dotsDropDown === true && dropDownId === data.id &&
                <View style={styles.dropDownWrap}>
                  <TouchableOpacity style={styles.dropButtons} onPress={() => {goToInventoryForm()}}>
                    <Text style={[AppStyles.lightColor, AppStyles.noramlSize]}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.dropButtons, AppStyles.noBorder]}>
                    <Text style={[AppStyles.lightColor, AppStyles.noramlSize]}>Deactivate</Text>
                  </TouchableOpacity>
                </View>
              }
            </View>

          </View>
          <View style={[styles.contentMainWrap]}>
            <View style={styles.phoneWrap}>
              <Image
                style={styles.phoneIcon}
                source={phone}
              />
            </View>
            {/* ****** Name Wrap */}
            <View style={[styles.contentMain, AppStyles.mbTen]}>
              <Text style={[styles.largeText, AppStyles.darkColor]}>
                {data.propertyName}
            </Text>
            </View>

            {/* ****** Price Wrap */}
            <View style={[styles.contentMultiMain, AppStyles.mbFive]}>
              <Text style={[styles.normalText, styles.multiColumn, AppStyles.darkColor, AppStyles.mrTen]}>
                Price
            </Text>
              <Text style={[AppStyles.lightColor, styles.multiColumn, styles.normalText]}>
                {data.price}
            </Text>
            </View>

            {/* ****** Address Wrap */}
            <View style={[styles.contentMultiMain, AppStyles.mbFive]}>
              <Text style={[styles.normalText, AppStyles.darkColor, AppStyles.mrTen]}>
                Address
            </Text>
              <Text style={[AppStyles.lightColor, styles.normalText]}>
                {data.address}
            </Text>
            </View>

            {/* ****** Location Wrap */}
            <View style={[styles.contentMultiMain, AppStyles.mbFive]}>
              <Text style={[styles.normalText, AppStyles.darkColor, AppStyles.mrTen]}>
                Location
            </Text>
              <Text style={[AppStyles.lightColor, styles.normalText]}>
                {data.location}
            </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

export default InventoryTile;