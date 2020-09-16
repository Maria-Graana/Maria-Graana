import { StyleSheet } from 'react-native'

export default styles = StyleSheet.create({
  mainFormWrap: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  customTop: {
    top: 7,
    right: 30,
    width: 100,
  },
  maiinDetailBtn: {
    flexDirection: 'row',
  },
  unitDetailInput: {
    width: '70%',
  },
  mainDetailViewBtn: {
    width: '30%',
    paddingLeft: 15,
  },
  unitDetailBtn: {
    borderWidth: 1,
    borderColor: '#016FF2',
    height: 48,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  detailBtnText: {
    textAlign: 'center',
    color: '#016FF2',
  },
  removePad: {
    paddingTop: 0,
  },
  addMoreBtnMain: {
    flexDirection: 'row'
  },
  backgroundBlue: {
    backgroundColor: '#0070f1',
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 8,
    paddingTop: 8,
    borderRadius: 4,
    position: 'relative',
  },
  priceValue: {
    color: '#fff',
    fontSize: 18,
    marginTop: 0,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  finalPrice: {
    marginBottom: 2,
    color: '#fff',
    fontSize: 10,
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
});