/** @format */

import { StyleSheet } from 'react-native'
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  modalMain: {
    backgroundColor: '#fff',
    // borderRadius: 10,
    padding: 15,
    paddingTop: 30,
    paddingBottom: 50,
    zIndex: 5,
    elevation: 5,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: '#33333312',
    shadowOpacity: 1,
  },
  timesBtn: {
    position: 'absolute',
    right: 15,
    top: 10,
  },
  timesImg: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  MainTileView: {
    borderBottomWidth: 1,
    borderColor: '#ECECEC',
    paddingTop: 15,
    paddingBottom: 15,
  },
  smallText: {
    color: '#1F2029',
    fontSize: 14,
    marginBottom: 3,
    textTransform: 'capitalize',
    fontFamily: AppStyles.fonts.defaultFont,
  },
  largeText: {
    color: '#1F2029',
    fontSize: 20,
    fontFamily: AppStyles.fonts.semiBoldFont,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})
