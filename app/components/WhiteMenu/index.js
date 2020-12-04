/** @format */

import React from 'react'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import { Ionicons, AntDesign } from '@expo/vector-icons'
import helper from '../../helper'
import { connect } from 'react-redux'
import Loader from '../loader'

class WhiteMenu extends React.Component {
  constructor(props) {
    super(props)
  }

  showToast = () => {
    helper.internetToast('This icon indicates that ARMS is currently not connected to internet!')
  }

  render() {
    const { navigation, isInternetConnected, updateLoader } = this.props
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
          {isInternetConnected && updateLoader ? (
            <Loader size={'small'} color={'white'} loading={true} />
          ) : null}
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.openDrawer()
          }}
        >
          <Ionicons name="ios-menu" size={40} color="#ffffff" style={styles.icon} />
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

export default connect(mapStateToProps)(WhiteMenu)
