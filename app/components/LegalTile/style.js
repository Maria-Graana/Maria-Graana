/** @format */

import { StyleSheet } from 'react-native'
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  badgeText: {
    fontFamily: AppStyles.fonts.defaultFont,
    color: AppStyles.colors.primaryColor,
    fontSize: 12,
    alignSelf: 'center',
  },
  badgeView: {
    borderColor: AppStyles.colors.primaryColor,
    borderWidth: 1,
    borderRadius: 15,
    height: 20,
    width: 20,
    marginRight: 5,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    // padding: 2,
  },
  legalBtnView: {
    flexDirection: 'row',
    // flex: 1,
    height: 70,
    backgroundColor: '#fff',
    marginVertical: 10,
    marginHorizontal: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4.65,
    elevation: 7,
  },
  tileTitle: {
    fontSize: 14,
    alignSelf: 'center',
    fontFamily: AppStyles.fonts.semiBoldFont,
  },
  checkCircle: {
    alignSelf: 'center',
    marginRight: 10,
  },
  menuTileInner: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statusTile: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  contentCenter: {
    justifyContent: 'center',
  },
  contentSpace: {
    justifyContent: 'space-between',
  },
  uploadedText: {
    color: AppStyles.colors.primaryColor,
    padding: 2,
    fontSize: 12,
  },
  dateText: {
    color: AppStyles.colors.textColor,
    fontSize: 12,
    fontFamily: AppStyles.fonts.defaultFont,
  },
  textPadding: {
    padding: 2,
    fontSize: 12,
    fontFamily: AppStyles.fonts.semiBoldFont,
  },
  hyperLinkPadding: {
    padding: 2,
    fontSize: 12,
    fontFamily: AppStyles.fonts.defaultFont,
    textDecorationLine: 'underline',
  },
  assignText: {
    color: AppStyles.colors.primaryColor,
    fontFamily: AppStyles.fonts.semiBoldFont,
  },
  tileStatus: {
    // position: 'absolute',
    // right: 0,
    fontSize: 10,
    padding: 5,
    paddingTop: 3,
    paddingBottom: 2,
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    paddingRight: 10,
    textTransform: 'uppercase',
    letterSpacing: 1,
    overflow: 'hidden',
    fontFamily: AppStyles.fonts.defaultFont,
  },
  statusYellow: {
    borderColor: '#d1d0a1',
    backgroundColor: '#f9f4d5',
    color: '#615743',
  },
  statusGreen: {
    borderColor: '#c0ccb7',
    backgroundColor: '#ddf3d4',
    color: '#4c6143',
  },
  statusRed: {
    borderColor: '#b38f8d',
    backgroundColor: '#ecc8c4',
    color: '#615643',
  },
})
