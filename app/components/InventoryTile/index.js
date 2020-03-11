import React from 'react'
import { View, Text, Image } from 'react-native'
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
    return (
      <View style={styles.tileMainWrap}>
        <View style={styles.topIcons}>
          <View>
            <Text style={[styles.tokenLabel, AppStyles.mrFive, AppStyles.whiteColor]}>
              Deal Done
          </Text>
          </View>
          <View>
            <Image
              style={[styles.fireIcon, AppStyles.mlFive]}
              source={fire}
            />
          </View>
          <View>
            <MaterialCommunityIcons name="dots-vertical" size={32} color="#333" style={styles.verticalIcon} />
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
            20 marla house for sale 
            </Text>
          </View>

          {/* ****** Price Wrap */}
          <View style={[styles.contentMultiMain, AppStyles.mbFive]}>
            <Text style={[styles.normalText, styles.multiColumn, AppStyles.darkColor, AppStyles.mrTen]}>
              Price
            </Text>
            <Text style={[AppStyles.lightColor, styles.multiColumn, styles.normalText]}>
              3.3 Crore
            </Text>
          </View>

          {/* ****** Address Wrap */}
          <View style={[styles.contentMultiMain, AppStyles.mbFive]}>
            <Text style={[styles.normalText, AppStyles.darkColor, AppStyles.mrTen]}>
              Address
            </Text>
            <Text style={[AppStyles.lightColor, styles.normalText]}>
              G/11, Islamabad
            </Text>
          </View>

          {/* ****** Location Wrap */}
          <View style={[styles.contentMultiMain, AppStyles.mbFive]}>
            <Text style={[styles.normalText, AppStyles.darkColor, AppStyles.mrTen]}>
              Location
            </Text>
            <Text style={[AppStyles.lightColor, styles.normalText]}>
              Description
            </Text>
          </View>
        </View>
      </View>
    )
  }
}

export default InventoryTile;