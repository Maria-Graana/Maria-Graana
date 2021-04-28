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
  tileView: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  tileInnerView: {
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 0,
    height: 50,
    marginHorizontal: 10,
    flex: 0.8,
    justifyContent: 'center',
  },
  titleText: {
    letterSpacing: 1,
    fontFamily: AppStyles.fonts.semiBoldFont,
    color: AppStyles.colors.textColor,
  },
  iconView: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnView: {
    borderWidth: 1,
    marginHorizontal: 15,
    borderRadius: 5,
    borderColor: AppStyles.colors.primaryColor,
    backgroundColor: '#fff',
  },
})
