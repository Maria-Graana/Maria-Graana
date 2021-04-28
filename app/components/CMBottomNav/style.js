/** @format */

import { StyleSheet } from 'react-native'
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  bottomNavMain: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    elevation: -3,
    shadowOffset: { width: -1, height: -1 },
    shadowColor: '#33333312',
    shadowOpacity: 1,
  },
  bottomNavBtn: {
    width: '20%',
    alignItems: 'center',
    paddingBottom: 15,
    paddingTop: 15,
  },
  bottomNavBtn2: {
    width: '20%',
    alignItems: 'center',
    paddingBottom: 15,
    paddingTop: 15,
  },
  align: {
    alignItems: 'center',
  },
  bottomNavImg: {
    resizeMode: 'contain',
    width: 25,
    height: 25,
  },
  bottomNavBtnText: {
    marginTop: 5,
    color: AppStyles.colors.primaryColor,
    fontSize: 16,
    fontFamily: AppStyles.fonts.boldFont,
  },
  forMenuIcon: {
    backgroundColor: '#0E73EE',
  },
  colorWhite: {
    color: '#fff',
  },
  actionBtn: {
    width: '20%',
    alignItems: 'center',
    // paddingBottom: 15,
    // paddingTop: 15,
    backgroundColor: AppStyles.colors.primaryColor,
    borderRadius: 5,
    marginHorizontal: 1,
    justifyContent: 'center',
    // padding: 5,
  },
  followBtn: {
    width: '20%',
    alignItems: 'center',
    paddingBottom: 15,
    paddingTop: 15,
    backgroundColor: '#F0B512',
    borderRadius: 5,
    marginHorizontal: 1,
    justifyContent: 'center',
    padding: 5,
  },
  rejectBtn: {
    width: '20%',
    alignItems: 'center',
    paddingBottom: 15,
    paddingTop: 15,
    backgroundColor: '#D73344',
    borderRadius: 5,
    marginHorizontal: 1,
    justifyContent: 'center',
    padding: 5,
  },
  actionText: {
    color: '#fff',
    fontFamily: AppStyles.fonts.boldFont,
    fontSize: 16,
  },
  followText: {
    fontFamily: AppStyles.fonts.boldFont,
    fontSize: 16,
    textAlign: 'center',
  },
  menuStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    marginVertical: 5,
  },
  menuText: {
    color: AppStyles.colors.primaryColor,
    fontFamily: AppStyles.fonts.semiBoldFont,
    fontSize: 16,
    flex: 1,
    paddingHorizontal: 10,
  },
  popMenu: {
    marginHorizontal: 1,
    width: '20%',
  },
})
