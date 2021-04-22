/** @format */

import { StyleSheet, Platform } from 'react-native'
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  tileOfferBtn: {
    backgroundColor: 'white',
    height: 40,
    borderBottomEndRadius: 10,
    borderBottomLeftRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileAgreedBtn: {
    backgroundColor: AppStyles.colors.primaryColor,
    height: 40,
    borderBottomEndRadius: 10,
    borderBottomLeftRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileBtn: {
    backgroundColor: AppStyles.colors.primaryColor,
    height: 40,
    borderBottomEndRadius: 10,
    borderBottomLeftRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileText: {
    color: 'white',
    fontFamily: AppStyles.fonts.boldFont,
    fontSize: 16,
  },
})
