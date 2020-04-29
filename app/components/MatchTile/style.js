import { StyleSheet } from 'react-native';
import AppStyles from '../../AppStyles'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default styles = StyleSheet.create({
  noImage: {
    width: 130,
    height: 140,
    borderRadius: 5,
  },
  tileContainer: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    height: 150,
    flexDirection: 'row'
  },
  pad5: {
    padding: 5,
  },
  currencyText: {
    paddingTop: 5,
    fontSize: 15,
    fontFamily: AppStyles.fonts.lightFont
  },
  priceText: {
    fontSize: 22,
    fontFamily: AppStyles.fonts.semiBoldFont,
    color: AppStyles.colors.primaryColor
  },
  marlaText: {
    fontSize: 17,
    paddingTop: 2,
    fontFamily: AppStyles.fonts.defaultFont
  },
  addressText: {
    fontSize: 17,
    paddingTop: 5,
    fontFamily: AppStyles.fonts.defaultFont,
    color: AppStyles.colors.subTextColor
  },
  iconContainer: {
    flexDirection: 'row',
    paddingTop: 25
  },
  textStyle: {
    fontSize: 12,
    fontFamily: AppStyles.fonts.defaultFont,
    color: AppStyles.colors.primaryColor
  },
  mainView: {
    borderColor: AppStyles.colors.primaryColor,
    // height: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    // width: 80,
    borderWidth: 1,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center"
  },
  iconInner: {
    flexDirection: 'row',
    padding: 5
  },
  phoneIcon: {
    justifyContent: "space-between",
    padding: 10,
    paddingBottom: 0
  },
  imageCountViewStyle: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    top: 120,
    left: 10,
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
});