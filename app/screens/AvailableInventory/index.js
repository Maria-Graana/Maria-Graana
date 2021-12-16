/** @format */

import axios from 'axios'
import React, { Component } from 'react'
import {
  Text,
  StyleSheet,
  View,
  ScrollView,
  Image,
  SafeAreaView,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native'
import _ from 'underscore'
import { Fab } from 'native-base'
import AppStyles from '../../AppStyles'
import { Ionicons } from '@expo/vector-icons'
import Loader from '../../components/loader'
import PickerComponent from '../../components/Picker'
import { Row, Table } from 'react-native-table-component'
import PaymentMethods from '../../PaymentMethods'
import helper from '../../helper.js'
import Search from '../../components/Search'
import StaticData from '../../StaticData'
import AvailableInventoryFilter from '../../components/AvailableInventoryFilter'
import { formatNumericPrice, formatPrice } from '../../components/PriceFormate'

class AvailableInventory extends Component {
  constructor(props) {
    super(props)
    this.state = {
      allProjects: [],
      pickerProjects: [],
      selectedProject: null,
      selectedFloor: null,
      allFloors: [],
      pickerFloors: [],
      tableHeaderTitle: '',
      tableData: [],
      allUnits: [],
      loading: true,
      showFilterModal: false,
      status: '',
      projectData: null,
    }
  }

  componentDidMount() {
    this.getAllProjects()
  }

  getAllProjects = () => {
    axios
      .get(`/api/project/all`)
      .then((res) => {
        let projectArray = []
        res &&
          res.data.items.map((item, index) => {
            return projectArray.push({ value: item.id, name: item.name })
          })
        this.setState(
          {
            pickerProjects: projectArray,
            allProjects: res.data.items,
            selectedProject: projectArray && projectArray.length > 0 ? projectArray[0].value : null,
            projectData: projectArray && projectArray.length > 0 ? projectArray[0] : null,
          },
          () => {
            this.getFloors(this.state.selectedProject)
          }
        )
      })
      .catch((error) => {
        console.log('/api/project/all - Error', error)
      })
  }

  getFloors = (selectedProjectId) => {
    if (selectedProjectId) {
      axios
        .get(`/api/project/floors?projectId=${selectedProjectId}`)
        .then((res) => {
          let floorArray = []
          res &&
            res.data.rows.map((item, index) => {
              return floorArray.push({ value: item.id, name: item.name })
            })
          this.setState(
            {
              pickerFloors: floorArray,
              allFloors: res.data.rows,
            },
            () => {
              this.getUnits(this.state.selectedProject, null)
            }
          )
        })
        .catch((error) => {
          console.log('/api/project/floors?projectId - Error', error)
        })
    }
  }

  getUnits = (projectId, floorId) => {
    const { status } = this.state
    let url = ``
    if (projectId) {
      url = `/api/project/shops?projectId=${projectId}&status=${status}`
    }
    if (projectId && floorId) {
      url = `/api/project/shops?projectId=${projectId}&floorId=${floorId}&status=${status}`
    }
    axios
      .get(url)
      .then((res) => {
        let array = []
        res &&
          res.data.rows.map((item, index) => {
            return array.push({
              value: item.id,
              name: item.saleType === 'resale' ? item.name + ' - Resale' : item.name,
            })
          })
        this.setState(
          {
            pickerUnits: array,
            allUnits: res.data.rows,
          },
          () => {
            const { allProjects } = this.state
            let currentProject = _.find(allProjects, function (item) {
              return item.id === projectId
            })
            this.generateUnitsTableData(currentProject)
          }
        )
      })
      .catch((error) => {
        console.log('/api/project/shops?projectId & floorId & status & type - Error', error)
      })
      .finally(() => {
        this.setState({ loading: false })
      })
  }

  generateUnitsTableData = (project) => {
    const { allUnits } = this.state
    let headerTitle = ['Unit']
    let otherTitles = ['Size(Sqft)', 'Rate/Sqft', 'Unit Price', 'Image', 'Status']
    let projectKeys = []
    let tableData = []
    let projectOptionalFields = JSON.parse(project && project.optional_fields) || []
    projectOptionalFields.map((item, index) => {
      headerTitle.push(item.fieldName)
      projectKeys.push(item.fieldName)
    })
    allUnits &&
      allUnits.map((item) => {
        let oneRow = []
        oneRow.push(item.name)
        const { optional_fields } = item
        let unitOptionalFields = JSON.parse(optional_fields)
        projectKeys &&
          projectKeys.length > 0 &&
          projectKeys.map((key) => {
            if (
              !_.isEmpty(unitOptionalFields) &&
              unitOptionalFields[key] &&
              unitOptionalFields[key].data
            ) {
              oneRow.push(unitOptionalFields[key].data)
            } else {
              oneRow.push('---')
            }
          })
        oneRow.push(item.area)
        oneRow.push(this.currencyConvert(item.rate_per_sqft))
        oneRow.push(this.currencyConvert(PaymentMethods.findUnitPrice(item)))
        oneRow.push('---')
        oneRow.push(item.bookingStatus)
        tableData.push(oneRow)
      })
    otherTitles.map((item) => {
      headerTitle.push(item)
    })
    this.setState({
      tableHeaderTitle: headerTitle,
      tableData,
    })
  }

  currencyConvert = (x) => {
    if (x === null || x === undefined) {
      return '---'
    } else if (x === 0) {
      return '0'
    } else {
      x = x.toString()
      var lastThree = x.substring(x.length - 3)
      var otherNumbers = x.substring(0, x.length - 3)
      if (otherNumbers != '') lastThree = ',' + lastThree
      var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThree
      return res
    }
  }

  handleProjectChange = (item) => {
    const { pickerProjects } = this.state
    this.setState({ selectedProject: item, selectedFloor: null, loading: true }, () => {
      this.getFloors(this.state.selectedProject)
    })

    this.setProjectData(item, pickerProjects)
  }

  setProjectData = (item, pickerProjects) => {
    for (var i = 0; i < pickerProjects.length; i++) {
      if (item == pickerProjects[i].value) {
        this.setState({ projectData: pickerProjects[i] })
      }
    }
  }

  handleFloorChange = (item) => {
    const { selectedProject } = this.state
    this.setState({ selectedFloor: item, loading: true }, () => {
      this.getUnits(selectedProject, item)
    })
  }

  filterByStatus = (status) => {
    const { selectedProject, selectedFloor } = this.state
    this.setState({ defaultUnitStatus: status }, () => {
      this.getUnits(selectedProject, selectedFloor, status)
    })
  }

  setTableRowWidth = () => {
    const { tableHeaderTitle } = this.state
    let array =
      tableHeaderTitle &&
      tableHeaderTitle.length &&
      tableHeaderTitle.map((item) => {
        return 120
      })
    return array
  }

  toggleFilterModal = (value) => {
    this.setState({ showFilterModal: value })
  }

  fetchOneUnit = (unit) => {
    const { allUnits } = this.state
    let oneUnit = {}
    if (allUnits && allUnits.length) {
      oneUnit = allUnits.find((item) => {
        return item.name == unit && item
      })
    }
    return oneUnit
  }

  onRowSelect = (val) => {
    const { navigation } = this.props
    const unit = this.fetchOneUnit(val)
    navigation.navigate('Client', {
      isUnitBooking: true,
      screenName: 'Leads',
      projectData: this.state.projectData,
      unit: unit,
    })
  }

  render() {
    const {
      pickerProjects,
      selectedProject,
      pickerFloors,
      selectedFloor,
      tableData,
      tableHeaderTitle,
      loading,
      showFilterModal,
      status,
    } = this.state
    const { navigation } = this.props
    let widthArr = this.setTableRowWidth()
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.mainContainer}>
          <AvailableInventoryFilter
            toggleFilterModal={(value) => this.toggleFilterModal(value)}
            status={status}
            changeStatus={(value) => this.setState({ status: value })}
            showFilterModal={showFilterModal}
            onFilterApplied={() => this.getUnits(selectedProject, selectedFloor, status)}
          />
          <View style={{ padding: 10 }}>
            <PickerComponent
              onValueChange={this.handleProjectChange}
              data={pickerProjects}
              name={'project'}
              placeholder="Project"
              enabled={!loading}
              selectedItem={selectedProject ? selectedProject : ''}
            />
          </View>
          <View style={{ padding: 10 }}>
            <PickerComponent
              onValueChange={this.handleFloorChange}
              data={pickerFloors}
              name={'floor'}
              enabled={!loading}
              placeholder="All Units"
              selectedItem={selectedFloor ? selectedFloor : ''}
            />
          </View>

          {/* {showSearchBar ? (
            <View style={[styles.filterRow]}>
              <View style={styles.idPicker}>
                <PickerComponent
                  placeholder={'Filter Unit by'}
                  data={StaticData.filterAvailableUnits}
                  customStyle={styles.pickerStyle}
                  customIconStyle={styles.customIconStyle}
                  onValueChange={this.changeFilterType}
                  selectedItem={filterType}
                />
              </View>

              {filterType === 'status' ? (
                <View style={styles.idPicker}>
                  <PickerComponent
                    placeholder={'Status'}
                    data={StaticData.unitStatuses}
                    customStyle={styles.pickerStyle}
                    customIconStyle={styles.customIconStyle}
                    onValueChange={this.filterByStatus}
                    selectedItem={defaultUnitStatus}
                  />
                </View>
              ) : (
                <Text>price filter</Text>
              )}

              <View
                style={{
                  width: '15%',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Ionicons
                  onPress={() => {
                    this.setState({ showSearchBar: false })
                  }}
                  name={'ios-close-circle-outline'}
                  size={26}
                  color={AppStyles.colors.subTextColor}
                />
              </View>
            </View>
          ) : (
            <View
              style={{
                alignItems: 'flex-end',
                paddingHorizontal: 20,
                width: '100%',
                justifyContent: 'center',
              }}
            >
              <Ionicons
                onPress={() => {
                  this.setState({ showSearchBar: true })
                }}
                name={'ios-search'}
                size={26}
                color={AppStyles.colors.subTextColor}
              />
            </View>
          )} */}

          {loading ? (
            <Loader loading={loading} />
          ) : (
            <>
              {tableData && tableData.length > 0 ? (
                <View style={styles.container}>
                  <ScrollView horizontal>
                    <View>
                      <Table borderStyle={styles.tableBorder}>
                        <Row
                          data={tableHeaderTitle}
                          widthArr={widthArr}
                          style={styles.headerTable}
                          textStyle={styles.headerTextStyle}
                        />
                      </Table>

                      <ScrollView style={styles.dataWrapper}>
                        <Table borderStyle={styles.tableBorder}>
                          {tableData.map((rowData, index) =>
                            rowData[rowData.length - 1] == 'Available' ? (
                              <TouchableOpacity
                                activeOpacity={0.6}
                                onPress={() => this.onRowSelect(rowData[0])}
                                key={index}
                              >
                                <Row
                                  key={index}
                                  data={rowData}
                                  widthArr={widthArr}
                                  style={[
                                    styles.row,
                                    { backgroundColor: helper.setBookingStatusColor(rowData) },
                                  ]}
                                  textStyle={styles.text}
                                />
                              </TouchableOpacity>
                            ) : (
                              <Row
                                key={index}
                                data={rowData}
                                widthArr={widthArr}
                                style={[
                                  styles.row,
                                  { backgroundColor: helper.setBookingStatusColor(rowData) },
                                ]}
                                textStyle={styles.text}
                              />
                            )
                          )}
                        </Table>
                      </ScrollView>
                    </View>
                  </ScrollView>
                </View>
              ) : (
                <Image
                  source={require('../../../assets/img/no-result-found.png')}
                  style={styles.imageStyle}
                />
              )}
            </>
          )}
          <Fab
            active="true"
            containerStyle={{ zIndex: 20 }}
            style={{ backgroundColor: AppStyles.colors.primaryColor }}
            position="bottomRight"
            onPress={() => this.toggleFilterModal(true)}
          >
            <Ionicons name="ios-search" color="#ffffff" />
          </Fab>
        </View>
      </SafeAreaView>
    )
  }
}

export default AvailableInventory

const styles = StyleSheet.create({
  mainContainer: {
    // padding: 15,
    backgroundColor: '#e7ecf0',
    flex: 1,
  },
  customIconStyle: {
    fontSize: 24,
  },
  pickerStyle: {
    height: 40,
  },
  container: {
    flex: 1,
    padding: 15,
    borderColor: AppStyles.colors.primaryColor,
  },
  headerTable: {
    height: 50,
    backgroundColor: '#f1f8ff',
    borderColor: AppStyles.colors.primaryColor,
  },
  headerTextStyle: {
    textAlign: 'center',
    fontSize: 12,
    fontFamily: AppStyles.fonts.defaultFont,
    paddingLeft: 2,
    color: AppStyles.colors.primaryColor,
  },
  text: {
    textAlign: 'center',
    fontSize: 12,
    fontFamily: AppStyles.fonts.defaultFont,
    paddingLeft: 2,
  },
  dataWrapper: { marginTop: 0 },
  row: {
    height: 40,
    borderColor: AppStyles.colors.primaryColor,
    borderRightWidth: 1,
    borderBottomWidth: 1,
  },
  tableBorder: {
    borderWidth: 1,
    borderColor: AppStyles.colors.primaryColor,
  },
  imageStyle: { width: 200, height: 200, alignSelf: 'center', margin: 10 },
  idPicker: {
    width: '40%',
    marginLeft: 10,
    justifyContent: 'center',
    alignSelf: 'center',
    height: 40,
    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#ebebeb',
    overflow: 'hidden',
  },
  filterRow: {
    flexDirection: 'row',
    backgroundColor: 'white',
    minHeight: 55,
    marginHorizontal: 10,
    marginVertical: 15,
    borderRadius: 4,
  },
})
