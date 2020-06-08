import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

import AppStyles from '../../AppStyles'
import { StyleSheet } from 'react-native';

export default styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    elevation: 10,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: 'lightgrey',
    shadowOpacity: 1,
    borderRadius: 4,
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 10,
    marginBottom: hp('0.5%%'),
    // marginHorizontal: wp('2.5%')
  },

imageStyle: { 
    width: wp('32%'),
    height: wp('32%'),
    marginRight: wp('2%'),
    borderRadius: 4,
    borderWidth: 0.1,
    borderColor: AppStyles.colors.backgroundColor,
  },
  imageCountViewStyle: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    top: wp('4%'),
    left: 15,
    backgroundColor: '#000',
    opacity: 0.7,
    borderRadius: 4,
    width: wp('12%'),
    height: 20
  },
  imageCount: {
    color: 'white',
    paddingLeft: wp('1%')
  },
  currencyTextStyle: {
    fontFamily: AppStyles.fonts.semiBoldFont,
    fontSize: AppStyles.fontSize.large,
    marginTop: hp('0.5%'),
    letterSpacing: 0.6,
  },
  priceTextStyle: {
    width: wp('62%'),
    fontFamily: AppStyles.fonts.boldFont,
    fontSize: 22,
    color: AppStyles.colors.primaryColor,
    paddingLeft: wp('1%'),
    letterSpacing: 0.6,
  },
  textControlStyle: {
    paddingTop: hp('0.3%'),
    fontSize: AppStyles.fontSize.medium,
    fontFamily: AppStyles.fonts.defaultFont,
    width: wp('51%'),
  },
  phoneButton: {
    alignSelf: 'flex-end',
    marginRight:wp('1%'),
  },
  bedBathViewStyle: {
    flex:1,
    flexDirection: 'row',
    paddingLeft: wp('0.5%'),
    alignItems: 'flex-end',
  },
  bedTextStyle: {
    fontFamily: AppStyles.fonts.semiBoldFont,
    paddingLeft: wp('1.5%'),
    fontSize: AppStyles.fontSize.medium
  }

});