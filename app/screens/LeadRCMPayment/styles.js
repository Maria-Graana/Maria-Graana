/** @format */

import { StyleSheet, Platform } from 'react-native'
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  viewButtonStyle: {
    backgroundColor: AppStyles.colors.primaryColor,
    height: 40,
    borderBottomEndRadius: 10,
    borderBottomLeftRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTextStyle: {
    fontFamily: AppStyles.fonts.boldFont,
    color: 'white',
    fontSize: 16,
  },
  mainBlackWrap: {
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 10,
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 4,
    overflow: 'hidden',
  },
  blackInputWrap: {
    width: '50%',
    padding: 5,
  },
  fullWidth: {
    width: '100%',
  },
  blackInputText: {
    color: '#000',
    marginBottom: 2,
    marginLeft: 3,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  blackInput: {
    minHeight: 30,
    fontSize: 14,
    marginLeft: 3,
    fontWeight: 'bold',
    color: '#0F74EE',
  },
  blackInputdate: {
    width: '32%',
    borderRadius: 4,
  },
  dateText: {
    width: '20%',
    minHeight: 30,
    alignSelf: 'center',
    fontSize: 10,
  },
  sideBtnInput: {
    width: '30%',
    borderRadius: 4,
  },
  addBtnColorLeft: {
    backgroundColor: '#0D73EE',
  },
  addBtnColorRight: {
    backgroundColor: 'transparent',
  },
  addImg: {
    width: 30,
    height: 30,
    marginTop: 5,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
  addPaymentBtn: {
    flexDirection: 'row',
    borderColor: '#006ff1',
    borderRadius: 4,
    borderWidth: 1,
    color: '#006ff1',
    textAlign: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
    borderRadius: 4,
    marginBottom: 0,
    justifyContent: 'center',
    marginTop: 5,
    // backgroundColor: '#fff',
  },
  addPaymentBtnImg: {
    resizeMode: 'contain',
    width: 15,
    marginRight: 5,
    height: 15,
    position: 'relative',
  },
  addPaymentBtnText: {
    color: '#006ff1',
    fontSize: 14,
    fontFamily: AppStyles.fonts.semiBoldFont,
    letterSpacing: 2,
  },
  checkBoxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  checkBox: {
    width: 22,
    height: 22,
    alignItems: 'center',
    marginRight: 15,
  },
  legalServicesButton: {
    flexDirection: 'row',
    borderRadius: 4,
    borderWidth: 1,
    textAlign: 'center',
    paddingTop: 15,
    paddingBottom: 15,
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
    borderRadius: 4,
    marginBottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthlyTile: {
    flexDirection: 'row',
    borderRadius: 4,
    color: '#006ff1',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
    borderRadius: 4,
    marginBottom: 0,
    justifyContent: 'space-between',
    marginTop: 15,
    backgroundColor: '#fff',
    padding: 10,
    height: 55,
  },
  monthlyText: {
    color: '#006ff1',
    fontSize: 14,
    fontFamily: AppStyles.fonts.boldFont,
    letterSpacing: 2,
  },
  monthlyPayment: {
    fontSize: 10,
    fontFamily: AppStyles.fonts.semiBoldFont,
    letterSpacing: 2,
  },
  monthlyDetailsBtn: {
    borderRadius: 20,
    borderColor: '#006ff1',
    borderWidth: 1,
    padding: 5,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  monthlyDetailText: {
    color: '#006ff1',
    fontSize: 12,
    fontFamily: AppStyles.fonts.semiBoldFont,
    letterSpacing: 2,
    alignSelf: 'center',
  },
})
