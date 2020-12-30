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
  FlatList,
  Platform,
  ScrollView,
  ActivityIndicator,
  Image
} from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons'; 

import MapView, { Geojson, Polygon, Marker } from 'react-native-maps'
import Modal from 'react-native-modal'
//import { Button } from 'native-base';
import { connect } from 'react-redux'

import { setAddPropertyParams } from '../../actions/property'
import config from '../../config'
// import { FlatList } from 'react-native-gesture-handler'

const { width, height } = Dimensions.get('screen')

const ASPECT_RATIO = width / height


const latitudeDelta = 0.12
const longitudeDelta = latitudeDelta * ASPECT_RATIO

const mapRef = React.createRef()


const CityRenderItem = ({ item, onCitySelect }) => (
  <View
    key={item.id}
    style={{
      flex: 1,
      padding: 10,
    }}
  >
    <TouchableOpacity
      onPress={() => {
        onCitySelect(item)
      }}
    >
      <View>
        <Text style={{ fontSize: 18 }}> {item.city_name} </Text>
      </View>
    </TouchableOpacity>
  </View>
)

const HousingSchemeRenderItem = ({ item, onHousingSchemeSelect }) =>  (
  <View
    key={item.id}
    style={{
      flex: 1,
      padding: 10,
    }}
  >
    <TouchableOpacity
      onPress={() => {
        onHousingSchemeSelect(item)
      }}
    >
      <View>
        <Text style={{ fontSize: 18 }}> {item.housing_scheme_name} </Text>
      </View>
    </TouchableOpacity>
  </View>
)

const PlotMarker = ({ id }) => (
  <Image 
    key={id}
    source={require('../../../assets/img/marker_plot.png')}
    style={{ height : 20, width : 20}}
  />
)

const SelectedMarker = ({ id }) => (
  <Image 
    key={id}
    source={require('../../../assets/img/marker_arms.png')}
    style={{ height : 45, width : 45}}
  />
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
      plot_markers: ''
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

  fetchPlotData = async(propsure_id) => {
    this.setState({
      loading_plots: true
    })
    axios.get(`${config.mapUrl}plot/${propsure_id}?secure=true`)
    .then(res => {
      const plot = res.data;
      this.setState({
        chosen_plot : plot[0], 
        loading_plots: false
      })
      this.setPlotFeature(plot)
      this.onPlotSelect(plot[0])
    }) 
  }

  componentDidMount() {
    const { mapValues : { propsure_id } } = this.props.route.params; 
    if(propsure_id){
      this.fetchPlotData(propsure_id);
    }
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
          <View>
            <Text>{item.city_name}</Text>
          </View>
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
    // this.fetchBlockSubsectorByHousingScheme(item.id)
  }

  fetchPhaseSector = async (housingSchemeId) => {
    axios
      .get(`${config.mapUrl}phase-sector?housingSchemeId=${housingSchemeId}&&secure=true`)
      .then((resp) => {
        const data = resp.data
        if(data.length <= 0){
          //console.log('Phase sectors : ', data)

          this.fetchBlockSubsectorByHousingScheme(housingSchemeId)
        }
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
      "latitudeDelta": 0.003141324497256903,
      "longitudeDelta": 0.0022208693873437824,
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
    
    if (data.length <= 0) {
      this.fetchPlotsByPhaseSector(phaseSectorId)
    } else {
      this.setState({
        block_subsectors: data,
      })
    }
  }

  fetchBlockSubsectorByHousingScheme = async(housingSchemeId) => {
    console.log('Housing scheme Id : ', housingSchemeId)
    const resp = await axios.get(
      `${config.mapUrl}block-subsector?housingSchemeId=${housingSchemeId}&&secure=true`
    )
    const data = resp.data
    if (data.length <= 0) {
      this.fetchPlotsByHousingScheme(housingSchemeId)
    } else {
      this.setState({
        block_subsectors: data,
      })
    }
    // console.log('Block Subsector data : ', data)
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
  
  fetchPlotsByHousingScheme = async (housingSchemeId) => {
    this.setState({
      loading_plots: true,
    })
    const resp = await axios.get(
      `${config.mapUrl}plots?housingSchemeId=${housingSchemeId}&&secure=true`
    )
    const data = resp.data
    if (data.length <= 0) {
      this.setState({ plotsUnavailable: true })
    } else {
      let item = this.state.chosen_housing_scheme;
      const center = this.getCentroid(JSON.parse(item.geoData))
    // console.log('center : ', item.latLon.coordinates)
      const region = {
        latitude: center[0],
        longitude: center[1],
        longitudeDelta: 0.013112984597682953,
        latitudeDelta: 0.019562198109447593,
      }
      mapRef.current.animateToRegion(region)
      this.setPlotFeature(data)
      this.setPlotMarkers(data)
      this.setState({
        plots: data,
        plotsUnavailable: false,
        loading_plots: false,
        region,
      })
    }
  }
  fetchPlotsByPhaseSector = async (phaseSectorId) => {
    this.setState({
      loading_plots: true,
    })
    const resp = await axios.get(
      `${config.mapUrl}plots?phaseSectorId=${phaseSectorId}&&secure=true`
    )
    const data = resp.data
    if (data.length <= 0) {
      this.setState({ plotsUnavailable: true })
    } else {
      this.setPlotFeature(data)
      this.setPlotMarkers(data)
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
      this.setPlotFeature(data)
      this.setPlotMarkers(data)
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

  setPlotMarkers = (plots) => {
    const plot_markers = plots.map((plot) => ({...plot, marker: this.getCentroid(JSON.parse(plot.geoData))}))
    this.setState({
      plot_markers
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
      //plot_markers,
    } = this.state

    let {plot_markers} = this.state;
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

          {/* {!!chosen_plot && (
            <Marker coordinate={{ latitude: region.latitude, longitude: region.longitude }}> 
              <Image source={require('../../../assets/img/marker_arms.png')} style={{height: 45, width:45 }} />
            </Marker>
          )} */}

          {!!plot_markers && 
            plot_markers.map((plot, index) => 
            (
              <Marker
                key={index}
                tracksViewChanges={false}
                coordinate={{ latitude : plot.marker[0], longitude : plot.marker[1]}}
                onPress = {() => {
                  this.onPlotSelect(plot)
                }}
              >
                {chosen_plot.id !== plot.id ? 
                  <PlotMarker 
                      id={index}
                  />
                  :
                  <SelectedMarker 
                    id={plot.id}
                  />
                }
              </Marker>
                
            )
          )}
          
        </MapView>

        <SafeAreaView>
          {/** City Modal */}
          <View style = {{ flex : 1}}>
          <Modal 
            useNativeDriver={true} 
            isVisible={this.state.city_modal} 
            backdropOpacity={1.0} 
            backdropColor="white"
            hideModalContentWhileAnimating={true}
          >
            <View
              style={{
                flex: 1,
                // backgroundColor : 'green'
              }}
            >
              <View style={{ padding: 10, marginTop: 46 }}>
                <Text style={{ fontSize: 24, color: '#0F73EE' }}>Choose City</Text>
              </View>
              <ScrollView style={{ flex: 1 }}>
                {cities ? (
                  <FlatList 
                    data={cities}
                    renderItem={({ item }) => (
                      <CityRenderItem 
                        item={item}
                        onCitySelect={this.onCitySelect}
                      />
                    )}
                    keyExtractor={item => item.id}
                  />

                ) : (
                    <ActivityIndicator 
                      color = {'#0F73EE'}
                      size={'large'}
                    />
                  )}
                
              </ScrollView>
              <Button
                title="Close"
                onPress={() => {
                  this.setState({ city_modal: false })
                }}
              />
            </View>
          </Modal>
          {/** Housing Scheme Modal */}
          <Modal 
            useNativeDriver={true} 
            isVisible={housing_scheme_modal} 
            backdropOpacity={1.0} 
            backdropColor="white"
            hideModalContentWhileAnimating={true}
          >
            <View
              style={{
                flex: 1,
                // backgroundColor : 'green'
              }}
            >
              <View style={{ padding: 10, marginTop: 46 }}>
                <View style = {{
                  flexDirection : 'row', 
                  justifyContent : 'space-between'
                }}>
                  <View style={styles.modalLabelStyle}>
                    <Text style = {{ fontSize : 18}}>{chosenCity.city_name} <AntDesign name="rightcircle" size={18} color="#0F73EE" /> </Text>
                  </View>
                </View>
              </View>
              <ScrollView style={{ flex: 1 }}>
                {housing_schemes ? (
                  <FlatList
                    data={housing_schemes}
                    renderItem={({ item }) => (
                      <HousingSchemeRenderItem 
                        item={item}
                        onHousingSchemeSelect={this.onHousingSchemeSelect}
                      />
                    )}
                    keyExtractor={item => item.id}
                  /> 
                ) : (
                    <ActivityIndicator 
                      color = {'#0F73EE'}
                      size={'large'}
                    />
                  )}
              </ScrollView>
              <Button
                title="Close"
                onPress={() => {
                  this.setState({ housing_scheme_modal: false })
                }}
              />
            </View>
          </Modal>
          {/**Phase Sector Modal */}
          <Modal
            useNativeDriver={true} 
            isVisible={phase_sector_modal} 
            backdropOpacity={1.0} 
            backdropColor="white"
            hideModalContentWhileAnimating={true}
          >
            <View
              style={{
                flex: 1,
                // backgroundColor : 'green'
                // justifyContent: 'center',
                // alignItems: 'center',
              }}
            >
              <View style={{ padding: 10, marginTop: 46 }}>
                <View style = {{
                  flexDirection : 'row', 
                  justifyContent : 'space-between'
                }}>
                  <View style={styles.modalLabelStyle}>
                    <Text style = {{ fontSize : 18}}>{chosenCity.city_name}, {chosen_housing_scheme.housing_scheme_name} <AntDesign name="rightcircle" size={18} color="#0F73EE" /> </Text>
                  </View>
                </View>
              </View>
              {/* <View style={styles.modalLabelStyle}>
                <Text>
                  {chosenCity.city_name}, {chosen_housing_scheme.housing_scheme_name}
                </Text>
                <Text style={{ fontSize: 18, color: 'blue' }}>Select Phase: </Text>
              </View> */}
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
                          <View>
                            <Text style={{ fontSize: 22 }}> {item.phase_sector_name} </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    )
                  })
                ) : (
                    <ActivityIndicator 
                      color = {'#0F73EE'}
                      size={'large'}
                    />
                  )}
              </ScrollView>
              <Button
                title="Close"
                onPress={() => {
                  this.setState({ phase_sector_modal: false })
                }}
              />
            </View>
          </Modal>
          {/**Block SubSector Modal */}
          <Modal 
            useNativeDriver={true} 
            isVisible={block_subsector_modal} 
            backdropOpacity={1.0} 
            backdropColor="white"
            hideModalContentWhileAnimating={true}
          >
            <View
              style={{
                flex: 1,
                // backgroundColor : 'green'
              }}
            >
              <View style={{ padding: 10, marginTop: 46 }}>
                <View style = {{
                  flexDirection : 'row', 
                  justifyContent : 'space-between'
                }}>
                  <View style={styles.modalLabelStyle}>
                    <Text style = {{ fontSize : 18}}>
                      {chosenCity.city_name}, 
                      {chosen_housing_scheme.housing_scheme_name},
                      {chosen_phase_sector.phase_sector_name} 
                      <AntDesign name="rightcircle" size={18} color="#0F73EE" /> 
                    </Text>
                  </View>
                </View>
              </View>
              {/* <View style={{ padding: 10, marginTop: 46 }}>
                <Text>
                  {chosenCity.city_name}, {chosen_housing_scheme.housing_scheme_name},
                  {chosen_phase_sector.phase_sector_name}
                </Text>
                <Text style={{ fontSize: 18, color: 'blue' }}>Choose Block/SubSector : </Text>
              </View> */}
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
                          <View>
                            <Text style={{ fontSize: 22 }}> {item.block_subsector_name} </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    )
                  })
                ) : (
                    <ActivityIndicator 
                      color = {'#0F73EE'}
                      size={'large'}
                    />
                  )}
              </ScrollView>
              <Button
                title="Close"
                onPress={() => {
                  this.setState({ block_subsector_modal: false })
                }}
              />
            </View>
          </Modal>

          <Modal 
            useNativeDriver={true}
            isVisible={plots_modal} 
            backdropOpacity={1.0} 
            backdropColor="white"
          >
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
                  plots.map((item, index) => {
                    return (
                      <View
                        key={index}
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
                          <View>
                            <Text style={{ fontSize: 22 }}> {item.Plot_No} </Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    )
                  })
                ) : (
                    <ActivityIndicator 
                      color = {'#0F73EE'}
                      size={'large'}
                    />
                  )}
              </ScrollView>
              <Button
                title="Close"
                onPress={() => {
                  this.setState({ plots_modal: false })
                }}
              />
            </View>
          </Modal>

          <Modal 
            useNativeDriver={true} 
            isVisible={loading_plots} 
            backdropOpacity={0.5} 
            backdropColor="white"
          >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Text
                style={{
                  color: '#0F73EE',
                  fontSize: 18,
                }}
              >
                Loading Plot Data...
              </Text>
            </View>
            <Button
                title="Close"
                onPress={() => {
                  this.setState({ loading_plots: false })
                }}
              />
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
                  phase_sector_geometry:'',
                  block_subsectors: '',
                  chosen_block_subsector: '',
                  block_subsector_geometry: '',
                  plots: '',
                  plot_geometry : '',
                  chosen_plot: '',
                })
              }}
            >
              {chosenCity ? (
                <View>
                  <Text style={styles.labelStyle}>
                    {chosenCity.city_name}  <AntDesign name="rightcircle" size={18} color="#0F73EE" /> | 
                  </Text>

                </View>
              ) : (
                  <View>
                    <Text style={styles.promptStyle}>Select City</Text>
                  </View>
                )}
            </TouchableOpacity>

            {!!chosenCity && (
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    housing_scheme_modal: true,
                    phase_sectors: '',
                    chosen_phase_sector: '',
                    phase_sector_geometry: '',
                    block_subsectors: '',
                    chosen_block_subsector: '',
                    block_subsector_geometry: '',
                    plots: '',
                    chosen_plot: '',
                    plot_geometry: '', 
                    plot_markers: '',
                  })
                }}
              >
                {chosen_housing_scheme ? (
                  <View>
                    <Text style={styles.labelStyle}>
                      {`${chosen_housing_scheme.housing_scheme_name}`} <AntDesign name="rightcircle" size={18} color="#0F73EE" />
                    </Text>
                  </View>
                ) : (
                    <View>
                      <Text style={styles.promptStyle}>Select Housing Scheme</Text>
                    </View>
                  )}
              </TouchableOpacity>
            )}

            {phase_sectors.length > 0 && (
              <TouchableOpacity
                onPress={() => {
                  this.setState({
                    phase_sector_modal: true,
                    block_subsectors: '', 
                    block_subsector_geometry: '',
                    chosen_block_subsector: '',
                    plots: '',
                    plot_markers : '',
                    plot_geometry : '',
                    chosen_plot: '',
                  })
                }}
              >
                {chosen_phase_sector ? (
                  <View>
                    <Text style={styles.labelStyle}>
                      {chosen_phase_sector.phase_sector_name} <AntDesign name="rightcircle" size={18} color="#0F73EE" /> |
                    </Text> 
                  </View>
                ) : (
                  <View>
                    <Text style={styles.promptStyle}>Phase/Sector</Text>
                  </View>
                  )}
              </TouchableOpacity>
            )}
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
                  <View>
                    <Text style={styles.labelStyle}>
                      {chosen_block_subsector.block_subsector_name} <AntDesign name="rightcircle" size={18} color="#0F73EE" /> |
                    </Text>
                  </View>
                ) : (
                  <View>
                    <Text style={styles.promptStyle}>Block/Subsector</Text>
                  </View>
                  )}
              </TouchableOpacity>
            )}

            {!!plots && (
              <TouchableOpacity
              >
                {
                  !!chosen_plot && (
                    <View>
                      <Text style={styles.labelStyle}>{chosen_plot.Plot_No}</Text>
                    </View>
                  )
                }
              </TouchableOpacity>
            )}
          </View>

          {!!chosen_plot && (
            <View style={styles.footer}>
              <View style = {{ 
                alignItems : 'center',
              }}>
                <TouchableOpacity onPress = {() => {
                  this.setState({
                    chosen_plot : false
                  })
                }}>
                  <View>
                    <AntDesign name="downcircle" size={24} color="#0F73EE" />
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{ 
                flexDirection: 'row', 
                justifyContent: 'space-between',
              }}>
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
                  style={styles.legalStatusStyle}
                >
                  <Text style={{ color: '#fff', fontSize: 17, fontWeight: '800' }}>
                    {chosen_plot.Legal_Status == 'Approved' ? 'Approved' : 'Unknown'}
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
                  style={styles.buttonStyle}
                >
                  <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>
                    MARK THIS PROPERTY
                  </Text>
                </View>
              </TouchableOpacity>
              {/* <Text style={styles.region}>{JSON.stringify(region, null, 2)}</Text> */}
            </View>
          )}
          </View>
        </SafeAreaView>
      </View>
    )
  }
}

export default MapContainer

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  commonPadding : {
    padding : 5
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

  modalLabelStyle : {
    flexWrap: 'wrap',
    backgroundColor : '#fff',
    borderRadius : 32, 
    paddingVertical: 6, 
    paddingHorizontal: 15,
    shadowColor: "#000",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },

  buttonStyle : {
    justifyContent: 'center',
    alignItems: 'center',
    width: width * 0.88,
    backgroundColor: '#0F73EE',
    padding: 15,
    marginLeft: 16,
    marginTop: 18,
    borderRadius: 12,
  },

  legalStatusStyle : {
    marginRight: 32,
    
    borderWidth: 1,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: 42,
    width: 132,
    borderRadius: 32,
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
    position: 'absolute',
    backgroundColor: '#fff',
    flexWrap: 'wrap',
    flexShrink: -1,
    bottom: height - 268,
    width: '95%',
    borderRadius : 12,
    margin: 12, 
    padding: 5, 
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3
    }, 
    shadowOpacity: 0.29, 
    shadowRadius: 4.65, 
    elevation: 7,
  },
  footer: {
    padding : 10,
    backgroundColor: 'rgba(0, 0, 0, 0.80)',
    // backgroundColor: 'rgb(0, 0, 0)',
    bottom: 0,
    position: 'absolute',
    width: '100%',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    height: 240,
  },
  region: {
    color: '#fff',
    lineHeight: 28,
    marginLeft : 16,
  },
  promptStyle: {
    fontSize: 20,
    color: '#454F64',
    // marginTop: ,
    padding: 5
  },

  labelStyle: {
    fontSize: 20,
    color: '#000',
    //marginTop: 4,
    fontWeight: 'bold',
    padding: 5
  },

  plotInfoStyle: {
    color: '#fff',
    marginLeft: 16,
    fontSize: 20,
    fontWeight: '600',
  },
})
