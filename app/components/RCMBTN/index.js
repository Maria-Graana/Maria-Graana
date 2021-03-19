/** @format */

import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native'
import AppStyles from '../../AppStyles'
export default class RCMBTN extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      extraStyle,
      onClick,
      btnImage,
      btnText,
      checkLeadClosedOrNot = false,
      hiddenBtn = false,
      isLeadClosed = false,
      disabledBtn = false,
      addBorder = false,
    } = this.props
    let newStyle = {}
    if (addBorder) {
      newStyle = {
        borderColor: AppStyles.colors.primaryColor,
        borderWidth: 1,
      }
    }
    return (
      <TouchableOpacity
        style={[
          styles.addPaymentBtn,
          styles.noMargTop,

          {
            backgroundColor: hiddenBtn || isLeadClosed ? '#ddd' : '#fff',
            borderColor: hiddenBtn || isLeadClosed ? '#ddd' : '#fff',
          },
          newStyle,
        ]}
        onPress={() => {
          // if (checkLeadClosedOrNot) onClick()
          onClick()
        }}
        disabled={hiddenBtn}
      >
        <Image style={styles.addPaymentBtnImg} source={btnImage} />
        <Text style={styles.addPaymentBtnText}>{btnText}</Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  addPaymentBtnText: {
    color: '#006ff1',
    fontSize: 14,
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
    backgroundColor: '#fff',
  },
})
