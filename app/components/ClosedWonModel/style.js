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
    paddingTop: 15,
  },
  mainTextWrap: {
    backgroundColor: '#fff',
    paddingTop: 30,
    paddingHorizontal: 20,
    borderRadius: 4,
    borderColor: '#ddd',
  },
  titleView: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingBottom: 20
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
    paddingVertical: 10,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  topTextMain: {
    fontSize: 18,
    marginTop: 5,
    fontWeight: '600',
    marginLeft: 10,
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
    // backgroundColor: '#0f73ee',
    // borderRadius: 4,
    // height: 50,
    // marginBottom:30,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  confirmBtnInnerView: {
    backgroundColor: '#0f73ee',
    borderRadius: 4,
    height: 50,
    marginBottom:30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtn: {
    backgroundColor: '#0f73ee',
  },
  activeBtn: {
    backgroundColor: '#0070f1',
    color: '#fff',
  },
  textCenter: {
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
