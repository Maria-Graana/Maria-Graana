/**@format */
import axios from 'axios'
import * as Location from 'expo-location'
import React, { Component } from 'react'
import {
  Dimensions,
  Image,
  Keyboard,
  LogBox,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { connect } from 'react-redux'
import Toast from 'react-native-easy-toast'
import MapView, { Marker } from 'react-native-maps'
import GpsIcon from './GpsIcon'
import styles from './style'
import helper from '../../helper'

const { width, height } = Dimensions.get('screen')

const ASPECT_RATIO = width / height

const latitudeDelta = 0.12
const longitudeDelta = latitudeDelta * ASPECT_RATIO

const mapRef = React.createRef()
class ManualMap extends Component {
  showToast = (message) => {
    // this.toast.show(message, DURATION.FOREVER)
    this.toast.show(message, 2000)
  }

  constructor() {
    super()
    this.state = {
      region: {
        latitudeDelta,
        longitudeDelta,
        longitude: 73.00400303676724,
        latitude: 33.700378559544006,
      },
      panding: false,

      cities: '',
      chosenCity: '',
      city_geometry: '',
      city_modal: false,

      housing_schemes: '',
      chosen_housing_scheme: '',
      housing_scheme_geometry: '',
      housing_scheme_modal: false,
      housing_scheme_search: '',
      filtered_housing_schemes: '',

      phase_sectors: '',
      chosen_phase_sector: '',
      phase_sector_geometry: '',
      phase_sector_modal: false,

      block_subsectors: '',
      chosen_block_subsector: '',
      block_subsector_modal: false,
      block_subsector_geometry: '',

      plots: '',
      chosen_plot: '',
      plots_unavailable: '',
      plot_geometry: '',
      loading_plots: false,
      loading_plots_by_point: false,
      marginBottom: 1,
      zoom: 5,
      marker_lat: 0,
      marker_long: 0,
      placesList: [],
      selectedPlaceId: '',
      placeSearch: '',
    }
  }

  componentDidMount() {
    this.getLocation()

    if (this.props.addPropertyParams?.latitude) {
      const region = {
        latitude: this.props.addPropertyParams.latitude,
        longitude: this.props.addPropertyParams.longitude,
        latitudeDelta,
        longitudeDelta,
      }
      this.setState({
        marker_lat: this.props.addPropertyParams.latitude,
        marker_long: this.props.addPropertyParams.longitude,
        region: region,
        placeSearch: '',
        placesList: [],
      })
      mapRef.current.animateToRegion(region, 500)
    }

    LogBox.ignoreLogs(['VirtualizedLists should never be nested'])
  }

  getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      alert(
        'Permission to access location was denied, please go to phone settings and give permission to ARMS app to continue'
      )
      return
    }
    const location = await Location.getCurrentPositionAsync({})
    const region = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.012,
      longitudeDelta: 0.01,
    }
    if (!this.props.addPropertyParams?.latitude) {
      mapRef.current.animateToRegion(region, 500)
    }
    this.setState({
      plots: '',
      chosen_plot: '',
      plot_geometry: '',
      loading_plots: false,
      plot_markers: '',
      loading_plots_by_point: false,
    })
  }

  getPlaces(val) {
    axios
      .get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${val}&radius=500&radius=500&key=AIzaSyAr0sQtYcNfPolIa-vGAgE4tGotE1vbl90`
      )
      .then((res) => {
        if (res.data?.predictions) {
          this.setState({ placesList: res.data.predictions })
        }
      })
      .catch((err) => {
        if (__DEV__) console.log(err)
      })
  }

  getLatLongbyPlaceID(id) {
    axios
      .get(
        `https://maps.googleapis.com/maps/api/place/details/json?placeid=${id}&key=AIzaSyAr0sQtYcNfPolIa-vGAgE4tGotE1vbl90`
      )
      .then((res) => {
        this.setState(
          {
            region: {
              latitudeDelta,
              longitudeDelta,
              longitude: res.data.result.geometry.location.lng,
              latitude: res.data.result.geometry.location.lat,
            },
          },
          () => {
            Keyboard.dismiss()
            mapRef.current.animateToRegion(this.state.region, 500)
          }
        )
        if (res.data?.result?.geometry) {
          this.setMarkerLatLong(
            res.data.result.geometry.location.lat,
            res.data.result.geometry.location.lng
          )
        }
      })
      .catch((err) => {
        if (__DEV__) console.log(err)
      })
  }

  onRegionChange = (region) => {
    //console.log('Region Change : ', region)
    // this.setState({
    //   region,
    //   panding: false,
    // })
    const zoom = Math.round(Math.log(360 / region.longitudeDelta) / Math.LN2)
    this.setState({
      zoom,
    })
  }

  setMarkerLatLong(lat, long) {
    this.setState({
      marker_lat: lat,
      marker_long: long,
      region: { latitude: lat, longitude: long, latitudeDelta, longitudeDelta },
      placeSearch: '',
      placesList: [],
    })
    this.props.onMarkerCreate({
      latitude: lat,
      longitude: long,
    })
  }

  onMapReady = () => this.setState({ marginBottom: 0 })

  render() {
    const { region, marker_lat, marker_long } = this.state

    return (
      <View style={styles.map}>
        <MapView
          ref={mapRef}
          style={styles.map}
          onMapReady={this.onMapReady}
          initialRegion={region}
          onRegionChangeComplete={(region) => {
            this.onRegionChange(region)
          }}
          showsCompass={false}
          showsUserLocation
          showsMyLocationButton={false}
          onPress={(event) =>
            this.setMarkerLatLong(
              event.nativeEvent.coordinate.latitude,
              event.nativeEvent.coordinate.longitude
            )
          }
        >
          {marker_lat && marker_long ? (
            <Marker
              pinColor="#3085d6"
              coordinate={{
                latitude: marker_lat,
                longitude: marker_long,
              }}
            />
          ) : null}
        </MapView>
        <View style={styles.searchInputWithResultsContainer}>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={{ flex: 1, height: 50, fontSize: 16 }}
              placeholder="Search"
              value={this.state.placeSearch}
              onChangeText={(val) =>
                this.setState({ placeSearch: val }, () => {
                  if (this.state.placeSearch.length > 2) this.getPlaces(val)
                })
              }
            />
            <TouchableOpacity onPress={() => this.setState({ placeSearch: '', placesList: [] })}>
              <Image
                source={require('../../../assets/images/cross.png')}
                style={styles.crossIcon}
              />
            </TouchableOpacity>
          </View>
          {this.state.placesList?.length ? (
            <ScrollView style={{ flex: 1, height: 200 }} keyboardShouldPersistTaps="always">
              {this.state.placesList.map((data) => (
                <TouchableOpacity onPress={() => this.getLatLongbyPlaceID(data.place_id)}>
                  <Text style={{ fontSize: 16, paddingVertical: 10 }}>{data.description}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : null}
        </View>
        <SafeAreaView>
          <TouchableOpacity
            style={styles.myLocationButton}
            onPress={() => {
              this.getLocation()
            }}
          >
            <GpsIcon />
          </TouchableOpacity>
        </SafeAreaView>
        <Toast
          ref={(toast) => (this.toast = toast)}
          style={styles.toastStyle}
          positionValue={170}
        />
      </View>
    )
  }
}

export default connect((store) => {
  return {
    addPropertyParams: store.property.addPropertyParams,
  }
})(ManualMap)
