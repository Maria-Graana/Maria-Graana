/** @format */

import { StyleSheet, Platform } from 'react-native'
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  tileOfferBtn: {
    backgroundColor: 'white',
    height: 50,
    borderBottomEndRadius: 10,
    borderBottomLeftRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileAgreedBtn: {
    backgroundColor: AppStyles.colors.primaryColor,
    height: 50,
    borderBottomEndRadius: 10,
    borderBottomLeftRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileBtn: {
    backgroundColor: AppStyles.colors.primaryColor,
    height: 50,
    borderBottomEndRadius: 10,
    borderBottomLeftRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileText: {
    color: 'white',
    fontFamily: AppStyles.fonts.boldFont,
    fontSize: 18,
  },
  agreedText: { color: 'white', fontFamily: AppStyles.fonts.lightFont, fontSize: 18 },
  offerText: { fontFamily: AppStyles.fonts.defaultFont, fontSize: 18 },
  viewText: { fontFamily: AppStyles.fonts.lightFont, fontSize: 18 },
  offerViewText: {
    color: AppStyles.colors.primaryColor,
    fontFamily: AppStyles.fonts.defaultFont,
    fontSize: 18,
  },
})
