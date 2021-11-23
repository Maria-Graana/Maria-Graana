/** @format */

import { StyleSheet, Platform } from 'react-native'
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  arrowIcon: {
    position: 'absolute',
    right: 15,
    top: 12,
    zIndex: 2,
  },
  checkBoxRow: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  checkBoxText: {
    marginHorizontal: 15,
    color: AppStyles.colors.textColor,
    fontFamily: AppStyles.fonts.defaultFont,
    fontSize: 14,
  },
  checkBox: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
