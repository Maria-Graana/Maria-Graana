/** @format */

import React from 'react'
import styles from './style'
import { View, Text, ScrollView } from 'react-native'
import { connect } from 'react-redux'
import AppStyles from '../../AppStyles'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Ability from '../../hoc/Ability'
import helper from '../../helper'
import axios from 'axios'
import Loader from '../../components/loader'
import { getPermissionValue } from '../../hoc/Permissions'
import { PermissionActions, PermissionFeatures } from '../../hoc/PermissionsTypes'
import TouchableButton from '../../components/TouchableButton'
import { FAB } from 'react-native-paper'

class ClientDetail extends React.Component {
  constructor(props) {
    super(props)
    const { permissions } = this.props
    this.state = {
      client: {},
      loading: true,
      clientPhones: {
        contact2: null,
        contact3: null,
      },
      open: false,
      fabActions: [],
      createBuyRentLead: getPermissionValue(
        PermissionFeatures.BUY_RENT_LEADS,
        PermissionActions.CREATE,
        permissions
      ),
      createProjectLead: getPermissionValue(
        PermissionFeatures.PROJECT_LEADS,
        PermissionActions.CREATE,
        permissions
      ),
    }
  }

  componentDidMount() {
    this._unsubscribe = this.props.navigation.addListener('focus', () => {
      this.fetchCustomer()
    })
  }

  navigateTo = () => {
    const { client } = this.state
    const copyClient = Object.assign(client, {})
    copyClient.firstName = client.first_name // have to add additional keys in case of lead bcs it doesnot exist when coming from lead detail screen
    copyClient.lastName = client.last_name // The format is different in api's so adding keys to adjust and display
    this.props.navigation.navigate('AddClient', { client: copyClient, update: true })
  }

  goToFormPage = (page, status, client) => {
    const { navigation } = this.props
    navigation.navigate(page, {
      pageName: status,
      client,
      name: client && client.first_name + ' ' + client.last_name,
    })
  }

  fetchCustomer = () => {
    const { route } = this.props
    const { client } = route.params
    this.setState(
      {
        loading: true,
        clientPhones: {
          contact2: null,
          contact3: null,
        },
      },
      () => {
        const url = `api/customer/${client.id}`
        axios
          .get(url)
          .then((res) => {
            let oneClient = res.data
            const { clientPhones } = this.state
            if (oneClient.customerContacts.length) {
              oneClient.customerContacts.map((item) => {
                if (item.phone !== oneClient.phone && !clientPhones.contact2)
                  clientPhones.contact2 = item.phone
                if (
                  item.phone !== oneClient.phone &&
                  clientPhones.contact2 &&
                  clientPhones.contact2 !== item.phone
                )
                  clientPhones.contact3 = item.phone
              })
            }
            this.setState({ client: res.data, loading: false, clientPhones }, () =>
              this.setFabActions()
            )
          })
          .catch((error) => {
            console.log(`URL: ${url}`)
            console.log(error)
          })
      }
    )
  }

  checkClient = () => {
    const { user } = this.props
    const { client } = this.state

    if (!client.originalOwner) {
      if (client.assigned_to_armsuser_id && client.assigned_to_armsuser_id === user.id)
        return client.clientSource == null ? 'Personal Client' : client.clientSource
      else return client.assigned_to_organization ? client.assigned_to_organization : ''
    } else {
      if (client.originalOwner.id === user.id) client.clientSource == null ? 'Personal Client' : client.clientSource 
      else {
        if (client.originalOwner.organization) return client.originalOwner.organization.name
        else return client.originalOwner.firstName + ' ' + client.originalOwner.lastName
      }
    }
  }

  updatePermission = () => {
    const { permissions } = this.props
    return getPermissionValue(PermissionFeatures.CLIENTS, PermissionActions.UPDATE, permissions)
  }

  setFabActions = () => {
    const { createBuyRentLead, createProjectLead, client } = this.state
    let fabActions = []
    if (createBuyRentLead) {
      fabActions.push({
        icon: 'plus',
        label: 'Add Buy/Rent Lead',
        color: AppStyles.colors.primaryColor,
        onPress: () => this.goToFormPage('AddRCMLead', 'RCM', client),
      })
    }
    if (createProjectLead) {
      fabActions.push({
        icon: 'plus',
        label: 'Add Project Lead',
        color: AppStyles.colors.primaryColor,
        onPress: () => this.goToFormPage('AddCMLead', 'CM', client),
      })
    }
    this.setState({
      fabActions: fabActions,
    })
  }

  render() {
    const { user, permissions } = this.props
    const {
      client,
      loading,
      clientPhones,
      open,
      fabActions,
      createProjectLead,
      createBuyRentLead,
    } = this.state
    let updatePermission = this.updatePermission()
    let belongs = this.checkClient()
    return !loading ? (
      <View
        style={[
          AppStyles.container,
          styles.container,
          { backgroundColor: AppStyles.colors.backgroundColor },
        ]}
      >
        <ScrollView>
          <View style={styles.outerContainer}>
            <View style={styles.innerContainer}>
              <Text style={styles.headingText}>First Name</Text>
              <Text style={styles.labelText}>{client.first_name}</Text>
              <Text style={styles.headingText}>Last Name</Text>
              <Text style={styles.labelText}>{client.last_name}</Text>
              <Text style={styles.headingText}>Contact Number</Text>
              <Text style={styles.labelText}>{client.phone}</Text>
              <Text style={styles.headingText}>Contact Number 2</Text>
              <Text style={styles.labelText}>{clientPhones.contact2 && clientPhones.contact2}</Text>
              <Text style={styles.headingText}>Contact Number 3</Text>
              <Text style={styles.labelText}>{clientPhones.contact3 && clientPhones.contact3}</Text>
              <Text style={styles.headingText}>Email</Text>
              <Text style={styles.labelText}>{client.email}</Text>
              <Text style={styles.headingText}>CNIC/NTN</Text>
              <Text style={styles.labelText}>
                {client.cnic && helper.normalizeCnicAndNTN(client.cnic)}
              </Text>
              <Text style={styles.headingText}>Son / Daughter/ Spouse of</Text>
              <Text style={styles.labelText}>{client.relativeName}</Text>
              <Text style={styles.headingText}>Date Of Birth</Text>
              <Text style={styles.labelText}>
                {client?.dob ? helper.formatDate(client.dob) : ''}
              </Text>
              <Text style={styles.headingText}>Nationality</Text>
              <Text style={styles.labelText}>{client.nationality}</Text>
              <Text style={styles.headingText}>Profession</Text>
              <Text style={styles.labelText}>{client.profession}</Text>
              <Text style={styles.headingText}>Passport</Text>
              <Text style={styles.labelText}>{client.passport}</Text>
              {/* Mailing Address */}
              <Text style={[styles.labelText]}>Mailing Address:</Text>
              <Text style={styles.headingText}>Country</Text>
              <Text style={styles.labelText}>{client.mCountry}</Text>
              <Text style={styles.headingText}>Province</Text>
              <Text style={styles.labelText}>{client.mProvince}</Text>
              <Text style={styles.headingText}>District</Text>
              <Text style={styles.labelText}>{client.mDistrict}</Text>
              <Text style={styles.headingText}>City</Text>
              <Text style={styles.labelText}>{client.mCity}</Text>
              <Text style={styles.headingText}>Address</Text>
              <Text style={styles.labelText}>{client.mAddress}</Text>
              {/* Permanent Address */}
              <Text style={[styles.labelText]}>Permanent Address:</Text>
              <Text style={styles.headingText}>Country</Text>
              <Text style={styles.labelText}>{client.country}</Text>
              <Text style={styles.headingText}>Province</Text>
              <Text style={styles.labelText}>{client.province}</Text>
              <Text style={styles.headingText}>District</Text>
              <Text style={styles.labelText}>{client.district}</Text>
              <Text style={styles.headingText}>City</Text>
              <Text style={styles.labelText}>{client.city}</Text>
              <Text style={styles.headingText}>Address</Text>
              <Text style={styles.labelText}>{client.address}</Text>
              <Text style={styles.headingText}>Belongs To</Text>
              <Text style={styles.labelText}>{belongs}</Text>
            </View>
            <View style={styles.pad}>
              <MaterialCommunityIcons
                onPress={() => {
                  if (updatePermission) this.navigateTo()
                }}
                name="square-edit-outline"
                size={26}
                color={AppStyles.colors.primaryColor}
              />
            </View>
          </View>
          {/* <View style={styles.buttonInputWrap}>
            {getPermissionValue(
              PermissionFeatures.PROJECT_LEADS,
              PermissionActions.CREATE,
              permissions
            ) && (
                <TouchableButton
                  containerStyle={styles.timePageBtn}
                  label="Add Project Lead"
                  borderColor="white"
                  containerBackgroundColor="#0f73ee"
                  borderWidth={1}
                  fontSize={14}
                  // disabled={disabled}
                  onPress={() => this.goToFormPage('AddCMLead', 'CM', client)}
                />
              )}
            {getPermissionValue(
              PermissionFeatures.BUY_RENT_LEADS,
              PermissionActions.CREATE,
              permissions
            ) && (
                <TouchableButton
                  containerStyle={styles.timePageBtn}
                  containerBackgroundColor="white"
                  textColor="#0f73ee"
                  borderColor="#0f73ee"
                  borderWidth={1}
                  label="Add Buy/Rent Lead"
                  fontSize={14}
                  // disabled={disabled}
                  onPress={() => this.goToFormPage('AddRCMLead', 'RCM', client)}
                />
              )}
          </View> */}
        </ScrollView>
        {createProjectLead || createBuyRentLead ? (
          <FAB.Group
            open={open}
            icon="plus"
            style={{ marginBottom: 16 }}
            fabStyle={{ backgroundColor: AppStyles.colors.primaryColor }}
            color={AppStyles.bgcWhite.backgroundColor}
            actions={fabActions}
            onStateChange={({ open }) => this.setState({ open })}
          />
        ) : null}
      </View>
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

export default connect(mapStateToProps)(ClientDetail)
