/** @format */

import React from 'react'
import { Image, StyleSheet, TouchableHighlight } from 'react-native'
import { connect } from 'react-redux'
import backArrow from '../../../assets/img/backArrow.png'
import AppStyles from '../../AppStyles'

class BackButton extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { onClick, containerStyle } = this.props
    return (
      <TouchableHighlight
        underlayColor={'lightgrey'}
        style={[styles.mainView, containerStyle]}
        onPress={onClick}
      >
        <Image source={backArrow} style={[styles.backImg]} />
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  mainView: {
    width: 50,
    height: 50,
    // flexDirection: 'row-reverse',
    justifyContent: 'center',
    // alignItems: 'center',
  },
  backImg: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    // alignSelf: 'center',
  },
})

mapStateToProps = (store) => {
  return {
    user: store.user.user,
  }
}

export default connect(mapStateToProps)(BackButton)
