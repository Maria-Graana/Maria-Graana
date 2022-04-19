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

class ClientDetail extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      client: {},
      loading: true,
      clientPhones: {
        contact2: null,
        contact3: null,
      },
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
            this.setState({ client: res.data, loading: false, clientPhones })
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
        return 'Personal Client'
      else return client.assigned_to_organization ? client.assigned_to_organization : ''
    } else {
      if (client.originalOwner.id === user.id) return 'Personal Client'
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

  render() {
    const { user } = this.props
    const { client, loading, clientPhones } = this.state
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
              <Text style={styles.labelText}>{client.dob}</Text>
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
        </ScrollView>
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
