/** @format */

import React from 'react'
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native'
import { Ionicons, AntDesign } from '@expo/vector-icons'
import { connect } from 'react-redux'
import helper from '../../helper'
import Loader from '../loader'

import PickerComponent from '../../components/Picker/index'


import AppStyles from '../../AppStyles'
import StaticData from '../../StaticData'

import { setDrawerInternalMenu } from '../../actions/drawer'

class DropdownHeader extends React.Component {
    constructor(props) {
        super(props)
        //const { hasBooking = false } = this.props.route.params
    }

    showToast = () => {
        helper.internetToast('This icon indicates that ARMS is currently not connected to internet!')
    }





    render() {
        const { navigation, changePageType, pageType, hasBooking, isInternetConnected, updateLoader, dispatch,
            getIsTerminalUser } = this.props


        console.log("hasBooking", this.props)

        return (
           
              


                        <View style={{ flexDirection: 'row', flex: 1 }}>
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
                            <View style={{ flexDirection: 'row', width: 250, justifyContent: 'space-between', alignItems: 'center' }}>
                                <View style={{ width: 120, justifyContent: 'center', alignSelf: 'center', marginRight: 20 }}>

                                  

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

                                        placeholder={hasBooking ? 'Deal Filter' : 'Lead Filter'}
                                        onValueChange={changePageType}
                                        //  alert(pageType)}

                                        //changePageType

                                        selectedItem={pageType}


                                    />

                                    {/* <TouchableOpacity style={{ margin: 10 }} onPress={changePageType}><Text>checkk me</Text></TouchableOpacity> */}
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
        height: 40,
    },
})

export default connect(mapStateToProps)(DropdownHeader)
