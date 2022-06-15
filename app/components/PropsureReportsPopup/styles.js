/** @format */

import { StyleSheet, Platform } from 'react-native'
import AppStyles from '../../AppStyles'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen'
import { center } from '@turf/turf'

export default styles = StyleSheet.create({
  viewContainer: {
    marginLeft: 25,
    marginRight: 25,
  },
  closeStyle: {
    alignSelf: 'flex-end',
    width: 30,
    height: 30,
    marginRight: 15,
    marginTop: 10,
  },
  buttonExtraStyle: {
    marginHorizontal: 15,
    paddingVertical: 15,
    width: '90%',
  },
  reportRow: {
    flexDirection: 'row',
    paddingVertical: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  reportName: {
    marginLeft: 15,
    color: AppStyles.colors.textColor,
    fontFamily: AppStyles.fonts.defaultFont,
    fontSize: AppStyles.fontSize.medium,
    alignSelf: 'center',
  },
  reportPrice: {
    marginRight: 25,
    fontFamily: AppStyles.fonts.semiBoldFont,
    fontSize: AppStyles.fontSize.large,
    color: AppStyles.colors.primaryColor,
    paddingLeft: 5,
    alignSelf: 'center',
    // flex: 0.4,
  },
  pkr: {
    color: AppStyles.colors.primaryColor,
    fontFamily: AppStyles.fonts.lightFont,
    fontSize: AppStyles.fontSize.large,
  },
  totalView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listView: {
    flexDirection: 'row',
    flex: 0.8,
    marginHorizontal: 10,
  },
  notCheckBox: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 25,
    height: 25,
    borderColor: AppStyles.colors.primaryColor,
  },
  checkBox: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 25,
    height: 25,
    borderColor: '#fff',
  },
})
