/** @format */

// import PropMap from '@graana/react-native-graana-maps'
import React, { Component } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { connect } from 'react-redux'
import WhiteArrow from '../../../assets/images/white-arrow.png'
import WhiteCheck from '../../../assets/images/white-check.png'
import { setAddPropertyParams } from '../../actions/property'
import config from '../../config'
import ManualMap from '../manualGeotagging'
import styles from './style'

class MapContainer extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showMapModal: false,
      markerLat: '',
      markerLong: '',
      locationMarked: false,
    }
  }

  // onMarkThisProperty = (item) => {
  //   const { mapValues, screenName } = this.props.route.params
  //   mapValues.lat = item.latitude
  //   mapValues.lng = item.longitude
  //   mapValues.propsure_id = item.propsure_id
  //   if (screenName === 'Graana.com') {
  //     this.props.navigation.navigate('InventoryTabs', {
  //       screen: screenName,
  //       params: { mapValues, fromScreen: 'mapContainer' },
  //     })
  //   } else {
  //     this.props.navigation.navigate(screenName, { mapValues, fromScreen: 'mapContainer' })
  //   }
  // }

  handleOnMark = (data) => {
    this.props.dispatch(
      setAddPropertyParams({
        longitude: data.longitude,
        latitude: data.latitude,
        propsure_id: data.propsure_id,
      })
    )
    alert('Property Info updated')
    this.props.navigation.navigate('Main')
  }

  handleOnMarkerCreate = (data) => {
    this.props.dispatch(
      setAddPropertyParams({
        longitude: data.longitude,
        latitude: data.latitude,
      })
    )
    this.setState({
      markerLat: data.latitude,
      markerLong: data.longitude,
      showMapModal: true,
    })
  }

  componentDidMount() {
    this.props.navigation.setOptions({
      title:
        this.props.route.params?.geotaggingType === 'PROPSURE'
          ? 'PROPSURE GEOTAGGING'
          : 'MANUAL GEOTAGGING',
    })

    if (
      this.props.addPropertyParams?.latitude &&
      this.props.route.params?.geotaggingType === 'Manual'
    ) {
      this.setState({
        markerLat: this.props.addPropertyParams.latitude,
        markerLong: this.props.addPropertyParams.longitude,
        showMapModal: true,
      })
    }
  }

  render() {
    const { mapValues } = this.props.route.params
    return (
      <View style={styles.map}>
        {this.props.route.params?.geotaggingType === 'Propsure' ? (
          <View/>
          // <PropMap
          //   production={config.channel === 'production' ? true : false}
          //   mapUrl={config.graanaUrl}
          //   mapValues={mapValues.propsure_id ? mapValues : null}
          //   onMark={this.handleOnMark}
          //   onMarkerCreate={() => {}}
          // />
        ) : (
          <ManualMap onMarkerCreate={this.handleOnMarkerCreate} />
        )}
        {this.state.showMapModal ? (
          <View style={styles.coordinatesContainer}>
            <View style={styles.mapModalContainer}>
              <Image source={WhiteArrow} style={styles.whiteArrow} />
            </View>
            <Text style={styles.coordinatesText}>
              Coordinates: {this.state.markerLat}, {this.state.markerLong}
            </Text>
            <TouchableOpacity
              style={styles.markLocationBtnContainer}
              onPress={() => {
                if (this.state.locationMarked) {
                  this.props.dispatch(
                    setAddPropertyParams({
                      latitude: this.state.markerLat,
                      longitude: this.state.markerLong,
                      propsure_id: '',
                      locate_manually: true,
                    })
                  )
                  this.props.navigation.goBack()
                  // )
                } else {
                  this.setState({ locationMarked: true }, () =>
                    this.props.navigation.setOptions({
                      headerRight: () => (
                        <TouchableOpacity
                          style={{ marginHorizontal: 13 }}
                          onPress={() => {
                            this.props.dispatch(
                              setAddPropertyParams({
                                latitude: this.state.markerLat,
                                longitude: this.state.markerLong,
                                propsure_id: '',
                                locate_manually: true,
                              })
                            )
                            this.props.navigation.goBack()
                          }}
                        >
                          <Text style={{ color: '#0F73EE' }}>DONE</Text>
                        </TouchableOpacity>
                      ),
                    })
                  )
                }
              }}
            >
              {this.state.locationMarked ? (
                <>
                  <Text style={{ color: '#fff', fontSize: 16 }}>GEOTAGGED</Text>
                  <Image source={WhiteCheck} style={styles.whiteCheck} />
                </>
              ) : (
                <Text style={styles.markLocationText}>MARK THIS LOCATION</Text>
              )}
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    )
  }
}

export default connect((store) => {
  return {
    addPropertyParams: store.property.addPropertyParams,
  }
})(MapContainer)
