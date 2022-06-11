/** @format */

import { StyleSheet } from 'react-native'
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  timePageBtn: {
    justifyContent: 'center',
    borderRadius: 8,
    padding: 10,
    marginLeft: 15,
    marginRight: 15,
  },
  mandatoryText: {
    color: AppStyles.colors.primaryColor,
    fontFamily: AppStyles.fonts.boldFont,
    fontSize: 16,
    paddingHorizontal: 15,
  },
  mainView: {
    backgroundColor: '#e7ecf0',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  pad15: { paddingHorizontal: 15 },
  padV15: { paddingVertical: 15 },
  transferView: {
    backgroundColor: '#fff',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: AppStyles.colors.subTextColor,
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  tileView: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  tileInnerView: {
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 0,
    height: 50,
    marginHorizontal: 10,
    flex: 0.8,
    justifyContent: 'center',
  },
  titleText: {
    letterSpacing: 1,
    fontFamily: AppStyles.fonts.semiBoldFont,
    color: AppStyles.colors.textColor,
  },
  iconView: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnView: {
    borderWidth: 1,
    marginHorizontal: 15,
    borderRadius: 5,
    borderColor: AppStyles.colors.primaryColor,
    backgroundColor: '#fff',
  },
  legalBtnView: {
    flexDirection: 'row',
    // flex: 1,
    height: 60,
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
    borderWidth: 1,
  },
  statusTile: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateText: {
    color: AppStyles.colors.textColor,
    fontSize: 12,
    fontFamily: AppStyles.fonts.semiBoldFont,
    alignSelf: 'center',
  },
  transferText: {
    color: AppStyles.colors.textColor,
    fontSize: 14,
    fontFamily: AppStyles.fonts.semiBoldFont,
    alignSelf: 'center',
  },
  datePicker: {
    marginHorizontal: 15,
  },
})
