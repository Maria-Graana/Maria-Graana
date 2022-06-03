/** @format */

import { Ionicons } from '@expo/vector-icons'
import axios from 'axios'
import { Fab } from 'native-base'
import React, { Component } from 'react'
import RangeSliderComponent from '../../components/RangeSliderComponent'

import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native'
import { Row, Table } from 'react-native-table-component'
import { connect } from 'react-redux'
import _ from 'underscore'
import AppStyles from '../../AppStyles'

import RBSheet from 'react-native-raw-bottom-sheet'
import InventoryFilter from '../../components/FilterLeadsView/InventoryFilter'
import ListViewComponent from '../../components/ListViewComponent'

import Loader from '../../components/loader'
import TouchableButton from '../../components/TouchableButton'
import helper from '../../helper.js'
import { getPermissionValue } from '../../hoc/Permissions'
import { PermissionActions, PermissionFeatures } from '../../hoc/PermissionsTypes'
import PaymentMethods from '../../PaymentMethods'

class AvailableInventory extends Component {
  constructor(props) {
    super(props)
    this.state = {
      priceRange: '',
      isPriceModalVisible: false,
      minPrice: 0,
      maxPrice: StaticData.Constants.any_value,
      selectedFloorId: null,
      filterType: null,
      allProjects: [],
      pickerProjects: [],
      selectedProject: null,
      selectedProjectName: null,
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
      active: false,
      selectedRow: null,
      disabled: true,
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
            selectedProjectName:
              projectArray && projectArray.length > 0 ? projectArray[0].name : null,
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
    this.setState({ loading: true })
    const { status, minPrice, maxPrice } = this.state
    this.setState({ disabled: true, active: false, selectedRow: null })
    let url = ``
    if (projectId) {
      url = `/api/project/shops?projectId=${projectId}&status=${status}&currentInventory=true&all=true&minPrice=${minPrice}&maxPrice=${maxPrice}`
    }
    if (projectId && floorId) {
      url = `/api/project/shops?projectId=${projectId}&floorId=${floorId}&status=${status}&currentInventory=true&all=true&minPrice=${minPrice}&maxPrice=${maxPrice}`
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
        let bookingStatus = ''
        if (item.bookingStatus === 'hold') {
          bookingStatus = 'Hold'
        } else {
          bookingStatus = item.bookingStatus
        }
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
        oneRow.push(bookingStatus)
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

  handleProjectChange = (item, name) => {
    const { pickerProjects } = this.state
    this.setState(
      { selectedProject: item, selectedProjectName: name, selectedFloor: null, loading: true },
      () => {
        this.getFloors(this.state.selectedProject)
      }
    )

    this.setProjectData(item, pickerProjects)
  }

  setProjectData = (item, pickerProjects) => {
    for (var i = 0; i < pickerProjects.length; i++) {
      if (item == pickerProjects[i].value) {
        this.setState({ projectData: pickerProjects[i] })
      }
    }
  }

  handleFloorChange = (item, floorId) => {
    const { selectedProject } = this.state
    this.setState({ selectedFloor: item, selectedFloorId: floorId, loading: true }, () => {
      this.getUnits(selectedProject, floorId)
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

  onRowSelect = () => {
    const { navigation } = this.props
    const { selectedRow } = this.state
    const unit = this.fetchOneUnit(selectedRow)
    navigation.navigate('Client', {
      isUnitBooking: true,
      screenName: 'AvailableUnitLead',
      projectData: this.state.projectData,
      unit: unit,
    })
  }

  onSelection = (val) => {
    const { active, disabled, selectedRow } = this.state
    if (selectedRow == val) {
      this.setState({ active: false, disabled: true, selectedRow: null })
    } else {
      this.setState({ active: true, disabled: false, selectedRow: val })
    }
  }

  updatePermission = () => {
    const { permissions } = this.props
    return getPermissionValue(
      PermissionFeatures.APP_PAGES,
      PermissionActions.PROJECT_INVENTORY_PAGE_VIEW,
      permissions
    )
  }

  setBottomSheet = (value) => {
    this.setState(
      {
        filterType: value,
      },
      () => {
        this.RBSheet.open()
      }
    )
  }

  onClearAll = () => {
    const { pickerProjects } = this.state
    this.setState(
      {
        clear: false,
        selectedFloor: null,
        status: '',
        selectedFloorId: null,
        minPrice: 0,
        maxPrice: StaticData.Constants.any_value,
        priceRange: '',

        selectedProjectName:
          pickerProjects && pickerProjects.length > 0 ? pickerProjects[0].name : null,
        selectedProject:
          pickerProjects && pickerProjects.length > 0 ? pickerProjects[0].value : null,
        projectData: pickerProjects && pickerProjects.length > 0 ? pickerProjects[0] : null,
      },
      () => {
        this.getFloors(pickerProjects && pickerProjects.length > 0 ? pickerProjects[0].value : null)
      }
    )
  }

  changeProject = (status, name = null) => {
    this.handleProjectChange(status, name)
    this.RBSheet.close()
  }
  changeFloors = (status, name = null) => {
    this.handleFloorChange(name, status)
    this.RBSheet.close()
  }

  changeStatus = (status, name = null) => {
    const { selectedProject } = this.state
    this.setState({ status: name })
    this.filterByStatus(name)

    this.RBSheet.close()
  }

  filterByStatus = (status) => {
    const { selectedProject, selectedFloorId } = this.state
    this.setState({ defaultUnitStatus: status }, () => {
      this.getUnits(selectedProject, selectedFloorId, status)
    })
  }
  onModalPriceDonePressed = (minValue, maxValue) => {
    const { selectedProject, selectedFloorId, status } = this.state

    this.setState({ isPriceModalVisible: false, minPrice: minValue, maxPrice: maxValue }, () => {
      this.getUnits(selectedProject, selectedFloorId, status)
    })
    this.RBSheet.close()
  }

  setPriceRange = (range) => {
    this.setState({ priceRange: range })
  }

  onModalPriceShowPressed = () => {
    this.setState({ isPriceModalVisible: true })
  }

  onModalCancelPressed = () => {
    this.setState({ isPriceModalVisible: false })
    this.RBSheet.close()
  }

  render() {
    const {
      pickerProjects,
      selectedProject,
      pickerFloors,
      selectedFloor,
      selectedFloorId,
      tableData,
      tableHeaderTitle,
      loading,
      showFilterModal,
      status,
      active,
      selectedRow,
      disabled,
      filterType,
      selectedProjectName,
      isPriceModalVisible,
      minPrice,
      maxPrice,
      priceRange,
    } = this.state
    const { navigation } = this.props
    let widthArr = this.setTableRowWidth()
    let updatePermission = this.updatePermission()

    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.mainContainer}>
          <RBSheet
            ref={(ref) => {
              this.RBSheet = ref
            }}
            height={filterType == 'status' || filterType == 'price' ? 350 : 500}
            openDuration={250}
            closeOnDragDown={true}
          >
            {filterType == 'project' ? (
              <>
                {pickerProjects?.length != 0 ? (
                  <ListViewComponent
                    data={pickerProjects}
                    onPress={this.changeProject}
                    show={true}
                  />
                ) : (
                  <Loader loading={true} />
                )}
              </>
            ) : filterType == 'floors' ? (
              <ListViewComponent name={'Floors'} data={pickerFloors} onPress={this.changeFloors} />
            ) : filterType == 'status' ? (
              <ListViewComponent
                name={'Status'}
                data={StaticData.inventoryStatuses}
                onPress={this.changeStatus}
              />
            ) : filterType == 'price' ? (
              <RangeSliderComponent
                setPriceRange={this.setPriceRange}
                inventoryPrice={true}
                isVisible={true}
                initialValue={minPrice}
                finalValue={maxPrice}
                onModalPriceDonePressed={this.onModalPriceDonePressed}
                onModalCancelPressed={this.onModalCancelPressed}
                arrayValues={StaticData.PricesRent}
              />
            ) : null}
          </RBSheet>
          <InventoryFilter
            priceRange={priceRange}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onModalPriceShowPressed={this.onModalPriceShowPressed}
            enabled={!loading}
            project={selectedProjectName}
            selectedFloor={selectedFloor}
            status={status}
            price={10}
            setBottomSheet={this.setBottomSheet}
            clear={true}
            onClear={this.onClearAll}
          />

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
                                onPress={() => {
                                  if (updatePermission) this.onSelection(rowData[0])
                                }}
                                key={index}
                              >
                                <Row
                                  key={index}
                                  data={rowData}
                                  widthArr={widthArr}
                                  style={[
                                    styles.row,
                                    {
                                      backgroundColor:
                                        active && selectedRow == rowData[0]
                                          ? '#0f73ee'
                                          : helper.setBookingStatusColor(rowData),
                                    },
                                  ]}
                                  textStyle={[
                                    styles.text,
                                    {
                                      color: active && selectedRow == rowData[0] ? '#fff' : 'black',
                                    },
                                  ]}
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
                <View style={styles.imageStyles}>
                  <Image
                    source={require('../../../assets/img/no-result-found.png')}
                    style={styles.imageStyle}
                  />
                </View>
              )}
            </>
          )}
        </View>
        {updatePermission ? (
          <View style={styles.buttonInputWrap}>
            <TouchableButton
              containerStyle={[styles.timePageBtn, { opacity: disabled ? 0.5 : 1 }]}
              label="Book Unit"
              borderColor="white"
              containerBackgroundColor="#0f73ee"
              borderWidth={1}
              disabled={disabled}
              onPress={() => this.onRowSelect()}
            />
          </View>
        ) : null}
      </SafeAreaView>
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
    permissions: store.user.permissions,
  }
}

export default connect(mapStateToProps)(AvailableInventory)

const styles = StyleSheet.create({
  imageStyles: {
    flex: 1,
    justifyContent: 'center',
  },
  mainContainer: {
    backgroundColor: '#E5E5E5',
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
    backgroundColor: '#FFFFFF',
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
    borderColor: 'lightgrey',
    borderBottomWidth: 0.6,
  },
  tableBorder: {
    borderWidth: 1,
    borderColor: 'lightgrey',
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
    borderColor: 'lightgrey',
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
  buttonInputWrap: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'flex-end',
    paddingVertical: 15,
  },
  timePageBtn: {
    justifyContent: 'center',
    borderRadius: 8,
    padding: 10,
    marginLeft: 15,
    marginRight: 15,
  },
})
