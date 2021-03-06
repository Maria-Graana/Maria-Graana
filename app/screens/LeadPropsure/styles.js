/** @format */

import { StyleSheet, Platform } from 'react-native'
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  viewButtonStyle: {
    backgroundColor: AppStyles.colors.primaryColor,
    height: 50,
    borderBottomEndRadius: 10,
    borderBottomLeftRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  propsureVerificationTextStyle: {
    fontFamily: AppStyles.fonts.boldFont,
    color: AppStyles.colors.primaryColor,
    fontSize: 18,
  },
  PVTextStyle: {
    fontFamily: AppStyles.fonts.boldFont,
    color: 'white',
    fontSize: 18,
  },
})
