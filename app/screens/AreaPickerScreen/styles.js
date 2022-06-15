/** @format */

import { React } from 'react'
import { StyleSheet } from 'react-native'
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen'
export default styles = StyleSheet.create({
  rowContainerMultipleStyle: {
    paddingTop: hp('1.5%'),
    paddingBottom: hp('1.5%'),
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    borderTopColor: '#ddd',
    borderTopWidth: 0.5,
  },
  rowTextStyle: {
    color: AppStyles.colors.textColor,
    fontSize: 18,
    width: wp('80%'),
  },
})
