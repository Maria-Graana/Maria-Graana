/**@format */

import React, { Component } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import PropMap from '@graana/react-native-graana-maps'
import config from '../../config'

class MapContainer extends Component {
  constructor() {
    super()
  }

  onMarkThisProperty = (item) => {
    const { mapValues, screenName } = this.props.route.params
    mapValues.lat = item.latitude
    mapValues.lng = item.longitude
    mapValues.propsure_id = item.propsure_id
    if (screenName === 'Graana.com') {
      this.props.navigation.navigate('InventoryTabs', {
        screen: screenName,
        params: { screen: 'InventoryTabs', fromScreen: 'mapContainer', mapValues },
      })
    } else {
      this.props.navigation.navigate(screenName, { mapValues, fromScreen: 'mapContainer' })
    }
  }

  render() {
    const { mapValues } = this.props.route.params
    return (
      <View style={styles.map}>
        <PropMap
          production={config.channel === 'production' ? true : false}
          mapValues={mapValues.propsure_id ? mapValues : null}
          onMark={this.onMarkThisProperty}
        />
      </View>
    )
  }
}

export default MapContainer

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
})
