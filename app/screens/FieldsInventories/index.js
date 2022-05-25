/** @format */

import { Ionicons } from '@expo/vector-icons'
import axios from 'axios'
import { ActionSheet } from 'native-base'
import React from 'react'
import { Alert, FlatList, Text, View } from 'react-native'
import { widthPercentageToDP } from 'react-native-responsive-screen'
import { connect } from 'react-redux'
import { isEmpty } from 'underscore'
import AppStyles from '../../AppStyles'
import Loader from '../../components/loader'
import NoResultsComponent from '../../components/NoResultsComponent'
import OnLoadMoreComponent from '../../components/OnLoadMoreComponent'
import PickerComponent from '../../components/Picker/index'
import PropertyTile from '../../components/PropertyTile'
import RejectPropertyModal from '../../components/RejectPropertyModal'
import Search from '../../components/Search'
import helper from '../../helper'
import * as RootNavigation from '../../navigation/RootNavigation'
import StaticData from '../../StaticData'
import styles from './style'

var BUTTONS = ['Delete', 'Cancel']
var CANCEL_INDEX = 1

class FieldsInventories extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      propertiesList: [],
      totalProperties: 0,
      loading: true,
      page: 1,
      pageSize: 20,
      onEndReachedLoader: false,
      selectedProperty: null,
      showMenu: false,
      rejectPropertyVisible: false,
      showSearchBar: false,
      searchText: '',
      statusFilter: 'onhold',
      searchBy: 'id',
      selectedArea: null,
    }
  }

  componentDidMount() {
    const { navigation } = this.props
    let that = this
    this._unsubscribe = navigation.addListener('focus', () => {
      const { route } = that.props
      if (route.params && route.params.selectedArea) {
        const { selectedArea } = route.params
        if (selectedArea) {
          this.setState({ selectedArea }, () => {
            //console.log(this.state.selectedArea);
            this.getFieldsListing()
          })
        }
      } else {
        this.getFieldsListing()
      }
    })
  }

  componentWillUnmount() {
    this.clearStateValues()
    this._unsubscribe()
  }

  clearStateValues = () => {
    this.setState({
      page: 1,
      totalProperties: 0,
    })
  }

  goToAttachments = (purpose) => {
    const { navigation, lead } = this.props
    navigation.navigate('LeadAttachments', {
      navProperty: true,
      purpose: purpose,
      propertyId: this.state.selectedProperty.id,
    })
  }

  getFieldsListing = () => {
    const {
      propertiesList,
      page,
      pageSize,
      showSearchBar,
      searchText,
      statusFilter,
      searchBy,
      selectedArea,
    } = this.state
    let query = ``

    if (showSearchBar && searchBy === 'id' && searchText !== '') {
      if (helper.isANumber(searchText)) {
        // Search By ID
        query = `/api/inventory/all?propType=fields&searchBy=id&q=${searchText}&pageSize=${pageSize}&page=${page}`
      } else {
        alert('Please Enter valid Property ID!')
        this.setState({ loading: false })
        return
      }
    } else if (showSearchBar && searchBy === 'area' && selectedArea) {
      // Search By Area
      query = `/api/inventory/all?propType=fields&searchBy=area&q=${selectedArea.id}&pageSize=${pageSize}&page=${page}`
    } else {
      // Only Status Filter
      query = `/api/inventory/all?propType=fields&status=${statusFilter}&pageSize=${pageSize}&page=${page}`
    }
    if (this.props.route.params?.client) {
      query = `${query}&searchBy=customer&q=${this.props.route.params?.client?.first_name} ${this.props.route.params?.client?.last_name}`
    }
    axios
      .get(query)
      .then((response) => {
        if (response.status == 200) {
          this.setState({
            propertiesList:
              page === 1 ? response.data.rows : [...propertiesList, ...response.data.rows],
            totalProperties: response.data.count,
            onEndReachedLoader: false,
            loading: false,
          })
        }
      })
      .catch((error) => {
        console.log('error', error)
        this.setState({ loading: false })
      })
  }

  goToInventoryForm = () => {
    RootNavigation.navigate('AddInventory')
  }

  deleteProperty = (id) => {
    let endPoint = ``
    let that = this
    endPoint = `api/inventory/${id}`
    axios
      .delete(endPoint)
      .then(function (response) {
        if (response.status === 200) {
          helper.successToast('PROPERTY DELETED SUCCESSFULLY!')
          that.setState({ loading: true }, () => {
            that.getFieldsListing()
          })
        }
      })
      .catch(function (error) {
        that.setState({ loading: false })
        helper.successToast(error.message)
      })
  }

  onHandlePress = (data) => {
    const { navigation } = this.props
    navigation.navigate('PropertyDetail', {
      property: data,
      update: true,
      editButtonHide: data.status === 'onhold' ? false : true,
      screenName: 'FieldsInventories',
    })
  }

  onHandleLongPress = (val) => {
    ActionSheet.show(
      {
        options: BUTTONS,
        cancelButtonIndex: CANCEL_INDEX,
        title: 'Select an Option',
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          //Delete
          this.showDeleteDialog(val)
        }
      }
    )
  }

  showDeleteDialog(id) {
    Alert.alert(
      'Delete Property',
      'Are you sure you want to delete this property ?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => this.deleteProperty(id) },
      ],
      { cancelable: false }
    )
  }

  onHandleOnCall = (data) => {
    const { contacts } = this.props
    if (data.poc_phone) {
      let phone = data.poc_phone
      let name = data.poc_name
      let newContact = {
        phone: phone,
        name: name && helper.capitalize(name),
        url: `tel:${phone}`,
      }
      helper.callNumber(newContact, contacts)
    } else {
      helper.errorToast(`No Phone Number`)
    }
  }

  setKey = (index) => {
    return String(index)
  }

  showMenuOptions = (data) => {
    this.setState({ selectedProperty: data, showMenu: true })
  }

  hideMenu = () => {
    this.setState({ selectedProperty: null, showMenu: false })
  }

  approveProperty = (id) => {
    let url = `/api/inventory/fieldProperty?id=${id}`
    this.setState({ loading: true }, () => {
      axios
        .patch(url)
        .then((res) => {
          helper.successToast('PROPERTY APPROVED!')
          this.getFieldsListing()
        })
        .catch((error) => {
          console.log('ERROR API: /api/inventory/fieldProperty', error)
        })
    })
  }

  rejectProperty = (reason) => {
    const { selectedProperty } = this.state
    let url = `/api/inventory/fieldProperty?id=${selectedProperty.id}&approve=${false}`
    let body = { reason }
    this.setState({ loading: true }, () => {
      axios
        .patch(url, body)
        .then((res) => {
          helper.successToast('PROPERTY REJECTED!')
          this.getFieldsListing()
        })
        .catch((error) => {
          console.log('ERROR API: /api/inventory/fieldProperty', error)
        })
        .finally(() => {
          this.showHideRejectPropertyModal(false)
        })
    })
  }

  showHideRejectPropertyModal = (val) => {
    this.setState({ rejectPropertyVisible: val, showMenu: false })
  }

  changeStatus = (status) => {
    this.clearStateValues()
    this.setState({ statusFilter: status, propertiesList: [], loading: true }, () => {
      this.getFieldsListing()
    })
  }

  clearAndCloseSearch = () => {
    this.setState(
      {
        searchText: '',
        showSearchBar: false,
        selectedArea: null,
        loading: true,
        searchBy: 'id',
        statusFilter: 'onhold',
      },
      () => {
        this.clearStateValues()
        this.getFieldsListing()
      }
    )
  }

  changeSearchBy = (searchBy) => {
    this.setState({ searchBy, selectedArea: null })
  }

  handleSearchByArea = () => {
    const { navigation } = this.props
    const { selectedArea } = this.state
    navigation.navigate('AssignedAreas', { screenName: 'Field App', selectedArea })
  }

  render() {
    const {
      propertiesList,
      loading,
      totalProperties,
      onEndReachedLoader,
      selectedProperty,
      showMenu,
      rejectPropertyVisible,
      statusFilter,
      searchText,
      showSearchBar,
      searchBy,
      selectedArea,
    } = this.state
    const { user, route } = this.props
    const { client } = route.params
    return !loading ? (
      <View style={[styles.container, { marginBottom: 25 }]}>
        {!client && (
          <>
            {showSearchBar ? (
              <View
                style={[
                  styles.filterRow,
                  {
                    paddingBottom: 0,
                    paddingTop: 0,
                    paddingLeft: 0,
                    flexDirection: 'row',
                    alignItems: 'center',
                  },
                ]}
              >
                <View style={[styles.pickerMain, { width: '20%', marginLeft: 10 }]}>
                  <PickerComponent
                    placeholder={'Search By'}
                    data={StaticData.searchBy}
                    customStyle={styles.pickerStyle}
                    customIconStyle={styles.customIconStyle}
                    onValueChange={this.changeSearchBy}
                    selectedItem={searchBy}
                  />
                </View>
                {searchBy === 'id' ? (
                  <Search
                    containerWidth={'80%'}
                    placeholder={'Search by ID'}
                    searchText={searchText}
                    setSearchText={(value) => this.setState({ searchText: value })}
                    showShadow={false}
                    showClearButton={true}
                    returnKeyType={'search'}
                    onSubmitEditing={() =>
                      this.setState({ loading: true }, () => {
                        this.getFieldsListing()
                      })
                    }
                    closeSearchBar={() => this.clearAndCloseSearch()}
                  />
                ) : (
                  <View style={styles.searchTextContainerStyle}>
                    <Text
                      onPress={() => this.handleSearchByArea()}
                      style={[
                        AppStyles.formFontSettings,
                        styles.searchAreaInput,
                        {
                          color: isEmpty(selectedArea)
                            ? AppStyles.colors.subTextColor
                            : AppStyles.colors.textColor,
                        },
                      ]}
                    >
                      {isEmpty(selectedArea) ? 'Search by Area' : selectedArea.name}
                    </Text>
                    <Ionicons
                      style={{ width: '10%' }}
                      onPress={() => this.clearAndCloseSearch()}
                      name={'ios-close-circle-outline'}
                      size={24}
                      color={'grey'}
                    />
                  </View>
                )}
              </View>
            ) : (
              <View style={[styles.filterRow, { paddingHorizontal: 15 }]}>
                <View style={styles.pickerMain}>
                  <PickerComponent
                    placeholder={'Property Status'}
                    data={StaticData.fieldAppStatusFilters}
                    customStyle={styles.pickerStyle}
                    customIconStyle={styles.customIconStyle}
                    onValueChange={this.changeStatus}
                    selectedItem={statusFilter}
                  />
                </View>
                <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons
                    onPress={() => {
                      this.setState({ showSearchBar: true }, () => {
                        this.clearStateValues()
                      })
                    }}
                    name={'ios-search'}
                    size={26}
                    color={AppStyles.colors.primaryColor}
                  />
                </View>
              </View>
            )}
          </>
        )}
        <RejectPropertyModal
          isVisible={rejectPropertyVisible}
          rejectProperty={(reason) => this.rejectProperty(reason)}
          showHideModal={(val) => this.showHideRejectPropertyModal(val)}
        />

        {/* ***** Main Tile Wrap */}

        {propertiesList && propertiesList.length > 0 ? (
          <FlatList
            contentContainerStyle={{ paddingHorizontal: widthPercentageToDP('2%') }}
            data={propertiesList}
            renderItem={({ item }) => (
              <PropertyTile
                data={item}
                checkForArmsProperty={false}
                onPress={(data) => this.onHandlePress(data)}
                onLongPress={(id) => this.onHandleLongPress(id)}
                onCall={this.onHandleOnCall}
                screen={'fields'}
                selectedProperty={selectedProperty}
                showMenu={showMenu}
                showMenuOptions={(data) => this.showMenuOptions(data)}
                hideMenu={() => this.hideMenu()}
                approveProperty={(id) => this.approveProperty(id)}
                showHideRejectPropertyModal={(val) => this.showHideRejectPropertyModal(val)}
                goToAttachments={this.goToAttachments}
              />
            )}
            onEndReached={() => {
              if (propertiesList.length < totalProperties) {
                this.setState(
                  {
                    page: this.state.page + 1,
                    onEndReachedLoader: true,
                  },
                  () => {
                    this.getFieldsListing()
                  }
                )
              }
            }}
            onEndReachedThreshold={0.5}
            keyExtractor={(item, index) => `${item.id}`}
          />
        ) : (
          <NoResultsComponent imageSource={require('../../../assets/img/no-result-found.png')} />
        )}

        {<OnLoadMoreComponent onEndReached={onEndReachedLoader} />}
      </View>
    ) : (
      <Loader loading={loading} />
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
    contacts: store.contacts.contacts,
  }
}

export default connect(mapStateToProps)(FieldsInventories)
