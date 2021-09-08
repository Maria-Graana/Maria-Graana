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
} from 'react-native'
import _ from 'underscore'
import AppStyles from '../../AppStyles'
import Loader from '../../components/loader'
import PickerComponent from '../../components/Picker'
import { Row, Table } from 'react-native-table-component'
import PaymentMethods from '../../PaymentMethods'
import helper from '../../helper.js'

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
    let url = ``
    if (projectId) {
      url = `/api/project/shops?projectId=${projectId}&all=true`
    }
    if (projectId && floorId) {
      url = `/api/project/shops?projectId=${projectId} &floorId=${floorId}&all=true`
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
          projectKeys.length &&
          projectKeys.map((key) => {
            oneRow.push(unitOptionalFields[key].data)
          })
        oneRow.push(item.area)
        oneRow.push(item.rate_per_sqft)
        oneRow.push(PaymentMethods.findUnitPrice(item))
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

  handleProjectChange = (item) => {
    this.setState({ selectedProject: item, selectedFloor: null, loading: true }, () => {
      this.getFloors(this.state.selectedProject)
    })
  }

  handleFloorChange = (item) => {
    const { selectedProject } = this.state
    this.setState({ selectedFloor: item, loading: true }, () => {
      this.getUnits(selectedProject, item)
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

  render() {
    const {
      pickerProjects,
      selectedProject,
      pickerFloors,
      selectedFloor,
      tableData,
      tableHeaderTitle,
      loading,
    } = this.state

    let widthArr = this.setTableRowWidth()
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.mainContainer}>
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
              placeholder="Floor"
              selectedItem={selectedFloor ? selectedFloor : ''}
            />
          </View>
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
                          {tableData.map((rowData, index) => (
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
                          ))}
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
})
