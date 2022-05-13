/** @format */

import React from 'react'
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native'
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
                // backgroundColor:'red'
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

                        //  backgroundColor: 'red',
                        alignItems: 'center',
                        width: 200,

                    }}>
                        <View style={{

                            //  width: 160, 
                            justifyContent: 'center', alignSelf: 'center',
                            // marginRight: 20
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
                                    customStyle={styles.pickerStyle}
                                    customIconStyle={styles.customIconStyle}
                                    onValueChange={(value) => {

                                        dispatch(setLeadsDropdown(value))
                                    }
                                    }
                                    selectedItem={leadsDropdown}
                                    showPickerArrow={true}
                                />
                                :
                                <PickerComponent

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
                    <TouchableOpacity
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
