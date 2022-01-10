/** @format */

import AppStyles from '../../AppStyles'
import { StyleSheet } from 'react-native'
import { widthPercentageToDP } from 'react-native-responsive-screen'

export default styles = StyleSheet.create({
  mainContainer: {
    marginVertical: 10,
  },
  timeView: {
    width: '17%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  time: {
    fontFamily: AppStyles.fonts.semiBoldFont,
    fontSize: 12,
    textAlign: 'right',
  },
  duration: {
    fontFamily: AppStyles.fonts.defaultFont,
    fontSize: 12,
    textAlign: 'right',
  },
  tileWrap: {
    flex: 1,
    // marginVertical: 5,
    elevation: 10,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: 'lightgrey',
    shadowOpacity: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    // borderRadius: 4,
    borderLeftWidth: 5,
    borderLeftColor: AppStyles.colors.primaryColor,
    // borderTopWidth: 0.5,
    // borderEndWidth: 0.5,
    // borderBottomWidth: 0.5,
    width: '87%',
    marginHorizontal: 5,
    // minHeight: 80,
  },
  rowTwo: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 15,
  },
  rowWidth100: {
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
  },
  taskType: {
    width: '90%',
    fontFamily: AppStyles.fonts.semiBoldFont,
    fontSize: 14,
    color: AppStyles.colors.textColor,
    paddingStart: 5,
  },
  classification: {
    fontFamily: AppStyles.fonts.semiBoldFont,
    fontSize: 12,
    width: '40%',
    //textAlign: 'center',
  },
  taskResponseView: {
    flexDirection: 'row',
    paddingHorizontal: 5,
    marginVertical: 10,
  },
  taskResponse: {
    paddingHorizontal: 10,
    fontFamily: AppStyles.fonts.semiBoldFont,
    fontSize: 12,
    paddingVertical: 2,
    borderRadius: 12,
    borderWidth: 0.5,
    paddingHorizontal: 10,
    textAlign: 'center',
    // backgroundColor: '#FFC61B',
  },
  requirements: {
    fontFamily: AppStyles.fonts.defaultFont,
    fontSize: 14,
    paddingVertical: 5,
    paddingHorizontal: 5,
  },
  bottomView: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  leadType: {
    paddingStart: 5,
    // paddingRight: 5,
    fontFamily: AppStyles.fonts.defaultFont,
    fontSize: 14,
    color: AppStyles.colors.textColor,
  },

  leadId: {
    paddingStart: 5,
    textDecorationLine: 'underline',
    fontFamily: AppStyles.fonts.lightFont,
    color: AppStyles.colors.primaryColor,
    fontSize: 14,
  },
})
