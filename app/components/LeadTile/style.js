import { StyleSheet } from 'react-native';
import AppStyles from '../../AppStyles'

export default styles = StyleSheet.create({
  tileMainWrap: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 4,
    flexDirection: 'row',
    marginBottom: 10,
  },
  // leftimgView: {
  //   width: '40%',
  //   padding: 5,
  // },
  rightContentView: {
    width: '100%',
    padding: 5,
  },
  propertyImg: {
    width: '100%',
    borderRadius: 4,
    height: 140,
  },
  blueColor: {
    color: '#0E73EE',
    fontWeight: '600'
  },
  lightColor: {
    color: '#9E9EA0'
  },
  largeText: {
    fontSize: 18,
    width: '75%',
  },
  contentMultiMain: {
    flexDirection: 'row',
  },
  topIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    position: 'absolute',
    top: 10,
    right: 10,
  },
  normalText: {
    width: '75%',
  },
  contentMainWrap: {
    position: 'relative',
    flexDirection: 'row',
    marginTop: 5,
  },
  leftContent: {
    width: '85%',
  },
  phoneMain: {
    justifyContent: 'flex-end',
    width: '15%',
  },
  tokenLabel: {
    borderWidth: 1,
    borderColor: '#2A7EF0',
    overflow: 'hidden',
    borderRadius: 12,
    color: '#2A7EF0',
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 12,
  },
  tokenLabelDark: {
    borderWidth: 1,
    borderColor: '#5B5B5B',
    overflow: 'hidden',
    borderRadius: 12,
    color: '#5B5B5B',
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 20,
    paddingRight: 20,
    fontSize: 12,
  },
  viewStyle: {
    maxWidth: '70%',
    minWidth: '40%',
  },
  fireIcon: {
    width: 22,
    height: 22,
  },
  verticalIcon: {
    position: 'relative',
    top: -5,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '600',
    paddingLeft: 3
  },
  priceColor: {
    color: '#2A7EF0',
  },
  selectedInventory: {
    borderColor: '#2A7EF0',
    borderWidth: 1,
  },
  actionBtn:{
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
  },
  desBlue:{
    color: '#0E73EE'
  },
  desDark:{
    color: '#000'
  },
});