/** @format */

import { StyleSheet } from 'react-native'
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  mandatoryText: {
    color: AppStyles.colors.primaryColor,
    fontFamily: AppStyles.fonts.boldFont,
    fontSize: 16,
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  mainView: {
    backgroundColor: '#e7ecf0',
    justifyContent: 'center',
  },
  pad15: { paddingHorizontal: 15 },
  padV15: { paddingVertical: 15 },
  transferView: {
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: AppStyles.colors.subTextColor,
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
})
