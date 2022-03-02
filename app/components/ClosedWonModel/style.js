/** @format */

import { StyleSheet } from 'react-native'

export default styles = StyleSheet.create({
  modalMain: {
    borderRadius: 7,
    overflow: 'hidden',
    zIndex: 5,
    position: 'relative',
    elevation: 5,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: '#33333312',
    shadowOpacity: 1,
    paddingHorizontal: 10,
    // paddingTop: 15,
    // height: '60%',
  },
  mainTextWrap: {
    backgroundColor: '#fff',
    paddingTop: 30,
    paddingHorizontal: 20,
    borderRadius: 4,
    borderColor: '#ddd',
  },
  closeBtn: {
    position: 'absolute',
    right: 15,
    top: 15,
  },
  MainTileView: {
    borderBottomWidth: 1,
    borderColor: '#ECECEC',
    paddingTop: 15,
    paddingBottom: 15,
  },
  smallText: {
    color: '#1F2029',
    fontSize: 12,
  },
  largeText: {
    color: '#1F2029',
    fontSize: 14,
    fontWeight: '600',
    paddingVertical: 20,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  topTextMain: {
    fontSize: 18,
    marginTop: 5,
    fontWeight: '600',
  },
  noramlText: {
    fontSize: 16,
    marginBottom: 10,
  },
  mainTextLarge: {
    fontWeight: 'bold',
    marginLeft: 5,
  },
  confirmBtnView: {
    marginTop: 30,
    alignItems: 'center',
    backgroundColor: '#0f73ee',
    borderRadius: 4,
    height: 50,
    marginBottom:30
  },
  confirmBtn: {
    backgroundColor: '#0f73ee',
  },
  activeBtn: {
    backgroundColor: '#0070f1',
    color: '#fff',
  },
  textCenter: {
    paddingTop: 12,
    paddingBottom: 12,
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loaderStyle: {
    marginTop: 8,
  },
  loaderHeight: {
    width: 20,
    height: 20,
  },
})
