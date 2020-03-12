import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import styles from './style'
import AppStyles from '../../AppStyles'
class LeadTile extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { data } = this.props
    return (
      <TouchableOpacity>
        <View style={styles.tileMainWrap}>
          <View style={[styles.contentMainWrap]}>

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

export default LeadTile;