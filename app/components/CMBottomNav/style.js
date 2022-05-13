/** @format */

import { StyleSheet } from 'react-native'
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  bottomNavMain: {
    flexDirection: 'row',
    alignItems:'center',
    backgroundColor: '#fff',
    elevation: 10,
    shadowOffset: { width: -5, height: -5 },
    shadowColor: 'lightgrey',
    shadowOpacity: 1,
    zIndex: 10,
    height: 65,
    borderTopWidth: 1,
    borderTopColor: AppStyles.colors.backgroundColor,
  },
  bottomNavBtn: {
    width: '20%',
    alignItems: 'center',
    paddingTop: 8,
  },
  bottomNavBtn2: {
    width: '20%',
    alignItems: 'center',
    paddingTop: 8,
  },
  align: {
    alignItems: 'center',
   width:70,

 
  },
  bottomNavImg: {

    resizeMode: 'contain',
    width: 25,
    height: 30,
  },
  bottomNavBtnText: {
    fontSize: 12,
    color: 'black',
  },
  forMenuIcon: {},
  colorWhite: {
    color: '#fff',
  },
  actionBtn: {
    width: '20%',
    alignItems: 'center',
    // paddingBottom: 15,
    paddingTop: 15,
    backgroundColor: AppStyles.colors.primaryColor,
    borderRadius: 5,
    marginHorizontal: 1,
    justifyContent: 'center',
    // padding: 5,
  },
  followBtn: {
  
    width: '20%',
    alignItems: 'center',
    marginHorizontal: 1,
    justifyContent: 'center',
    paddingVertical: 10,
    paddingTop: 5,
  },
  rejectBtn: {
    width: '20%',
    alignItems: 'center',
    paddingBottom: 15,
    paddingTop: 15,
    borderRadius: 5,
    marginHorizontal: 1,
    justifyContent: 'center',
    padding: 5,
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
  },
  followText: {
    fontSize: 12,
    textAlign: 'center',
    color: 'black',
  },
  menuStyle: {
    flexDirection: 'row',
    alignItems:'center',
    justifyContent: 'space-between',
    flex: 1,
    paddingVertical: 5,
  },
  menuText: {
    color: AppStyles.colors.primaryColor,
    fontFamily: AppStyles.fonts.semiBoldFont,
    fontSize: 14,
    flex: 1,
    paddingHorizontal: 10,
  },
  popMenu: {
    marginHorizontal: 1,
    width: '20%',
  },
})
