/** @format */

import React from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import { Ionicons, AntDesign } from '@expo/vector-icons'
import { connect } from 'react-redux'
import helper from '../../helper'
import Loader from '../loader'
import { setDrawerInternalMenu } from '../../actions/drawer'

class HeaderRight extends React.Component {
  constructor(props) {
    super(props)
  }

  showToast = () => {
    helper.internetToast('This icon indicates that ARMS is currently not connected to internet!')
  }

  render() {
    const { navigation, isInternetConnected, updateLoader, dispatch } = this.props
    return (
      <View style={{ flexDirection: 'row' }}>
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

        <TouchableOpacity
          onPress={() => {
            dispatch(setDrawerInternalMenu(false))
            navigation.openDrawer()
          }}
        >
          <Ionicons name="ios-menu" size={40} color="#484848" style={styles.icon} />
        </TouchableOpacity>
      </View>
    )
  }
}

mapStateToProps = (store) => {
  return {
    isInternetConnected: store.user.isInternetConnected,
    updateLoader: store.user.updateLoader,
  }
}

const styles = StyleSheet.create({
  icon: {
    paddingRight: 15,
  },
})

export default connect(mapStateToProps)(HeaderRight)
