/** @format */

import React from 'react'
import { Image, StyleSheet, TouchableHighlight } from 'react-native'
import { connect } from 'react-redux'
import backArrow from '../../../assets/img/backArrow.png'

class CancelButton extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const { onClick, containerStyle } = this.props
    return (
      <TouchableHighlight style={[styles.mainView, containerStyle]} onPress={onClick}>
        <Image source={backArrow} style={[styles.backImg]} />
      </TouchableHighlight>
    )
  }
}

const styles = StyleSheet.create({
  mainView: {
    width: 50,
    height: 50,
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backImg: {
    width: 30,
    height: 30,
    marginTop: 5,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
})

mapStateToProps = (store) => {
  return {
    user: store.user.user,
  }
}

export default connect(mapStateToProps)(CancelButton)
