/** @format */

import { StyleSheet, Platform } from 'react-native'
import AppStyles from '../../AppStyles'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'

export default styles = StyleSheet.create({
  viewContainer: {
    marginLeft: 25,
    marginRight: 25,
    justifyContent: 'center',
    marginVertical: 15,
    borderRadius: 4,
  },
  closeStyle: {
    position: 'absolute',
    right: 15,
    top: Platform.OS == 'android' ? 10 : 40,
    paddingVertical: 5,
  },
  reportPrice: {
    marginRight: 25,
    fontFamily: AppStyles.fonts.semiBoldFont,
    fontSize: AppStyles.fontSize.medium,
    color: AppStyles.colors.primaryColor,
    alignSelf: 'center',
  },
  pkr: {
    color: AppStyles.colors.primaryColor,
    fontFamily: AppStyles.fonts.lightFont,
    fontSize: AppStyles.fontSize.medium,
  },
  tileView: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  totalView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
})
