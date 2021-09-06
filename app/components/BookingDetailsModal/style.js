/** @format */

import { StyleSheet } from 'react-native'
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  modalMain: {
    backgroundColor: 'white',
    flex: 1,
    paddingHorizontal: 15,
  },
  timesBtn: {
    position: 'absolute',
    right: 15,
    top: 15,
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
  },
  largeText: {
    color: '#1F2029',
    fontSize: 20,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  safeView: { flex: 0, backgroundColor: AppStyles.colors.backgroundColor },
  flexView: { backgroundColor: 'white', flex: 1 },
  topHeader: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 50,
  },
  headerText: {
    fontFamily: AppStyles.fonts.boldFont,
    fontSize: 16,
    color: AppStyles.colors.primaryColor,
  },
  detailText: {
    fontFamily: AppStyles.fonts.defaultFont,
    fontSize: 14,
    color: AppStyles.colors.primaryColor,
  },
  barView: {
    height: 50,
    backgroundColor: AppStyles.colors.primaryColor,
    justifyContent: 'center',
  },
  barText: {
    color: 'white',
    marginHorizontal: 15,
    fontFamily: AppStyles.fonts.semiBoldFont,
    fontSize: 16,
  },
  padLeft: {
    paddingLeft: 15,
  },
  kfiBTN: {
    marginHorizontal: 15,
  },
})
