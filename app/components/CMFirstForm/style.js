/** @format */

import { StyleSheet } from 'react-native'
import AppStyles from '../../AppStyles'
export default styles = StyleSheet.create({

  parkingAvaiable:{
    paddingLeft: 10,
    paddingRight: 10,
    color: '#23232C',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  parkingCharges: {
    marginBottom: 10,
    marginTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    color: '#23232C',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  mainFormWrap: {
    flex: 1,
    paddingHorizontal: 10,
  },
  mainInputWrap: {
    marginBottom: 10,
    marginTop: 10,
  },
  bookNowBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#006ff1',
  },
  bookNowBtnText: {
    color: '#006ff1',
    fontFamily: AppStyles.fonts.boldFont,
    letterSpacing: 2,
    paddingTop: 18,
    paddingBottom: 18,
    textAlign: 'center',
    fontSize: 18,
  },
  backgroundBlue: {
    backgroundColor: '#0070f1',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 11,
    paddingTop: 11,
    borderRadius: 4,
    position: 'relative',
  },
  finalPrice: {
    marginBottom: 2,
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  priceValue: {
    color: '#fff',
    fontSize: 18,
    marginTop: 0,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  sidePriceFormat: {
    position: 'absolute',
    right: 20,
    bottom: 12,
    color: '#fff',
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  unitDetailBtn: {
    borderWidth: 1,
    borderColor: '#016FF2',
    height: 53,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  unitSubmitView: {
    width: '50%',
  },
  detailBtnText: {
    textAlign: 'center',
    color: '#016FF2',
  },
  mainDetailViewBtn: {
    width: '30%',
    paddingLeft: 15,
  },
  unitDetailInput: {
    width: '70%',
  },
  btnView: { paddingVertical: 10, flex: 1 },
})
