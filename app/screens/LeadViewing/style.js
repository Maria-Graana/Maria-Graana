/** @format */

import { StyleSheet, Platform } from 'react-native'
import AppStyles from '../../AppStyles'
export default styles = StyleSheet.create({
  countView: {
    width: 20,
    height: 20,
    borderRadius: 18,
    backgroundColor: '#fff',
    marginLeft: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f73ee',
    textAlign: 'center',
  },
  viewingBtn: {
    backgroundColor: AppStyles.colors.primaryColor,
    height: 40,
    borderBottomEndRadius: 10,
    borderBottomLeftRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewingText: {
    color: 'white',
    fontFamily: AppStyles.fonts.boldFont,
    fontSize: 16,
  },
})
