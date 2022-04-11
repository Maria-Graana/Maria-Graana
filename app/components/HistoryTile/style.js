/** @format */

import { StyleSheet } from 'react-native'
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  mainTileView: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    marginBottom: 15,
    elevation: 5,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: '#33333312',
    shadowOpacity: 1,
    flexDirection: 'row',
  },
  tileIndex: {
    zIndex: 10,
  },
  contentView: {
    position: 'relative',
  },
  fontBold: {
    fontSize: 13,
    color: 'grey',
  },
  meetingCon: {
    fontSize: 16,
    color: 'black',
    textTransform: 'capitalize',
    fontWeight: '700',
  },
  border: {
    width: '99%',
    flexDirection: 'row',
  },
  dotsWrap: {
    zIndex: 20,
    position: 'absolute',
    right: 0,
    top: -3,
  },
  dotsImg: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  doneImg: {
    width: 18,
    height: 18,
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
  taskTypeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
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
    color: '#006FF2',
    fontSize: 15,
  },
  DayAndTime: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  // taskType: {
  //   paddingLeft: 30,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  // },
  reasonWrap: {
    flexDirection: 'row',
    marginTop: 8,
    marginLeft: 50,
  },
  reasonTag: {
    borderWidth: 2,
    padding: 3,
    paddingHorizontal: 5,
    borderRadius: 15,
    marginTop: -3,
    marginLeft: 5,
  },
  responseWrap: {
    paddingLeft: 15,
    marginTop: 3,
    marginLeft: 35,
  },
  feedbackTag: {
    padding: 3,
    marginLeft: 45,
    paddingTop: 5,
  },
  outcomeWrap: {
    paddingLeft: 15,
    marginTop: 3,
    marginLeft: 33,
  },
  taskWrap: {
    paddingLeft: 10,
    paddingRight: 10,
  },
})
