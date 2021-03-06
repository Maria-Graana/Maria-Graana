/** @format */

import { StyleSheet } from 'react-native'
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  mainTileView: {
    backgroundColor: '#fff',
    padding: 15,
    position: 'relative',
    marginBottom: 15,
    elevation: 5,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: '#33333312',
    shadowOpacity: 1,
  },
  tileIndex: {
    zIndex: 10,
  },
  contentView: {
    position: 'relative',
    paddingRight: 15,
  },
  fontBold: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  meetingCon: {
    fontSize: 14,
    color: '#0D73EE',
    textTransform: 'capitalize',
  },
  border: {
    width: '99%',
    flexDirection: 'row',
  },
  dotsWrap: {
    zIndex: 20,
    flexDirection: 'row',
    position: 'absolute',
    right: 0,
    top: -3,
  },
  dotsImg: {
    width: 14,
    height: 24,
    resizeMode: 'contain',
  },
  doneBtn: {
    position: 'relative',
    top: -8,
    padding: 7,
  },
  doneText: {
    overflow: 'hidden',
    color: AppStyles.colors.subTextColor,
    position: 'relative',
    fontSize: 14,
    marginTop: 5,
  },
  uperCase: {
    textTransform: 'capitalize',
  },
  dropDownMain: {
    zIndex: 10,
    position: 'absolute',
    right: 15,
    top: '100%',
    width: 190,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ebebeb',
    borderRadius: 4,
    padding: 10,
  },
  doneBtnBottom: {
    paddingTop: 0,
    paddingLeft: 10,
    marginBottom: 7,
    marginTop: 7,
  },
  blueColor: {
    color: '#333',
  },
})
