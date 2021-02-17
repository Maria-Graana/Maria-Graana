/** @format */

import { StyleSheet } from 'react-native'
export default styles = StyleSheet.create({
  mainFormWrap: {
    flex: 1,
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
    marginTop: 15,
    backgroundColor: '#fff',
  },
  noMargTop: {
    marginTop: 0,
    marginBottom: 10,
  },
  addPaymentBtnImg: {
    resizeMode: 'contain',
    width: 15,
    marginRight: 5,
    height: 15,
    position: 'relative',
    top: 3,
  },
  firstContainer: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  addPaymentBtnText: {
    color: '#006ff1',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  paymentsHeading: {
    backgroundColor: '#006ff1',
    color: '#fff',
    paddingTop: 15,
    paddingBottom: 15,
    fontSize: 17,
    paddingLeft: 10,
  },
  mainPaymentWrap: {
    backgroundColor: '#fff',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  scrollHeight: {
    height: 280,
  },
  removePad: {
    padding: 0,
  }
})
