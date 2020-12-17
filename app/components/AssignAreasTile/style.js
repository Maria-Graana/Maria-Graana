/** @format */

import { StyleSheet, Platform } from 'react-native'
export default styles = StyleSheet.create({
  mainTile: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#eaeaea',
  },
  leftWrap: {
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  countStyle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f73ee',
    borderWidth: 1,
    borderColor: '#0f73ee',
    width: Platform.OS === 'ios' ? 35 : 35,
    height: Platform.OS === 'ios' ? 35 : 35,
    borderRadius: Platform.OS === 'ios' ? 18 : 50,
    textAlign: 'center',
    paddingTop: 8,
  },
  rightWrap: {
    padding: 10,
  },
  cityName: {
    fontSize: 16,
    textTransform: 'capitalize',
  },
  areaName: {
    fontSize: 14,
    color: '#70757a',
    textTransform: 'capitalize',
  },
  mainView: {
    borderColor: AppStyles.colors.primaryColor,
    height: 35,
    width: 35,
    borderWidth: 1,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    fontSize: 16,
    fontFamily: AppStyles.fonts.defaultFont,
    color: AppStyles.colors.primaryColor,
  },
})
