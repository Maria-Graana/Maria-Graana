/** @format */

import React from 'react'
import styles from './style'
import { View, FlatList, Alert, Keyboard, TouchableWithoutFeedback } from 'react-native'
import { connect } from 'react-redux'
import ClientTile from '../../components/ClientTile'
import AppStyles from '../../AppStyles'
import axios from 'axios'
import Ability from '../../hoc/Ability'
import { Ionicons } from '@expo/vector-icons'
import { Fab, ActionSheet } from 'native-base'
import helper from '../../helper'
import Loader from '../../components/loader'
import fuzzy from 'fuzzy'
import Search from '../../components/Search'
import NoResultsComponent from '../../components/NoResultsComponent'
import OnLoadMoreComponent from '../../components/OnLoadMoreComponent'
import { getPermissionValue } from '../../hoc/Permissions'
import { PermissionActions, PermissionFeatures } from '../../hoc/PermissionsTypes'
import _ from 'underscore'
import { setlead } from '../../actions/lead'
import StaticData from '../../StaticData'

var BUTTONS = ['Delete', 'Cancel']
var CANCEL_INDEX = 1

class Client extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      customers: [],
      totalCustomers: 0,
      loading: true,
      page: 1,
      pageSize: 50,
      onEndReachedLoader: false,
      searchText: '',
      isSelected: false,
    }
  }

  componentDidMount() {
    const { navigation, route } = this.props
    const { isUnitBooking } = route.params
    this._unsubscribe = navigation.addListener('focus', () => {
      if (isUnitBooking) {
        navigation.setOptions({ title: 'SELECT CLIENT' })
      }
      this.fetchCustomer()
    })
  }

  componentWillUnmount() {
    this.clearStateValues()
    this._unsubscribe()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.searchText !== this.state.searchText) {
      this.fetchCustomer()
    }
  }

  clearStateValues = () => {
    this.setState({
      page: 1,
      totalCustomers: 0,
    })
  }

  checkIsSelected = (selectedClient) => {
    // this function is only called for drop down selection of client.
    const copyCustomers = [...this.state.customers]
    const newCustomers = copyCustomers.map((customer) => ({
      ...customer,
      isSelected: customer.id === selectedClient.id,
    }))
    this.setState({ customers: newCustomers })
  }

  checkIsSelectedForPhone = (selectedPOC) => {
    // this function is only called for drop down selection of client.
    const copyCustomers = [...this.state.customers]
    const newCustomers = copyCustomers.map((customer) => ({
      ...customer,
      isSelected: customer.contact1 === selectedPOC.contact1,
    }))
    this.setState({ customers: newCustomers })
  }
  fetchCustomer = () => {
    const { customers, searchText, page, pageSize } = this.state
    const { selectedClient, selectedPOC } = this.props.route.params
    let url = ''
    const clientName = searchText.replace(' ', '%20')
    searchText !== ''
      ? (url = `/api/customer/find?searchBy=name&q=${clientName}`)
      : (url = `/api/customer/find?pageSize=${pageSize}&page=${page}`)
    axios
      .get(url)
      .then((res) => {
        this.setState(
          {
            customers:
              searchText !== ''
                ? res.data.rows
                : page === 1
                ? res.data.rows
                : [...customers, ...res.data.rows],
            totalCustomers: res.data.count,
            onEndReachedLoader: false,
            loading: false,
          },
          () => {
            if (selectedClient) {
              this.checkIsSelected(selectedClient)
            }
            if (selectedPOC) {
              this.checkIsSelectedForPhone(selectedPOC)
            }
          }
        )
      })
      .catch((error) => {
        console.log(error)
        return null
      })
  }

  navigateTo = (data) => {
    const { route, navigation } = this.props
    const {
      isUnitBooking = false,
      isFromDropDown = false,
      screenName,
      isPOC = false,
    } = route.params // user can by default move to detail screen if param is undefined or null
    if (isFromDropDown) {
      // This is the case for dropdown value selection
      if (isPOC) {
        navigation.navigate(screenName, { selectedPOC: data })
      } else {
        navigation.navigate(screenName, {
          client: data,
          name: data.firstName + ' ' + data.lastName,
          flowCheck: true,
        })
      }
    } else if (isUnitBooking) {
      const { projectData, unit } = route.params
      axios.get(`/api/leads/projects?customerId=${data.id}&status=open`).then((response) => {
        const res = response.data
        if (res.count > 0) {
          navigation.replace(screenName, {
            client: data,
            name: data.firstName + ' ' + data.lastName,
            leadsData: res.rows,
            unitData: unit,
          })
        } else {
          this.leadCreation(data, projectData, navigation, data, unit)
        }
      })
    } else {
      // by default flow of client screen
      navigation.navigate('ClientDetail', { client: data })
    }
  }

  leadCreation = async (client, project, navigation, data, unit) => {
    const phones =
      client && client.customerContacts && client.customerContacts.map((item) => item.phone)
    const payload = {
      customerId: client && client.id,
      cityId: 3,
      projectId: project.value,
      projectName: project.name,
      projectType: unit.project.type,
      description: unit.name,
      phones: phones,
      minPrice: StaticData.PricesProject[0],
      maxPrice: StaticData.PricesProject[StaticData.PricesProject.length - 1],
    }
    await axios
      .post(`/api/leads/project`, payload)
      .then((response) => {
        this.newLeadNavigate(response, navigation, data, unit)
      })
      .catch((error) => {
        console.log('/api/leads/project', error)
      })
  }

  newLeadNavigate = (response, navigation, data, unit) => {
    const { dispatch } = this.props
    axios
      .get(`/api/leads/project/byId?id=${response.data.leadId}`)
      .then((res) => {
        dispatch(setlead(res.data))
        navigation.replace('CMLeadTabs', {
          screen: 'Payments',
          params: {
            lead: res.data,
            client: data,
            name: data.firstName + ' ' + data.lastName,
            unitData: unit,
          },
        })
      })
      .catch((error) => {
        console.log('/api/leads/project/byId?id - Error', error)
      })
  }

  addClient = () => {
    const { route, navigation } = this.props
    const { screenName, isFromDropDown = false, isPOC = false } = route.params
    navigation.navigate('AddClient', { update: false, isFromDropDown, screenName, isPOC })
  }

  handleLongPress = (val) => {
    const { route, navigation } = this.props
    const { isFromDropDown = false } = route.params
    if (!isFromDropDown) {
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
  }

  deleteClient = (val) => {
    let endPoint = ``
    let that = this
    endPoint = `api/customer/remove?id=${val.id}`
    axios
      .delete(endPoint)
      .then(function (response) {
        if (response.status === 200) {
          if (response.data.message) {
            helper.errorToast(response.data.message)
          } else {
            helper.successToast('CLIENT DELETED SUCCESSFULLY!')
            that.fetchCustomer()
          }
        }
      })
      .catch(function (error) {
        helper.errorToast(error.message)
      })
  }

  showDeleteDialog(val) {
    Alert.alert(
      'Delete Client',
      'Are you sure you want to delete this Client ?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => this.deleteClient(val) },
      ],
      { cancelable: false }
    )
  }

  createPermission = () => {
    const { permissions } = this.props
    return getPermissionValue(PermissionFeatures.CLIENTS, PermissionActions.CREATE, permissions)
  }

  render() {
    const { customers, loading, totalCustomers, onEndReachedLoader, searchText, page } = this.state
    const { user } = this.props
    let createPermission = this.createPermission()

    // let data = customers
    // if (searchText !== '' && data && data.length === 0) {
    //   data = fuzzy.filter(searchText, customers, {
    //     extract: (e) => (e.firstName ? e.firstName + ' ' + e.lastName : ''),
    //   })
    //   data = data.map((item) => item.original)
    // } else {
    //   data = customers
    // }
    return !loading ? (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={[AppStyles.container, styles.container]}>
          <Search
            placeholder="Search clients here"
            searchText={searchText}
            setSearchText={(value) => {
              this.setState({
                searchText: value,
                page: value === '' ? 1 : page,
                pageSize: 50,
              })
            }}
          />
          <Fab
            active="true"
            containerStyle={{ zIndex: 20 }}
            style={{ backgroundColor: AppStyles.colors.primaryColor }}
            position="bottomRight"
            onPress={() => {
              if (createPermission) this.addClient()
            }}
          >
            <Ionicons name="md-add" color="#ffffff" />
          </Fab>
          {customers && customers.length > 0 ? (
            <FlatList
              data={customers}
              renderItem={(item, index) => (
                <ClientTile
                  data={item}
                  handleLongPress={this.handleLongPress}
                  onPress={this.navigateTo}
                />
              )}
              onEndReached={() => {
                if (
                  customers.length < totalCustomers &&
                  onEndReachedLoader === false &&
                  searchText === ''
                ) {
                  this.setState(
                    {
                      page: this.state.page + 1,
                      onEndReachedLoader: true,
                    },
                    () => {
                      this.fetchCustomer()
                    }
                  )
                }
              }}
              onEndReachedThreshold={0.5}
              keyExtractor={(item, index) => item.id.toString()}
            />
          ) : (
            <NoResultsComponent imageSource={require('../../../assets/img/no-result-found.png')} />
          )}

          <OnLoadMoreComponent
            style={{ backgroundColor: 'white' }}
            onEndReached={onEndReachedLoader}
          />
        </View>
      </TouchableWithoutFeedback>
    ) : (
      <Loader loading={loading} />
    )
  }
}

mapStateToProps = (store) => {
  return {
    user: store.user.user,
    permissions: store.user.permissions,
  }
}

export default connect(mapStateToProps)(Client)
