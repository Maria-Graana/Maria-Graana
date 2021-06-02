/** @format */

import React from 'react'
import { Text, StyleSheet, TouchableOpacity, Image } from 'react-native'
import AppStyles from '../../AppStyles'

export default class CMBTN extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      extraStyle,
      onClick,
      btnImage,
      btnText,
      checkLeadClosedOrNot,
      extraTextStyle,
    } = this.props
    return (
      <TouchableOpacity
        style={[styles.addPaymentBtn, styles.noMargTop, extraStyle]}
        onPress={() => {
          if (checkLeadClosedOrNot) onClick()
        }}
      >
        {btnImage ? <Image style={styles.addPaymentBtnImg} source={btnImage} /> : null}
        <Text style={[styles.addPaymentBtnText, extraTextStyle]}>{btnText}</Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  addPaymentBtnText: {
    color: '#006ff1',
    fontSize: 18,
    fontFamily: AppStyles.fonts.semiBoldFont,
    letterSpacing: 2,
  },
  addPaymentBtnImg: {
    resizeMode: 'contain',
    width: 15,
    marginRight: 5,
    height: 15,
    position: 'relative',
    top: 3,
  },
  noMargTop: {
    marginTop: 0,
    marginBottom: 10,
  },
  addPaymentBtnText: {
    color: '#006ff1',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  addPaymentBtn: {
    flexDirection: 'row',
    borderColor: '#006ff1',
    borderRadius: 4,
    borderWidth: 1,
    color: '#006ff1',
    textAlign: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
    borderRadius: 4,
    marginBottom: 0,
    justifyContent: 'center',
    marginTop: 15,
  },
})
