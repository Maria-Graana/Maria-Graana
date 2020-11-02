/** @format */

import { StyleSheet } from 'react-native'
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  noImage: {
    width: 110,
    height: 110,
    borderRadius: 5,
  },
  underLine: {
    borderLeftWidth: 1,
    borderLeftColor: '#f5f5f6',
    // marginRight: 5,
    height: 90,
    marginVertical: 20,
    padding: 10,
  },
  agentText: {
    fontFamily: AppStyles.fonts.lightFont,
    fontSize: 17,
    paddingTop: 2,
  },
  labelText: {
    fontFamily: AppStyles.fonts.defaultFont,
    fontSize: 16,
    paddingBottom: 5,
  },
  tileContainer: {
    flex: 1,
    backgroundColor: 'white',
    marginVertical: 2,
    borderRadius: 5,
    height: 160,
    flexDirection: 'row',
  },
  marlaText: {
    fontSize: 17,
    paddingTop: 2,
    fontFamily: AppStyles.fonts.defaultFont,
  },
  pad5: {
    padding: 5,
  },
  currencyText: {
    paddingTop: 5,
    fontSize: 15,
    fontFamily: AppStyles.fonts.lightFont,
  },
  priceText: {
    fontSize: 22,
    fontFamily: AppStyles.fonts.semiBoldFont,
    color: AppStyles.colors.primaryColor,
  },
  addressText: {
    fontSize: 17,
    paddingTop: 5,
    fontFamily: AppStyles.fonts.defaultFont,
    color: AppStyles.colors.subTextColor,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  iconInner: {
    flexDirection: 'row',
    padding: 5,
  },
  textStyle: {
    fontSize: 12,
    fontFamily: AppStyles.fonts.defaultFont,
    color: AppStyles.colors.primaryColor,
  },
  mainView: {
    borderColor: AppStyles.colors.primaryColor,
    // height: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    // width: 80,
    borderWidth: 1,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneIcon: {
    justifyContent: 'space-between',
    padding: 10,
  },
})
