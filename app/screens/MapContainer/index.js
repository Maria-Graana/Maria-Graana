/**@format */

import * as turfHelper from '@turf/helpers'
import * as turf from '@turf/turf'
import axios from 'axios'
import React, { Component } from 'react'
import {
  View,
  Text,
  Button,
  StyleSheet,
  // TextInput,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
  // FlatList,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import MapView, { Geojson, Polygon, Marker } from 'react-native-maps'
import Modal from 'react-native-modal'
//import { Button } from 'native-base';
import { connect } from 'react-redux'

import { setAddPropertyParams } from '../../actions/property'
import config from '../../config'
const { width, height } = Dimensions.get('window')

const ASPECT_RATIO = width / height

const height_factor_level1 = Platform.OS === 'ios' ? 0.781 : 0.85
const height_factor_level2 = Platform.OS === 'ios' ? 0.74 : 0.77
// const latitudeDelta = 0.035
// const longitudeDelta = 0.035

const latitudeDelta = 0.12
const longitudeDelta = latitudeDelta * ASPECT_RATIO

const mapRef = React.createRef()

// render feature layer for seached items
// render points on top of plots (only that are not tagged)
// on click of point open bottom sheet
// separate screen for each list dropdown with a close button
/**
 * --housing schemes
 * --phase sectors
 * --block subsector
 * --plots
 */

const Item = ({ city_name }) => (
  <View>
    <Text style={{ color: '#000' }}>City : {city_name}</Text>
  </View>
)

class MapContainer extends Component {
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
    }
  }

  toggleCityModal = (visible) => {
    this.setState({
      toggleCityModal: visible,
    })
  }

  onCitySelect = (item) => {
    const center = this.getCentroid(JSON.parse(item.geoData))
    //console.log('center : ', center)
    const region = {
      latitude: center[0],
      longitude: center[1],
      longitudeDelta: 0.6211,
      latitudeDelta: 0.9271,
    }
    mapRef.current.animateToRegion(region)
    this.setState({ region, city_modal: false, chosenCity: item, chosen_housing_scheme: '' })
    // set city feature
    this.setCityFeature(item)
  }

  componentDidMount() {
    axios
      .get(`${config.mapUrl}cities?secure=true`)
      .then((res) => {
        const cities = res.data
        this.setState({
          cities,
        })
        //console.log('Response for cities : ', cities)
      })
      .catch((e) => {
        console.log('Unable to fetch cities data : ', e)
      })
  }

  onRegionChange = (region) => {
    //console.log('Region Change : ', region)
    // this.setState({
    //   region,
    //   panding: false,
    // })
  }

  onPanDrag = () => {
    const { panding } = this.state
    if (panding) {
      return
    }
    this.setState({
      panding: true,
    })
  }

  onMapPress = async () => {
    if (this.mapRef) {
      try {
        const camera = await this.mapRef.getCamera()
        //console.log(camera)
      } catch (err) {
        console.error(err)
      }
    }
  }

  _renderListItem(item) {
    //console.log('Render Item ', item)
    return (
      <View>
        <TouchableOpacity
          onPress={(item) => {
            //console.log('city Tapped', item)
          }}
        >
          <Text>{item.city_name}</Text>
        </TouchableOpacity>

        {/* <Text>{item.USD.symbol}</Text>
          <Text>{item.USD.description}</Text> */}
      </View>
    )
  }

  getCentroid = (geoJSON) => {
    const poly =
      geoJSON.type === 'Polygon'
        ? turf.polygon(geoJSON.coordinates)
        : turf.multiPolygon(geoJSON.coordinates)
    const centroid = turf.centroid(poly)
    const lon = centroid.geometry.coordinates[0]
    const lat = centroid.geometry.coordinates[1]
    const marker = [lat, lon]
    // console.log('Marker  : ', marker);
    return marker
  }

  setCityFeature = (item) => {
    const geoData = JSON.parse(item.geoData)
    const city_geometry = turf.polygons(geoData.coordinates)
    this.setState({
      city_geometry,
    })
    this.fetchHousingSchemes(item.id)
  }

  fetchHousingSchemes = async (cityId) => {
    // console.log('Fetching housing schemes for : ', cityId)
    const resp = await axios.get(`${config.mapUrl}housing-scheme?cityId=${cityId}&&secure=true`)
    const data = resp.data
    //console.log('data : ', data)
    this.setState({
      housing_schemes: data,
    })
  }
  onHousingSchemeSelect = (item) => {
    //const center = this.getCentroid(JSON.parse(item.geoData))
    //console.log('center : ', item.latLon.coordinates)
    const region = {
      latitude: item.latLon.coordinates[1],
      longitude: item.latLon.coordinates[0],
      longitudeDelta: 0.029274635016918182,
      latitudeDelta: 0.04274851510675859,
    }
    mapRef.current.animateToRegion(region)
    this.setState({ region, housing_scheme_modal: false, chosen_housing_scheme: item })
    // set city feature
    //this.setCityFeature(item)
    this.setHousingSchemeFeature(item)
  }
  setHousingSchemeFeature = (item) => {
    const geoData = JSON.parse(item.geoData)
    const housing_scheme_geometry = turf.polygons(geoData.coordinates)
    this.setState({
      housing_scheme_geometry,
    })
    this.fetchPhaseSector(item.id)
  }

  fetchPhaseSector = async (housingSchemeId) => {
    axios
      .get(`${config.mapUrl}phase-sector?housingSchemeId=${housingSchemeId}&&secure=true`)
      .then((resp) => {
        const data = resp.data
        //console.log('phase sectors data : ', data)
        this.setState({
          phase_sectors: data,
        })
      })
      .catch((e) => {
        console.log('Error getting phase sectors : ', e)
      })
  }
  onPhaseSectorSelect = (item) => {
    const center = this.getCentroid(JSON.parse(item.geoData))
    // console.log('center : ', item.latLon.coordinates)
    const region = {
      latitude: center[0],
      longitude: center[1],
      longitudeDelta: 0.013112984597682953,
      latitudeDelta: 0.019562198109447593,
    }
    mapRef.current.animateToRegion(region)
    this.setState({ region, phase_sector_modal: false, chosen_phase_sector: item })
    // set city feature
    //this.setCityFeature(item)
    this.setPhaseSectorFeature(item)
  }
  setPhaseSectorFeature = (item) => {
    const geoData = JSON.parse(item.geoData)
    const phase_sector_geometry = turf.polygons(geoData.coordinates)
    this.setState({
      phase_sector_geometry,
    })
    this.fetchBlockSubsector(item.id)
  }

  fetchBlockSubsector = async (phaseSectorId) => {
    const resp = await axios.get(
      `${config.mapUrl}block-subsector?phaseSectorId=${phaseSectorId}&&secure=true`
    )
    const data = resp.data
    //console.log('Block Subsector data : ', data)
    this.setState({
      block_subsectors: data,
    })

    if (data.length <= 0) {
      this.fetchPlotsByPhaseSector(phaseSectorId)
    }
  }
  onBlockSubsectorSelect = (item) => {
    const center = this.getCentroid(JSON.parse(item.geoData))
    // console.log('center : ', item.latLon.coordinates)
    const region = {
      latitude: center[0],
      longitude: center[1],
      longitudeDelta: 0.013112984597682953,
      latitudeDelta: 0.019562198109447593,
    }
    mapRef.current.animateToRegion(region)
    this.setState({ region, block_subsector_modal: false, chosen_block_subsector: item })
    // set city feature
    //this.setCityFeature(item)
    this.setBlockSubSectorFeature(item)
  }
  setBlockSubSectorFeature = (item) => {
    const geoData = JSON.parse(item.geoData)
    const block_subsector_geometry = turf.polygons(geoData.coordinates)
    this.setState({
      block_subsector_geometry,
    })
    this.fetchPlotsByBlockSubsector(item.id)
  }

  fetchPlotsByPhaseSector = async (phaseSectorId) => {
    this.setState({
      loading_plots: true,
    })
    const resp = await axios.get(
      `${config.mapUrl}plots?phaseSectorId=${phaseSectorId}&&secure=true`
    )
    const data = resp.data
    this.setPlotFeature(data)
    if (data.length <= 0) {
      this.setState({ plotsUnavailable: true })
    } else {
      this.setState({
        plots: data,
        plotsUnavailable: false,
        loading_plots: false,
      })
    }
  }
  fetchPlotsByBlockSubsector = async (blockSubsectorId) => {
    this.setState({
      loading_plots: true,
    })
    const resp = await axios.get(
      `${config.mapUrl}plots?blockSubsectorId=${blockSubsectorId}&&secure=true`
    )
    const data = resp.data
    if (data.length <= 0) {
      this.setState({ plotsUnavailable: true })
    } else {
      this.setState({
        plots: data,
        plotsUnavailable: false,
        loading_plots: false,
      })
    }
  }
  onPlotSelect = (item) => {
    const center = this.getCentroid(JSON.parse(item.geoData))
    // console.log('center : ', item.latLon.coordinates)
    const region = {
      latitude: center[0],
      longitude: center[1],
      longitudeDelta: 0.0009800121188163757,
      latitudeDelta: 0.0014614429810961838,
    }
    mapRef.current.animateToRegion(region)
    this.setState({ region, plots_modal: false, chosen_plot: item })
    // set city feature
    //this.setCityFeature(item)
    //this.setBlockSubSectorFeature(item)
  }

  setPlotFeature = (plots) => {
    //const geoData = JSON.parse(item.geoData)
    //console.log('Plots : ', plots)
    const plot_features = []
    plots.map((plot) => {
      let plotAttributes = (({ id }) => ({ id }))(plot);
      const geoData = JSON.parse(plot.geoData)
      const feature = turfHelper.polygons(geoData.coordinates, plotAttributes)
      plot_features.push(feature)
    })

    //console.log('Plots Features : ', plot_features)
    this.setState({
      plot_geometry: plot_features,
    })
  }

  onMarkThisProperty = (item) => {
    const point = this.getCentroid(JSON.parse(item.geoData));
    const { mapValues, screenName } = this.props.route.params;
    mapValues.lat = point[0];
    mapValues.lng = point[1];
    mapValues.propsure_id = item.id;
    this.props.navigation.navigate(screenName, { mapValues });
  }

  render() {
    // console.log('Configs Map URL : ', config.mapUrl);
    //const renderItem = ({ item }) => <Item title={item.city_name} />
    const {
      region,
      panding,
      cities,
      chosenCity,
      city_geometry,

      housing_schemes,
      chosen_housing_scheme,
      housing_scheme_modal,
      housing_scheme_geometry,

      phase_sectors,
      chosen_phase_sector,
      phase_sector_modal,
      phase_sector_geometry,

      block_subsectors,
      chosen_block_subsector,
      block_subsector_modal,
      block_subsector_geometry,

      plots,
      chosen_plot,
      plots_modal,
      plot_geometry,
      loading_plots,
    } = this.state

    return (
      <View style={styles.map}>
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={region}
          onRegionChangeComplete={(region) => {
            this.onRegionChange(region)
          }}
          onPanDrag={() => {
            this.onPanDrag()
          }}
        >
          {!!city_geometry && (
            <Geojson
              tappable={true}
              geojson={city_geometry}
              strokeColor="blue"
              fillColor="rgba(0,255,0, 0)"
              strokeWidth={2}
              opacity={0}
              onPress={(e) => {
                //e.stopPropagation()
                //console.log('DAT GEOJSON')
              }}
            />
          )}

          {!!housing_scheme_geometry && (
            <Geojson
              geojson={housing_scheme_geometry}
              strokeColor="red"
              fillColor="rgba(0,255,0, 0)"
              strokeWidth={2}
              opacity={0}
              onPress={(e) => {
                e.stopPropagation()
                //console.log('DAT GEOJSON')
              }}
            />
          )}

          {!!phase_sector_geometry && (
            <Geojson
              geojson={phase_sector_geometry}
              strokeColor="red"
              fillColor="rgba(0,255,0, 0)"
              strokeWidth={2}
              opacity={0}
              onPress={(e) => {
                e.stopPropagation()
                //console.log('DAT GEOJSON')
              }}
            />
          )}

          {!!block_subsector_geometry && (
            <Geojson
              geojson={block_subsector_geometry}
              strokeColor="red"
              fillColor="rgba(0,255,0, 0)"
              strokeWidth={2}
              opacity={0}
              onPress={(e) => {
                e.stopPropagation()
                //console.log('DAT GEOJSON')
              }}
            />
          )}

          {!!plot_geometry &&
            plot_geometry.map((geom) => (
              <Geojson
                key={geom.features[0].properties.id}
                geojson={geom}
                strokeColor="#0F73EE"
                fillColor="rgba(0,255,0, 0)"
                strokeWidth={2}
                opacity={0}
                onPress={(e) => {
                  e.stopPropagation()
                  console.log('DAT GEOJSON')
                }}
              />
            ))}

          {!!chosen_plot && (
            <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }} />
          )}
        </MapView>

        <SafeAreaView>
          {/** City Modal */}
          <Modal isVisible={this.state.city_modal} backdropOpacity={1.0} backdropColor="white">
            <View
              style={{
                flex: 1,
                // backgroundColor : 'green'
              }}
            >
              <View style={{ padding: 10, marginTop: 46 }}>
                <Text style={{ fontSize: 18, color: 'blue' }}>Choose City : </Text>
              </View>
              <ScrollView style={{ flex: 1 }}>
                {cities ? (
                  cities.map((item) => {
                    return (
                      <View
                        key={item.id}
                        style={{
                          flex: 1,
                          padding: 10,
                          // backgroundColor: 'red',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            this.onCitySelect(item)
                          }}
                        >
                          <Text style={{ fontSize: 22 }}> {item.city_name} </Text>
                        </TouchableOpacity>
                      </View>
                    )
                  })
                ) : (
                    <ActivityIndicator />
                  )}
              </ScrollView>
              <Button
                title="Hide modal"
                onPress={() => {
                  this.setState({ city_modal: false })
                }}
              />
            </View>
          </Modal>
          {/** Housing Scheme Modal */}
          <Modal isVisible={housing_scheme_modal} backdropOpacity={1.0} backdropColor="white">
            <View
              style={{
                flex: 1,
                // backgroundColor : 'green'
              }}
            >
              <View style={{ padding: 10, marginTop: 46 }}>
                <Text style={{ fontSize: 18, color: 'blue' }}>Choose Housing Scheme : </Text>
              </View>
              <ScrollView style={{ flex: 1 }}>
                {housing_schemes ? (
                  housing_schemes.map((item) => {
                    return (
                      <View
                        key={item.id}
                        style={{
                          flex: 1,
                          padding: 10,
                          // backgroundColor: 'red',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            // this.onCitySelect(item)
                            this.onHousingSchemeSelect(item)
                          }}
                        >
                          <Text style={{ fontSize: 22 }}> - {item.housing_scheme_name} </Text>
                        </TouchableOpacity>
                      </View>
                    )
                  })
                ) : (
                    <ActivityIndicator />
                  )}
              </ScrollView>
              <Button
                title="Hide modal"
                onPress={() => {
                  this.setState({ housing_scheme_modal: false })
                }}
              />
            </View>
          </Modal>
          {/**Phase Sector Modal */}
          <Modal isVisible={phase_sector_modal} backdropOpacity={1.0} backdropColor="white">
            <View
              style={{
                flex: 1,
                // backgroundColor : 'green'
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View style={{ padding: 10, marginTop: 46 }}>
                <Text>
                  {chosenCity.city_name}, {chosen_housing_scheme.housing_scheme_name}
                </Text>
                <Text style={{ fontSize: 18, color: 'blue' }}>Choose Phase/Sector : </Text>
              </View>
              <ScrollView style={{ flex: 1 }}>
                {phase_sectors ? (
                  phase_sectors.map((item) => {
                    return (
                      <View
                        key={item.id}
                        style={{
                          flex: 1,
                          padding: 10,
                          // backgroundColor: 'red',
                          // justifyContent: 'center',
                          // alignItems: 'center',
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            // this.onCitySelect(item)
                            //this.onHousingSchemeSelect(item)
                            this.onPhaseSectorSelect(item)
                          }}
                        >
                          <Text style={{ fontSize: 22 }}> {item.phase_sector_name} </Text>
                        </TouchableOpacity>
                      </View>
                    )
                  })
                ) : (
                    <ActivityIndicator />
                  )}
              </ScrollView>
              <Button
                title="Hide modal"
                onPress={() => {
                  this.setState({ phase_sector_modal: false })
                }}
              />
            </View>
          </Modal>
          {/**Block SubSector Modal */}
          <Modal isVisible={block_subsector_modal} backdropOpacity={1.0} backdropColor="white">
            <View
              style={{
                flex: 1,
                // backgroundColor : 'green'
              }}
            >
              <View style={{ padding: 10, marginTop: 46 }}>
                <Text>
                  {chosenCity.city_name}, {chosen_housing_scheme.housing_scheme_name},
                  {chosen_phase_sector.phase_sector_name}
                </Text>
                <Text style={{ fontSize: 18, color: 'blue' }}>Choose Block/SubSector : </Text>
              </View>
              <ScrollView style={{ flex: 1 }}>
                {block_subsectors ? (
                  block_subsectors.map((item) => {
                    return (
                      <View
                        key={item.id}
                        style={{
                          flex: 1,
                          padding: 10,
                          // backgroundColor: 'red',
                          // justifyContent: 'center',
                          // alignItems: 'center',
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            // this.onCitySelect(item)
                            //this.onHousingSchemeSelect(item)
                            this.onBlockSubsectorSelect(item)
                          }}
                        >
                          <Text style={{ fontSize: 22 }}> {item.block_subsector_name} </Text>
                        </TouchableOpacity>
                      </View>
                    )
                  })
                ) : (
                    <ActivityIndicator />
                  )}
              </ScrollView>
              <Button
                title="Hide modal"
                onPress={() => {
                  this.setState({ block_subsector_modal: false })
                }}
              />
            </View>
          </Modal>

          <Modal isVisible={plots_modal} backdropOpacity={1.0} backdropColor="white">
            <View
              style={{
                flex: 1,
                // backgroundColor : 'green'
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View style={{ padding: 10, marginTop: 46 }}>
                <Text>
                  {chosenCity.city_name}, {chosen_housing_scheme.housing_scheme_name}/
                  {chosen_phase_sector.phase_sector_name || ''},{' '}
                  {chosen_block_subsector.block_subsector_name || ''}
                </Text>
                <Text style={{ fontSize: 18, color: 'blue' }}>Choose Plot : </Text>
              </View>
              <ScrollView style={{ flex: 1 }}>
                {plots ? (
                  plots.map((item) => {
                    return (
                      <View
                        key={item.id}
                        style={{
                          flex: 1,
                          padding: 10,
                          // backgroundColor: 'red',
                          // justifyContent: 'center',
                          // alignItems: 'center',
                        }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            // this.onCitySelect(item)
                            //this.onHousingSchemeSelect(item)
                            this.onPlotSelect(item)
                          }}
                        >
                          <Text style={{ fontSize: 22 }}> {item.Plot_No} </Text>
                        </TouchableOpacity>
                      </View>
                    )
                  })
                ) : (
                    <ActivityIndicator />
                  )}
              </ScrollView>
              <Button
                title="Hide modal"
                onPress={() => {
                  this.setState({ plots_modal: false })
                }}
              />
            </View>
          </Modal>

          <Modal isVisible={loading_plots} backdropOpacity={0.5} backdropColor="white">
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text
                style={{
                  color: '#0F73EE',
                  fontSize: 18,
                }}
              >
                Loading Plots...
              </Text>
            </View>
          </Modal>

          {/** Level 1 Search */}
          <View style={styles.inputStyle}>
            <TouchableOpacity
              onPress={() => {
                this.setState({
                  city_modal: true,
                  housing_schemes: '',
                  chosen_housing_scheme: '',
                  phase_sectors: '',
                  chosen_phase_sector: '',
                  block_subsectors: '',
                  chosen_block_subsector: '',
                  plots: '',
                  chosen_plot: '',
                })
              }}
            >
              {chosenCity ? (
                <Text style={styles.labelStyle}>{chosenCity.city_name} |</Text>
              ) : (
                  <Text style={styles.promptStyle}>Select City</Text>
                )}
            </TouchableOpacity>

            {!!chosenCity && (
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    housing_scheme_modal: true,
                    phase_sectors: '',
                    chosen_phase_sector: '',
                    block_subsectors: '',
                    chosen_block_subsector: '',
                    plots: '',
                    chosen_plot: '',
                  })
                }}
              >
                {chosen_housing_scheme ? (
                  <Text style={styles.labelStyle}>
                    {chosen_housing_scheme.housing_scheme_name} |
                  </Text>
                ) : (
                    <Text style={styles.promptStyle}>Select Housing Scheme</Text>
                  )}
              </TouchableOpacity>
            )}

            {!!chosen_housing_scheme && (
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    phase_sector_modal: true,
                    block_subsectors: '',
                    chosen_block_subsector: '',
                    plots: '',
                    chosen_plot: '',
                  })
                }}
              >
                {chosen_phase_sector ? (
                  <Text style={styles.labelStyle}>{chosen_phase_sector.phase_sector_name} |</Text>
                ) : (
                    <Text style={styles.promptStyle}>Phase/Sector</Text>
                  )}
              </TouchableOpacity>
            )}
          </View>

          {/** Level 2 search */}
          {block_subsectors || plots ? (
            <View style={styles.inputStyleLevel2}>
              {block_subsectors.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      block_subsector_modal: true,
                      plots: '',
                      chosen_plot: '',
                    })
                  }}
                >
                  {chosen_block_subsector ? (
                    <Text style={styles.labelStyle}>
                      {chosen_block_subsector.block_subsector_name} |
                    </Text>
                  ) : (
                      <Text style={styles.promptStyle}>Block/Subsector</Text>
                    )}
                </TouchableOpacity>
              )}

              {/* { */}

              {/* {!!chosen_block_subsector && (
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      block_subsector_modal: true,
                    })
                  }}
                >
                  {chosen_block_subsector ? (
                    <Text style={styles.labelStyle}>
                      {chosen_block_subsector.block_subsector_name} |
                    </Text>
                  ) : (
                    <Text style={styles.promptStyle}>Select Block/Subsector</Text>
                  )}
                </TouchableOpacity>
              )} */}

              {!!plots && (
                <TouchableOpacity
                  onPress={() => {
                    this.setState({
                      plots_modal: true,
                    })
                  }}
                >
                  {chosen_plot ? (
                    <Text style={styles.labelStyle}>{chosen_plot.Plot_No} |</Text>
                  ) : (
                      <Text style={styles.promptStyle}>Select Plot</Text>
                    )}
                </TouchableOpacity>
              )}
            </View>
          ) : null}

          {!!chosen_plot && (
            <View style={styles.footer}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text
                  style={{
                    ...styles.region,
                    fontSize: 24,
                    fontWeight: 'bold',
                  }}
                >
                  Plot # {chosen_plot.Plot_No}
                </Text>
                <View
                  style={{
                    marginRight: 32,
                    // marginTop : 28,
                    borderWidth: '1px',
                    borderColor: '#fff',
                    alignItems: 'center',
                    justifyContent: 'center',
                    //backgroundColor : '#ddd',
                    //padding : 8,
                    height: 48,
                    width: 132,
                    marginTop: 24,
                    borderRadius: 32,
                    // marginTop : 32
                  }}
                >
                  <Text style={{ color: '#fff', fontSize: 18, fontWeight: '800' }}>
                    {chosen_plot.Legal_Status}
                  </Text>
                </View>
              </View>

              <Text style={styles.plotInfoStyle}>
                {chosen_plot.total_area} {chosen_plot.Area_In}
              </Text>
              <Text style={styles.plotInfoStyle}>Street {chosen_plot.Street}</Text>
              <Text style={styles.plotInfoStyle}>
                {chosen_housing_scheme.housing_scheme_name}/{chosen_phase_sector.phase_sector_name},{' '}
                {chosenCity.city_name}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  this.onMarkThisProperty(chosen_plot)
                }}
              >
                <View
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: width * 0.88,
                    backgroundColor: '#0F73EE',
                    padding: 15,
                    marginLeft: 24,
                    marginTop: 18,
                    borderRadius: 12,
                  }}
                >
                  <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                    MARK THIS PROPERTY
                  </Text>
                </View>
              </TouchableOpacity>
              {/* <Text style={styles.region}>{JSON.stringify(region, null, 2)}</Text> */}
            </View>
          )}
        </SafeAreaView>
      </View>
    )
  }
}

export default MapContainer
// export default connect((store) => {
//   return {
//     addPropertyParams: store.property.addPropertyParams,
//   }
// })(MapContainer)

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f7021a',
    padding: 100,
  },
  text: {
    color: '#3f2949',
    marginTop: 10,
  },
  markerFixed: {
    left: '50%',
    marginLeft: -24,
    marginTop: -48,
    position: 'absolute',
    top: '50%',
  },

  isPanding: {
    marginTop: -64,
  },
  marker: {
    height: 48,
    width: 48,
  },
  inputStyle: {
    flexDirection: 'row',
    bottom: height * height_factor_level1,
    height: 52,
    borderWidth: 1,
    marginLeft: 18,
    marginRight: 18,
    marginTop: 18,
    padding: 10,
    backgroundColor: '#fff',
    borderColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  inputStyleLevel2: {
    position: 'absolute',
    flexDirection: 'row',
    bottom: height * height_factor_level2,
    width: width * 0.9,
    height: 52,
    borderWidth: 1,
    marginLeft: 18,
    marginRight: 18,
    // marginTop: 18,
    padding: 10,
    backgroundColor: '#fff',
    borderColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
  },
  footer: {
    backgroundColor: 'rgba(0, 0, 0, 0.80)',
    // backgroundColor: 'rgb(0, 0, 0)',
    bottom: 0,
    position: 'absolute',
    width: '100%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    height: 250,
  },
  region: {
    color: '#fff',
    lineHeight: 28,
    margin: 24,
  },
  promptStyle: {
    fontSize: 16,
    color: '#454F64',
    marginTop: 4,
  },

  labelStyle: {
    fontSize: 16,
    color: '#0F73EE',
    marginTop: 4,
    fontWeight: 'bold',
  },

  plotInfoStyle: {
    color: '#fff',
    marginLeft: 24,
    fontSize: 20,
    fontWeight: '600',
  },
})
