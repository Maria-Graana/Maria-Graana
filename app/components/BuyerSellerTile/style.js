/** @format */

import { StyleSheet } from 'react-native'
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  tileView: {
    minHeight: 100,
    backgroundColor: '#fff',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  titleView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  titleText: {
    alignSelf: 'center',
    fontFamily: AppStyles.fonts.semiBoldFont,
    fontSize: 16,
  },
  switchView: {
    borderColor: AppStyles.colors.primaryColor,
    borderWidth: 0,
    justifyContent: 'center',
    alignSelf: 'center',
  },
})
