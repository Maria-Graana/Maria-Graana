/** @format */

import { Platform, StyleSheet } from 'react-native'
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  backImg: {
    width: 30,
    height: 30,
    marginTop: 5,
    resizeMode: 'contain',
  },
  headerView: {
    flexDirection: 'row',
    marginHorizontal: 15,
    paddingBottom: 10,
    // marginVertical: Platform.OS === 'android' ? 15 : 0,
  },
  headerStyle: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    paddingRight: 30,
    fontFamily: AppStyles.fonts.semiBoldFont,
    fontSize: 16,
  },
  okBtn: {
    borderWidth: 1,
    borderColor: AppStyles.colors.primaryColor,
    height: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  okBtnText: {
    color: AppStyles.colors.primaryColor,
    fontFamily: AppStyles.fonts.boldFont,
    fontSize: 18,
  },
})
