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
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f73ee',
    textAlign: 'center',
  },
  viewingBtn: {
    backgroundColor: AppStyles.colors.primaryColor,
    height: 50,
    borderBottomEndRadius: 10,
    borderBottomLeftRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewingAtBtn: {
    backgroundColor: 'white',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewingText: {
    color: 'white',
    fontFamily: AppStyles.fonts.boldFont,
    fontSize: 18,
  },
  viewingAtText1: {
    color: AppStyles.colors.primaryColor,
    fontFamily: AppStyles.fonts.defaultFont,
    fontSize: 18,
  },
  viewingAtText2: { fontFamily: AppStyles.fonts.lightFont, fontSize: 18 },
  viewingDoneBtn: {
    backgroundColor: AppStyles.colors.primaryColor,
    height: 50,
    borderBottomEndRadius: 10,
    borderBottomLeftRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  viewDoneText: { color: 'white', fontFamily: AppStyles.fonts.defaultFont, fontSize: 18 },
})
