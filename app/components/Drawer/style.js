/** @format */

import { StyleSheet, Platform } from 'react-native'
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  underLine: {
    height: 1,
    width: '100%',
    backgroundColor: '#f5f5f6',
    marginVertical: 10,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    marginTop: Platform.OS == 'android' ? 50 : 50,
  },
  textContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    paddingLeft: 10,
  },
  nameText: {
    fontSize: 15,
    marginBottom: Platform.OS == 'android' ? 2 : 6,
  },
  emailText: {
    fontSize: 11,
    color: AppStyles.colors.subTextColor,
  },
  mainOptionView: {
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.5,
    elevation: 5,
    borderRadius: 7,
    backgroundColor: '#FFF',
    marginLeft: 17,
    marginBottom: 15,
    marginRight: 1,
    marginTop: -10,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0
  },
  optionInnerView: {
    padding: 10,
    paddingVertical: 15,
    // width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionView: {
    width: '100%',
  },
  textColor: {
    color: '#4F4F4F',
    fontWeight: '500',
    fontSize: 12,
  },
  menuShapeView:{
    width: 1,
    height: 1,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    alignSelf: 'center',
    // shadowOffset: { width: 1, height: 1 },
    // shadowOpacity: 0.2,
    // elevation: 10,
    marginTop: -10,
    // left: widthPercentageToDP('50%'),
    // borderStyle: 'solid',
    backgroundColor: 'transparent',
    borderLeftColor: '#FFF',
    borderRightColor: '#FFF',
    borderBottomColor: 'grey',
  }
})
