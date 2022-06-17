/** @format */

import React from 'react'
import { TouchableOpacity, Platform, Text, StyleSheet, View } from 'react-native'
import { Ionicons, AntDesign } from '@expo/vector-icons'
import { connect } from 'react-redux'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import helper from '../../helper'
import Loader from '../loader'

import PickerComponent from '../../components/Picker/select'

import StaticData from '../../StaticData'

import { setDrawerInternalMenu } from '../../actions/drawer'
import { setLeadsDropdown } from '../../actions/leadsDropdown'

class DropdownHeader extends React.Component {
  constructor(props) {
    super(props)
  }

  showToast = () => {
    helper.internetToast('This icon indicates that ARMS is currently not connected to internet!')
  }

  render() {
    const {
      navigation,
      leadType,
      leadsDropdown,
      changePageType,
      pageType,
      hasBooking,
      isInternetConnected,
      updateLoader,
      dispatch,
      getIsTerminalUser,
    } = this.props

    return (
      <View
        style={{
          flexDirection: 'row',
          flex: 1,
        }}
      >
        {!isInternetConnected ? (
          <TouchableOpacity
            onPress={() => {
              this.showToast()
            }}
          >
            <AntDesign name="warning" size={30} color="#FF9631" style={styles.icon} />
          </TouchableOpacity>
        ) : null}

        <View style={{ margin: 5 }}>
          {isInternetConnected && updateLoader ? <Loader size={'small'} loading={true} /> : null}
        </View>
        <View
          style={{
            flexDirection: 'row',
            width: 300,
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: '65%',
            }}
          >
            <View style={{}}>
              <View
                style={{
                  width:
                    Platform.OS === 'ios'
                      ? null
                      : leadsDropdown === '&pageType=myLeads&hasBooking=false' ||
                        leadsDropdown === '&pageType=myDeals&hasBooking=true'
                      ? wp('30')
                      : leadsDropdown === '&pageType=referredLeads&hasBooking=false'
                      ? wp('43%')
                      : wp('50%'),
                  alignSelf: 'center',
                }}
              >
                {leadType == 'ProjectLeads' ? (
                  <PickerComponent
                    placeholder={hasBooking ? 'Deal Filter' : 'Lead Filter'}
                    hidePlaceholder={true}
                    data={
                      hasBooking
                        ? getIsTerminalUser
                          ? StaticData.filterDealsValueProjectTerminal
                          : StaticData.filterDealsValueProject
                        : getIsTerminalUser
                        ? StaticData.filterLeadsValueProjectTerminal
                        : StaticData.filterLeadsValueProject
                    }
                    // customStyle={[styles.pickerStyle]}
                    // customIconStyle={styles.customIconStyle}
                    onValueChange={(value) => {
                      dispatch(setLeadsDropdown(value))
                    }}
                    selectedItem={leadsDropdown}
                    showPickerArrow={false}
                  />
                ) : (
                  <PickerComponent
                    showPickerArrow={false}
                    hidePlaceholder={true}
                    data={
                      hasBooking
                        ? getIsTerminalUser
                          ? StaticData.filterDealsValueTerminal
                          : StaticData.filterDealsValue
                        : getIsTerminalUser
                        ? StaticData.filterLeadsValueTerminal
                        : StaticData.filterLeadsValue
                    }
                    // customStyle={styles.pickerStyle}
                    // customIconStyle={styles.customIconStyle}
                    placeholder={hasBooking ? 'Deal Filter' : 'Lead Filter'}
                    onValueChange={(value) => {
                      dispatch(setLeadsDropdown(value))
                    }}
                    selectedItem={leadsDropdown}
                  />
                )}
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={{ width: '15%', alignSelf: 'flex-end' }}
            onPress={() => {
              dispatch(setDrawerInternalMenu(false))
              navigation.openDrawer()
            }}
          >
            <Ionicons name="ios-menu" size={40} color="#484848" style={styles.sideIcon} />
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

mapStateToProps = (store) => {
  return {
    isInternetConnected: store.user.isInternetConnected,
    updateLoader: store.user.updateLoader,
    getIsTerminalUser: store.user.getIsTerminalUser,
    leadsDropdown: store.leadsDropdown.leadsDropdown,
  }
}

const styles = StyleSheet.create({
  icon: {
    paddingRight: 15,
    top: 10,
  },
  sideIcon: {
    paddingRight: 15,
  },
  customIconStyle: {
    fontSize: 24,
  },
  pickerStyle: {
    height: 44,
  },
})

export default connect(mapStateToProps)(DropdownHeader)
