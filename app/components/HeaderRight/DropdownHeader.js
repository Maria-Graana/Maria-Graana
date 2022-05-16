/** @format */

import React from 'react'
import { TouchableOpacity, Platform, Text, StyleSheet, View } from 'react-native'
import { Ionicons, AntDesign } from '@expo/vector-icons'
import { connect } from 'react-redux';

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
        const { navigation, leadType, leadsDropdown, changePageType, pageType, hasBooking, isInternetConnected, updateLoader, dispatch,
            getIsTerminalUser } = this.props

        return (

            <View style={{
                flexDirection: 'row', flex: 1,

            }}>
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
                <View style={{
                    flexDirection: 'row',
                    width: 300,
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <View style={{
                        width: '65%',
                    }}>
                        <View style={{

                        }}>

                            <View style={{
                                width: Platform.OS === 'ios' ? null :leadsDropdown==='&pageType=myLeads&hasBooking=false' ||leadsDropdown=== '&pageType=myDeals&hasBooking=true'?110: 165, //160,

                                alignSelf: 'center',
                            }}>
                                {leadType == 'ProjectLeads' ?


                                    <PickerComponent

                                        placeholder={hasBooking ? 'Deal Filter' : 'Lead Filter'}
                                        data={
                                            hasBooking
                                                ? getIsTerminalUser
                                                    ? StaticData.filterDealsValueProjectTerminal
                                                    : StaticData.filterDealsValueProject
                                                : getIsTerminalUser
                                                    ? StaticData.filterLeadsValueProjectTerminal
                                                    : StaticData.filterLeadsValueProject
                                        }

                                        customStyle={[styles.pickerStyle]}
                                        customIconStyle={styles.customIconStyle}
                                        onValueChange={(value) => {

                                            dispatch(setLeadsDropdown(value))
                                        }
                                        }
                                        selectedItem={leadsDropdown}
                                        showPickerArrow={Platform.OS === 'ios' ? false : true}
                                    />

                                    :
                                    <PickerComponent
                                        showPickerArrow={Platform.OS === 'ios' ? false : true}

                                        data={
                                            hasBooking
                                                ? getIsTerminalUser
                                                    ? StaticData.filterDealsValueTerminal
                                                    : StaticData.filterDealsValue
                                                : getIsTerminalUser
                                                    ? StaticData.filterLeadsValueTerminal
                                                    : StaticData.filterLeadsValue
                                        }
                                        customStyle={styles.pickerStyle}
                                        customIconStyle={styles.customIconStyle}

                                        placeholder={hasBooking ? 'Deal Filter' : 'Lead Filter'}
                                        onValueChange={(value) => {

                                            dispatch(setLeadsDropdown(value))
                                        }
                                        }
                                        selectedItem={leadsDropdown}

                                    />}

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
                        <Ionicons name="ios-menu" size={40} color="#484848" style={styles.icon} />
                    </TouchableOpacity>

                </View>
            </View>
        );


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
    },
    customIconStyle: {
        fontSize: 24,
    },
    pickerStyle: {
        height: 44,
    },
})

export default connect(mapStateToProps)(DropdownHeader)
