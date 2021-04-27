/** @format */

import { StyleSheet } from 'react-native'
import { widthPercentageToDP as wp } from 'react-native-responsive-screen'
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  noImage: {
    width: 130,
    height: 140,
    borderRadius: 5,
  },
  callImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  tileContainer: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    height: 150,
    flexDirection: 'row',
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
  marlaText: {
    fontSize: 17,
    paddingTop: 2,
    fontFamily: AppStyles.fonts.defaultFont,
    color: AppStyles.colors.textColor,
  },
  addressText: {
    fontSize: 17,
    paddingTop: 5,
    fontFamily: AppStyles.fonts.defaultFont,
    color: AppStyles.colors.textColor,
  },
  iconContainer: {
    flexDirection: 'row',
  },
  textStyle: {
    fontSize: 12,
    fontFamily: AppStyles.fonts.defaultFont,
    color: AppStyles.colors.primaryColor,
  },
  mainView: {
    borderColor: AppStyles.colors.primaryColor,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconInner: {
    flexDirection: 'row',
    padding: 5,
  },
  phoneIcon: {
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingBottom: 0,
  },
  imageCountViewStyle: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    top: 10,
    left: 10,
    opacity: 0.7,
  },
  imageCount: {
    color: 'white',
    paddingLeft: wp('1%'),
  },
  menuView: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  phoneView: {
    borderRadius: 20,
    padding: 10,
    marginVertical: 5,
    marginRight: 7,
  },
  notCheckBox: {
    width: 25,
    height: 25,
    borderColor: AppStyles.colors.primaryColor,
    backgroundColor: '#fff',
  },
  checkBox: {
    width: 25,
    height: 25,
    borderColor: '#fff',
    backgroundColor: '#fff',
  },
  greenDot: {
    width: 20,
    height: 20,
  },
  textPadTop: {
    paddingTop: 5,
  },
  menuBtn: {
    width: 40,
    height: 40,
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 7,
  },
})
