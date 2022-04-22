/** @format */

import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen'

export default AppStyles = {
  container: {
    flex: 1,
    backgroundColor: '#e7ecf0',
    paddingHorizontal: wp('2%'),
  },


  container2: {
    //  flex: 1,
    backgroundColor: '#e7ecf0',
    paddingHorizontal: wp('2%'),
  },
  containerWithoutPadding: {
    flex: 1,
    backgroundColor: '#fff',
  },
  colors: {
    background: '#f4f9fd',
    font: '#434e5a',
    primary: '#484848',
    iconColor: '#fff',
    gradientColor: ['#2f2f2f', '#444'],
    primaryColor: '#0f73ee',
    textColor: '#1d1d26',
    subTextColor: '#a8a8aa',
    backgroundColor: '#e7ecf0',
    redBg: '#DC3546',
    yellowBg: '#FEC107',
    actionBg: '#0F73EF',
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },

  headingText: {
    fontFamily: 'Poppins_regular',

    fontSize: 14
  },

  boldHeadingText: {
    // fontFamily: 'Poppins_regular',
    fontWeight: 'bold',
    fontSize: 14
  },
  fonts: {
    defaultFont: 'Poppins_regular',
    boldFont: 'Poppins_bold',
    lightFont: 'Poppins_light',
    semiBoldFont: 'Poppins_semi_bold',
  },
  mb1: {
    flex: 1,
  },
  noramlSize: {
    fontSize: 12,
  },
  fontSize: {
    small: 10,
    medium: 16,
    large: 18,
  },
  standardPadding: {
    padding: 16,
  },
  noBorder: {
    borderWidth: 0,
    borderBottomWidth: 0,
  },
  // ****** Margins Classes
  noMargin: {
    marginTop: 0,
    marginBottom: 0,
  },
  mrTen: {
    marginRight: 10,
  },
  mrFive: {
    marginRight: 5,
  },
  mbTen: {
    marginBottom: 10,
  },
  mtTen: {
    marginTop: 10,
  },
  mbFive: {
    marginBottom: 5,
  },
  mlFive: {
    marginLeft: 5,
  },
  mlTen: {
    marginLeft: 10,
  },
  darkColor: {
    color: '#000',
  },
  lightColor: {
    color: '#333',
  },
  textCenter: {
    textAlign: 'center',
  },
  whiteColor: {
    color: '#fff',
  },
  standardPaddingVertical: {
    paddingVertical: 16,
  },
  standardMarginVertical: {
    marginVertical: 16,
  },
  mainInputWrap: {
    position: 'relative',
    marginBottom: 15,
    marginTop: 15,
  },
  inputWrap: {
    position: 'relative',
  },
  countPrice: {
    position: 'absolute',
    right: 0,
    top: 16,
    color: '#0f73ee',
    fontWeight: 'bold',
    fontSize: 12,
    width: 60,
    textAlign: 'right',
  },
  minMaxPrice: {
    paddingRight: 90,
  },
  formControl: {
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 0,
    height: 50,
    color: '#1d1d26',
    fontFamily: 'OpenSans_regular',
  },
  formFontSettings: {
    fontSize: 14,
    fontFamily: 'OpenSans_regular',
  },
  formControlForPicker: {
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 0,
    height: 50,
  },
  inputPadLeft: {
    paddingLeft: 15,
  },
  multiFormInput: {
    flexDirection: 'row',
  },
  flexOne: {
    width: '48%',
  },
  flexMarginRight: {
    marginRight: 0,
    marginLeft: '4%',
  },
  latLngMain: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 4,
    marginTop: 15,
    marginBottom: 15,
    overflow: 'hidden',
    position: 'relative',
  },
  locationBtn: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#fff',
    height: '100%',
    width: '14%',
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderColor: '#EAEEF1',
  },
  locationIcon: {
    width: 28,
    height: 28,
  },
  borderrightLat: {
    borderRightWidth: 1,
    borderColor: '#EAEEF1',
  },
  bgcWhite: {
    backgroundColor: '#fff',
  },
  latLngInputWrap: {
    width: '43%',
  },
  formBtn: {
    justifyContent: 'center',
    minHeight: 55,
    borderRadius: 4,
    backgroundColor: '#0f73ee',
    padding: 15,
  },
  btnText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'OpenSans_bold',
    letterSpacing: 0.6,
  },
  pickerTextStyle: {
    fontSize: 14,
    fontFamily: 'OpenSans_regular',
  },
  require: {
    color: 'red',
    fontSize: 10,
    marginTop: 5,
  },


  bottomStickyButton: {
    marginBottom: 30,

    marginTop: 10,
  },
  mainInputWrap: {
    marginBottom: 10,
    marginTop: 10,
  },
  modalMain: {
    paddingBottom: 50,
    paddingTop: 15,
  },
  mainBlackWrap: {
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 4,
    overflow: 'hidden',
  },
  blackInputWrap: {
    width: '55%',
    padding: 5,
    paddingRight: 0,
    position: 'relative',
  },
  fullWidth: {
    width: '100%',
  },
  fullWidthPad: {
    width: '100%',
    padding: 5,
    position: 'relative',
  },
  blackInputText: {
    color: '#000',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  blackInput: {
    minHeight: 30,
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0F74EE',
  },
  blackInputdate: {
    position: 'relative',
    top: 20,
    width: '45%',
  },
  dateText: {
    letterSpacing: 2,
    fontSize: 10,
  },
  lineView: {
    position: 'relative',
    top: 0,
    left: 0,
    height: 2,
    backgroundColor: '#333',
  },
  formBtnWithWhiteBg: {
    justifyContent: 'center',
    minHeight: 55,
    borderRadius: 4,
    backgroundColor: '#fff',
    padding: 15,
    borderWidth: 1,
    borderColor: '#0f73ee',
  },
  btnTextBlue: {
    color: '#0f73ee',
    fontSize: 18,
    fontFamily: 'OpenSans_bold',
    letterSpacing: 0.6,
  },
  mainCMBottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    zIndex: 22,
  },
}
