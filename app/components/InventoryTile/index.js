import React from 'react'
import { View, Text } from 'react-native'
import styles from './style'
import AppStyles from '../../AppStyles'

class InventoryTile extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <View style={styles.tileMainWrap}>
        <View style={styles.topIcons}>
          <Text style={[styles.tokenLabel, AppStyles.mrFive, AppStyles.whiteColor]}>
            Deal Done
          </Text>
        </View>
        <View style={[styles.contentMainWrap]}>
          {/* ****** Name Wrap */}
          <View style={[styles.contentMain, AppStyles.mbTen]}>
            <Text style={[styles.largeText, AppStyles.darkColor]}>
              Property Name
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