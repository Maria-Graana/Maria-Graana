import { StyleSheet } from 'react-native';
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  // dotsWrap: {
  //   zIndex: 20,
  //   flexDirection: 'row',
  //   position: 'absolute',
  //   right: 0,
  //   top: 0,
  // },
  dotsImg: {
    width: 10,
    height: 20,
    resizeMode: 'contain'
  },
  doneBtn: {
    position: 'relative',
    top: -2,
  },
  doneText: {
    borderWidth: 1,
    borderColor: '#2A7EF0',
    overflow: 'hidden',
    borderRadius: 12,
    color: '#2A7EF0',
    position: 'relative',
    top: -4,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 10,
    paddingRight: 10,
    marginRight: 10,
    fontSize: 12,
    textTransform: 'capitalize'
  },
  dropDownMain: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ebebeb',
    borderRadius: 4,
    padding: 10,
    // paddingTop: 30,
  },
  doneBtnBottom: {
    paddingTop: 8,
    paddingBottom: 8,
    marginBottom: 7,
    marginTop: 7,
    alignItems: 'center',
    width: '100%'
  },
  textStyle: {
    fontSize: AppStyles.fontSize.medium,
    marginHorizontal: 5,
    letterSpacing: 0.5,
    color:AppStyles.colors.textColor,
    fontFamily: AppStyles.fonts.defaultFont,
    
  },
  timesBtn: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  tickImageStyle: {
    width: 13,
    height: 13,
    marginTop: 3,
    resizeMode: 'contain',
    position: 'relative',
    top: 2,
},
textColorBlue:{
  color: '#0E73EE'
},
  timesImg: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});